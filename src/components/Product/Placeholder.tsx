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
import { Col, Row, Table } from 'react-bootstrap';

import styles from './Placeholder.module.scss';

export function Placeholder(): React.ReactElement {
  return (
    <Row>
      <Col md={{ span: 8, order: 1 }}>
        <div className="shimmer w-75 py-3 mb-4" />
        <div className="shimmer w-50 py-2 mb-1" />
        <div className="shimmer w-50 py-2 mb-4" />
        <div className="shimmer w-25 py-3 mb-4" />
      </Col>
      <Col md={{ span: 4, order: 0 }}>
        <div className={`${styles.placeholder__image} shimmer mb-4`} />
      </Col>
      <Col md={{ order: 2 }} lg="9">
        <div className="shimmer w-50 py-3 mb-4" />
        <div className="shimmer w-75 py-2 mb-1" />
        <div className="shimmer w-50 py-2 mb-4" />

        <div className="shimmer w-50 py-3 mb-4" />
        <Table responsive className="mb-4">
          <thead className="thead-light">
            <tr>
              <th>
                <div className="shimmer w-25 py-2" />
              </th>
              <th>
                <div className="shimmer w-25 py-2" />
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10).keys()].map((key) => (
              <tr key={key}>
                <td>
                  <div className="shimmer w-50 py-2" />
                </td>
                <td>
                  <div className="shimmer w-50 py-2" />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
}
