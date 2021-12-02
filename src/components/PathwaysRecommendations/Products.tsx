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
import { Carousel, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ItemFragment } from '@bloomreach/connector-components-react';

import { DOCUMENTS_PER_SLIDE } from './PathwaysRecommendations';
import { Product } from './Product';

import styles from './Products.module.scss';

interface ProductsProps {
  products: ItemFragment[];
  interval?: number;
}

export function Products({ products, interval }: ProductsProps): React.ReactElement | null {
  const slides = useMemo(() => {
    const result = [];
    const productsCpy = [...products];
    while (productsCpy.length) {
      result.push(productsCpy.splice(0, DOCUMENTS_PER_SLIDE));
    }
    return result;
  }, [products]);

  if (!slides.length) {
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
    <Carousel
      controls={products.length > 4}
      indicators={false}
      interval={interval}
      prevIcon={<FontAwesomeIcon icon={faChevronLeft} size="2x" className="text-secondary" />}
      nextIcon={<FontAwesomeIcon icon={faChevronRight} size="2x" className="text-secondary" />}
      className={styles.carousel}
    >
      {slides.map((slide, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Carousel.Item key={index}>
          <Row>
            {slide.map((product) => (
              <Col key={`${product.itemId.id}___${product.itemId.code}`} md={3} className="mb-3">
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
