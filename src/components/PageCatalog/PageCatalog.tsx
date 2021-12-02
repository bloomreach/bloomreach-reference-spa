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

import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Document, Pagination as BrPagination, Reference } from '@bloomreach/spa-sdk';
import { BrProps } from '@bloomreach/react-sdk';

import { Page } from './Page';
import { Pagination } from './Pagination';
import styles from './PageCatalog.module.scss';

interface PageCatalogModels {
  pagination: Reference;
}

interface PageCatalogParameters {
  title?: string;
  pagination: boolean;
  total: boolean;
}

export function PageCatalog({ component, page }: BrProps): React.ReactElement | null {
  const { title, total, pagination: isPagination } = component.getParameters<PageCatalogParameters>();
  const { pagination: paginationRef } = component.getModels<PageCatalogModels>();
  const pagination = paginationRef && page.getContent<BrPagination>(paginationRef);

  if (!pagination) {
    return page.isPreview() ? <div /> : null;
  }

  const documents = pagination
    .getItems()
    .map((ref) => page.getContent<Document>(ref))
    .filter<Document>(Boolean as any);

  return (
    <div className="mw-container mx-auto">
      {title && <h4 className="mb-4">{title}</h4>}
      {total && (
        <div className="mb-4 text-muted">
          {`${pagination.getOffset() + 1}-${
            pagination.getOffset() + pagination.getSize()
          } of ${pagination.getTotal()} articles`}
        </div>
      )}
      <Row as="ul" className="list-unstyled mb-0">
        {documents.map((document) => (
          <Col key={document.getId()} as="li" sm="auto" className={`${styles['page-catalog__page']} mw-100 mb-4`}>
            <Page document={document} />
          </Col>
        ))}
      </Row>

      {isPagination && <Pagination pagination={pagination} className="mb-4" />}
    </div>
  );
}
