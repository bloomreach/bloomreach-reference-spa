/*
 * Copyright 2020-2021 Bloomreach
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

import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Alert } from 'react-bootstrap';
import { BrProps } from '@bloomreach/react-sdk';
import { ContainerItem } from '@bloomreach/spa-sdk';

import styles from './Video.module.scss';

interface VideoParameters {
  url: string;
}

export function Video({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  const { url } = component.getParameters<VideoParameters>();
  const [hasError, setHasError] = useState(false);

  if (!url || component.isHidden()) {
    return page.isPreview() ? <div /> : null;
  }

  return (
    <div className="mw-container mx-auto my-4">
      {page.isPreview() && <div className="pb-3" />}
      {hasError && <Alert variant="danger">This widget is not working properly. Try again later.</Alert>}
      <div className={`${styles.video__container} position-relative h-0`}>
        <ReactPlayer
          url={url}
          controls
          width="100%"
          height="100%"
          style={{ position: 'absolute' }}
          onError={() => setHasError(true)}
          onReady={() => setHasError(false)}
        />
      </div>
    </div>
  );
}
