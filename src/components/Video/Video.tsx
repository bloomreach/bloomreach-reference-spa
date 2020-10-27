/*
 * Copyright 2020 Hippo B.V. (http://www.onehippo.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import ReactPlayer from 'react-player';
import { BrProps } from '@bloomreach/react-sdk';

import styles from './Video.module.scss';

interface VideoParameters {
  url: string;
}

export function Video({ component, page }: BrProps): React.ReactElement | null {
  const { url } = component.getParameters<VideoParameters>();

  if (!url) {
    return page.isPreview() ? <div /> : null;
  }

  return (
    <div className="mw-container mx-auto my-4">
      <div className={`${styles.video__container} position-relative h-0`}>
        <ReactPlayer url={url} controls width="100%" height="100%" style={{ position: 'absolute' }} />
      </div>
    </div>
  );
}
