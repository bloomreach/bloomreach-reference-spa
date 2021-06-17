/*
 * Copyright 2021 Hippo B.V. (http://www.onehippo.com)
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

import React, { useState, useEffect } from 'react';
import { Alert, Col, Row } from 'react-bootstrap';
import { BrProps } from '@bloomreach/react-sdk';
import styles from './ProductHighlight.module.scss';
import { ProductHighlightItem } from './ProductHighlightItem';

const MAX_PRODUCTS = 4;

export function ProductHighlight({ component }: BrProps): React.ReactElement | null {
  const [error, setError] = useState<Error>();

  const params = component.getParameters();
  const { title } = params;
  const itemIds = [...Array(MAX_PRODUCTS).keys()]
    .map((i) => ({
      id: params[`pid${i + 1}`],
      code: params[`pcode${i + 1}`],
    }))
    .filter((itemId) => itemId.id || itemId.code);

  // Reset error when no items configured
  useEffect(() => {
    if (!itemIds.length) {
      setError(undefined);
    }
  }, [itemIds]);

  if (error) {
    return (
      <Alert variant="danger" className="mt-3 mb-3">
        This widget is not working properly. Try again later.
      </Alert>
    );
  }

  return (
    <div className={`${styles.highlight} mw-container mx-auto`}>
      <div className={styles.grid__header}>{title && <h4 className="mb-4">{title}</h4>}</div>
      <Row>
        {itemIds.map((itemId) => (
          <Col
            key={`${itemId.id ?? ''}___${itemId.code ?? ''}`}
            as={ProductHighlightItem}
            md="3"
            className="mb-4"
            itemId={itemId}
            setError={setError}
          />
        ))}
      </Row>
    </div>
  );
}
