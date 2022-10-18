/*
 * Copyright 2020-2022 Bloomreach
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
import { Nav, Alert } from 'react-bootstrap';
import { Document, Reference } from '@bloomreach/spa-sdk';
import { BrProps } from '@bloomreach/react-sdk';

import { Link } from './Link';

const MAX_DOCUMENTS = 5;

const DOCUMENT_PARAMS = [...Array(MAX_DOCUMENTS).keys()].map((n) => `document${n + 1}`);

interface NavigationModels {
  document1?: Reference;
  document2?: Reference;
  document3?: Reference;
  document4?: Reference;
  document5?: Reference;
}

export function Navigation({ component, page }: BrProps): React.ReactElement | null {
  const models = component?.getModels<NavigationModels>();
  const params = component?.getParameters();
  const documents = useMemo(() => {
    return DOCUMENT_PARAMS.map((model) => models && models[model as keyof NavigationModels])
      .map((reference) => reference && page && page.getContent<Document>(reference))
      .filter<Document>(Boolean as any);
  }, [models, page]);

  const error = useMemo(() => {
    return params && (
      Object.entries(params).filter(([key, value]) => DOCUMENT_PARAMS.includes(key) && value).length > documents.length
    );
  }, [documents, params]);

  if (!documents.length) {
    return page?.isPreview() ? <div /> : null;
  }

  return (
    <div>
      {error && (
        <Alert variant="danger" className="mt-3 mb-3">
          Document(s) referred by this component cannot be loaded
        </Alert>
      )}
      <Nav as="ul" className="justify-content-center justify-content-lg-start mx-n3">
        {documents.map((document) => (
          <Nav.Item key={document.getId()} as="li">
            <Nav.Link as={Link} href={document.getUrl()} className="text-reset">
              {document.getData().displayName}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
}
