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

import React, { useMemo } from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { Col, Image, Row, Table } from 'react-bootstrap';
import { Document, Reference } from '@bloomreach/spa-sdk';
import { BrProps } from '@bloomreach/react-sdk';

import { useSearch } from '../../hooks';
import { Placeholder } from './Placeholder';
import styles from './Product.module.scss';

interface ProductModels {
  specifications?: Reference;
}

export function Product({ component, page }: BrProps): React.ReactElement {
  const { smAccountId = '', smDomainKey, smEndpoint = '' } = page.getChannelParameters<ChannelParameters>();
  const { specifications: specificationsRef } = component.getModels<ProductModels>();
  const specificationsBundle = specificationsRef && page.getContent<Document>(specificationsRef);

  const match = useRouteMatch<{ id: string }>('/products/:id');
  const id = match?.params.id;

  const params = useMemo(
    () => ({
      account_id: smAccountId,
      domain_key: smDomainKey,
      q: id,
      request_type: 'search',
      search_type: 'keyword',
      fl: ['brand', 'description', 'pid', 'price', 'sale_price', 'title', 'thumb_image'],
      fq: `pid:"${id}"`,
      rows: 1,
      url: window.location.href,
    }),
    [id, smAccountId, smDomainKey],
  );
  const [results] = useSearch<ProductDocument>(smEndpoint, params);

  if (results?.response.numFound === 0) {
    return <Redirect to={page.getUrl('/404')} />;
  }

  if (!results) {
    return (
      <div className="mw-container mx-auto">
        <Placeholder />
      </div>
    );
  }

  const [{ brand, description, pid, sale_price: sale, price, title, thumb_image: thumbnail }] = results.response.docs;
  const { keys = [], messages = [] } = specificationsBundle?.getData<ResourceBundle>() ?? {};
  const specifications = keys
    .map((key, index) => ({
      key,
      label: messages[index] || key,
      value: results.facet_counts.facet_fields[key]?.[0]?.name,
    }))
    .filter(({ value }) => !!value);

  return (
    <div className="mw-container mx-auto">
      <Row>
        <Col md={{ span: 8, order: 1 }}>
          <h2 className="mb-4">{title}</h2>
          <div className="text-muted">
            Product No. <span className="text-primary ml-1">{pid}</span>
          </div>
          <div className="text-muted mb-4">
            Manufacturer <span className="text-primary ml-1">{brand}</span>
          </div>
          <h4 className="mb-4">${(sale ?? price).toFixed(2)}</h4>
        </Col>
        <Col md={{ span: 4, order: 0 }}>
          <div className={`${styles['product__image-container']} ${!thumbnail ? 'bg-light' : ''} mb-4`}>
            {thumbnail && <Image className={`${styles.product__image} w-100 h-100`} src={thumbnail} alt={title} />}
          </div>
        </Col>
        <Col md={{ order: 2 }} lg="9">
          {description && (
            <>
              <h3 className="mb-4">Features & Benefits</h3>
              <p className="mb-4">{description}</p>
            </>
          )}

          {specifications.length > 0 && (
            <>
              <h3 className="mb-4">Specifications</h3>
              <Table responsive className="mb-4">
                <thead className="thead-light">
                  <tr>
                    <th>Meta</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {specifications.map(({ key, label, value }) => (
                    <tr key={key}>
                      <td>{label}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
