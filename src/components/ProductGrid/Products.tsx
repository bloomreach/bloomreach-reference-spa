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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ItemFragment } from '@bloomreach/connector-components-react';

import { Product } from './Product';

interface ProductsProps {
  products: ItemFragment[];
}

export function Products({ products }: ProductsProps): React.ReactElement | null {
  if (!products.length) {
    return (
      <div className="text-center text-muted mb-4">
        <div className="mb-4">
          <FontAwesomeIcon icon={faSearch} size="5x" />
        </div>
        No results yet…
      </div>
    );
  }

  return (
    <Row>
      {products.map((product) => (
        <Col key={product.itemId.id} as={Product} sm="4" product={product} className="mb-4" />
      ))}
    </Row>
  );
}
