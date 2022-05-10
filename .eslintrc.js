/*
 * Copyright 2022 Bloomreach. All rights reserved. (https://www.bloomreach.com/)
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * @rushstack/eslint-patch is used to include plugins as dev
 * dependencies instead of imposing them as peer dependencies
 *
 * https://www.npmjs.com/package/@rushstack/eslint-patch
 *
 * Additionally it helps to fix issue with a different "import"
 * plugin in "eslint-config-airbnb-base" and "eslint-config-next"
 */
// eslint-disable-next-line import/no-extraneous-dependencies
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: ['@bloomreach/eslint-config-base', 'plugin:react/jsx-runtime', 'eslint-config-next'],
  overrides: [
    {
      files: [
        '*.tsx',
      ],
      rules: {
        'react/require-default-props': 'off',
      },
    },
  ],
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'react/no-danger': 'off',
    'react/display-name': 'off',
    'no-underscore-dangle': [
      'error',
      {
        allow: [
          '_br_uid_2',
        ],
      },
    ],
    'implicit-arrow-linebreak': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
  },
};
