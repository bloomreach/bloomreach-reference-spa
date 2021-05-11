/*!
 * Copyright 2021 Bloomreach. All rights reserved. (https://www.bloomreach.com/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

pipeline {
  agent {
    docker {
      label 'docker'
      image 'node:12'
      args '-v  /etc/passwd:/etc/passwd'
    }
  }

  options {
    gitLabConnection('https://code.bloomreach.com/')
  }

  triggers {
    gitlab(
      triggerOnPush: true,
      triggerOnMergeRequest: false,
      includeBranchesSpec: 'release/saas',
      pendingBuildName: 'Reference SPA'
    )
  }

  stages {
    stage('Reference SPA') {
      when {
        tag 'reference-spa-*'
      }

      environment {
        VERSION = sh(script: 'echo $TAG_NAME | sed "s/^[^0-9]*\\([0-9].*\\)$/\\1/"', returnStdout: true).trim()
      }

      stages {
        stage('Verify') {
          steps {
            dir('community/reference-spa') {
              sh 'HOME=$(pwd) npm ci'
              sh 'npm run build'
              sh 'npm run lint'
            }
          }
        }

        stage('Deploy to Heroku') {
          steps {
            dir('community/reference-sdk') {
              sh 'git init'
              sh 'git config user.email "jenkins@onehippo.com"'
              sh 'git config user.name "Jenkins"'
              sh 'git add -A && git commit -m "Deploy $VERSION"'

              withCredentials([[$class: 'StringBinding', credentialsId: 'HEROKU_API_KEY', variable: 'HEROKU_API_KEY']]) {
                sh 'git push --force https://heroku:$HEROKU_API_KEY@git.heroku.com/brxm-react-spa.git master'
              }
            }
          }

          post {
            cleanup {
              dir('community/reference-spa/.git') { deleteDir() }
            }
          }
        }

        stage('Publish on GitHub') {
          environment {
            GIT_SSH_COMMAND='ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no'
          }

          steps {
            sh 'git checkout -B github-master-$VERSION'
            sh 'git filter-branch --force --prune-empty --subdirectory-filter community/reference-spa github-master-$VERSION'
            sh 'git tag --force github-tag-$VERSION'

            sshagent (credentials: ['sample-spa-github']) {
              sh 'git push git@github.com:bloomreach/brx-react-spa.git github-master-$VERSION:master'
              sh 'git push git@github.com:bloomreach/brx-react-spa.git github-tag-$VERSION:$VERSION'
            }
          }

          post {
            cleanup {
              sh 'git checkout $TAG_NAME'
              sh 'git tag -d github-tag-$VERSION'
              sh 'git update-ref -d refs/original/refs/heads/github-master-$VERSION'
              sh 'git branch -D github-master-$VERSION'
            }
          }
        }
      }
    }
  }
}
