/*
 * Copyright 2021 Bloomreach
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

import React, { useState, useEffect, useMemo } from 'react';
import { Alert, Col, Row } from 'react-bootstrap';
import { BrProps } from '@bloomreach/react-sdk';
import { ContainerItem, getContainerItemContent } from '@bloomreach/spa-sdk';
import styles from './ProductHighlight.module.scss';
import { ProductHighlightItem } from './ProductHighlightItem';

interface ProductHighlightCompound {
  title: string;
  connectorid: { selectionValues: [{ key: string; label: string }] };
  commerceProductCompound?: [{ productid: string; variantid: string }];
}

export function ProductHighlight({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  const [error, setError] = useState<Error>();
  const { title, connectorid, commerceProductCompound } =
    getContainerItemContent<ProductHighlightCompound>(component, page) ?? {};
  const connectorId = connectorid?.selectionValues[0].key;
  const productRefs = useMemo(
    () =>
      commerceProductCompound?.map(({ productid, variantid }) => {
        const selectedId = variantid?.length ? variantid : productid;
        const [, id, code] = selectedId.match(/id=([\w\d._=-]+[\w\d=]?)?;code=([\w\d._=/-]+[\w\d=]?)?/i) ?? [];
        return { id, code };
      }),
    [commerceProductCompound],
  );

  // Reset error when no items configured
  useEffect(() => {
    if (!productRefs?.length) {
      setError(undefined);
    }
  }, [productRefs]);

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
        {productRefs
          ?.filter((productRef) => !!productRef.id || !!productRef.code)
          ?.map((productRef) => (
            <Col
              key={`${productRef.id ?? ''}___${productRef.code ?? ''}`}
              as={ProductHighlightItem}
              md="3"
              className="mb-4"
              itemId={{ id: productRef.id, code: productRef.code }}
              connectorId={connectorId}
              setError={setError}
            />
          ))}
      </Row>
    </div>
  );
}
