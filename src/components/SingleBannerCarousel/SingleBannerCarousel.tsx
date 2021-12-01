/*
 * Copyright 2020 Bloomreach
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

import React, { useMemo } from 'react';
import { Carousel, Row, Alert } from 'react-bootstrap';
import { Reference } from '@bloomreach/spa-sdk';
import { BrManageContentButton, BrProps } from '@bloomreach/react-sdk';
import { getEffectiveMultipleDocumentParameters } from '../param-utils';

import { Banner } from './Banner';
import styles from './SingleBannerCarousel.module.scss';

const MAX_DOCUMENTS = 5;

const DOCUMENT_PARAMS = [...Array(MAX_DOCUMENTS).keys()].map((n) => `document${n + 1}`);

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
  const { interval = 0, ...params } = component.getParameters<SingleBannerCarouselParameters & Record<string, any>>();
  const models = component.getModels<SingleBannerCarouselModels>();
  const docParams = getEffectiveMultipleDocumentParameters(page, models, MAX_DOCUMENTS);
  const error = useMemo(() => {
    return (
      Object.entries(params).filter(([key, value]) => DOCUMENT_PARAMS.includes(key) && value).length > docParams.length
    );
  }, [docParams.length, params]);

  if (!docParams.length && !error) {
    return page.isPreview() ? (
      <div className="has-edit-button">
        <BrManageContentButton
          documentTemplateQuery="new-banner-document"
          folderTemplateQuery="new-banner-folder"
          parameter="document1"
          root="banners"
          relative
        />
      </div>
    ) : null;
  }

  if (error && !docParams.length) {
    return (
      <div className={`${styles.placeholder} shimmer`}>
        <Alert variant="danger" className={`${styles.error} mt-3 ml-3`}>
          Document(s) referred by this component cannot be loaded
        </Alert>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <Alert variant="danger" className={`${styles.error} mt-3 ml-3`}>
          Document(s) referred by this component cannot be loaded
        </Alert>
      )}
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
    </div>
  );
}
