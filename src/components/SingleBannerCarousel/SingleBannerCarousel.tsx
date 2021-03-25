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
import { Carousel, Row } from 'react-bootstrap';
import { Reference } from '@bloomreach/spa-sdk';
import { BrManageContentButton, BrProps } from '@bloomreach/react-sdk';
import { getEffectiveMultipleDocumentParameters } from '../param-utils';

import { Banner } from './Banner';
import styles from './SingleBannerCarousel.module.scss';

const MAX_DOCUMENTS = 5;

interface SingleBannerCarouselModels {
  document1?: Reference;
  document2?: Reference;
  document3?: Reference;
  document4?: Reference;
  document5?: Reference;
}

interface SingleBannerCarouselParameters {
  interval?: number;
}

export function SingleBannerCarousel({ component, page }: BrProps): React.ReactElement | null {
  const { interval = 0 } = component.getParameters<SingleBannerCarouselParameters>();
  const models = component.getModels<SingleBannerCarouselModels>();
  const docParams = getEffectiveMultipleDocumentParameters(page, models, MAX_DOCUMENTS);

  if (!docParams.length) {
    return page.isPreview() ? (
      <div className="has-edit-button">
        <BrManageContentButton
          documentTemplateQuery="new-banner-document"
          folderTemplateQuery="new-banner-folder"
          parameter="document1"
          root="brxsaas/banners"
          relative
        />
      </div>
    ) : null;
  }

  return (
    <Carousel as={Row} controls={docParams.length > 1} indicators={docParams.length > 1} interval={interval}>
      {docParams.map((docParam) => (
        <Carousel.Item
          key={docParam.document.getId()}
          as={Banner}
          className={styles.carousel__banner}
          document={docParam.document}
          parameterName={docParam.parameterName}
        />
      ))}
    </Carousel>
  );
}
