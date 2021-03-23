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
import { Col, Row } from 'react-bootstrap';
import { Document, Reference } from '@bloomreach/spa-sdk';
import { BrProps } from '@bloomreach/react-sdk';

import { Banner } from './Banner';

const MAX_DOCUMENTS = 8;

interface BannerCollectionModels {
  document1?: Reference;
  document2?: Reference;
  document3?: Reference;
  document4?: Reference;
  document5?: Reference;
  document6?: Reference;
  document7?: Reference;
  document8?: Reference;
}

interface BannerCollectionParameters {
  title?: string;
}

export function BannerCollection({ component, page }: BrProps): React.ReactElement | null {
  const { title } = component.getParameters<BannerCollectionParameters>();
  const models = component.getModels<BannerCollectionModels>();
  const documents = [...Array(MAX_DOCUMENTS).keys()]
    .map((n) => `document${n + 1}` as keyof BannerCollectionModels)
    .map((model) => models[model])
    .map((reference) => reference && page.getContent<Document>(reference))
    .filter<Document>(Boolean as any);

  if (!documents.length) {
    return page.isPreview() ? <div /> : null;
  }

  return (
    <div className="mw-container mx-auto my-4">
      {title && <h3 className="mb-4">{title}</h3>}
      <Row>
        {documents.map((document, index) => (
          <Col
            key={document.getId()}
            as={Banner}
            xs="6"
            md="4"
            lg="3"
            document={document}
            parameterName={`document${index + 1}`}
          />
        ))}
      </Row>
    </div>
  );
}
