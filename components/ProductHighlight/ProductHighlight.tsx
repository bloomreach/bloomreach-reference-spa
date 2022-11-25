/*
 * Copyright 2021-2022 Bloomreach
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

import React, { useContext, useMemo } from 'react';
import { Alert, Col, Row } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { BrProps } from '@bloomreach/react-sdk';
import { ContainerItem, getContainerItemContent } from '@bloomreach/spa-sdk';
import { ProductsByIdsInputProps, useProductsByIds } from '@bloomreach/connector-components-react';
import { CommerceContext } from '../CommerceContext';
import styles from './ProductHighlight.module.scss';
import { ProductHighlightItem } from './ProductHighlightItem';
import { isLoading, parseProductPickerField } from '../../src/utils';

interface ProductHighlightCompound {
  title: string;
  connectorid: { selectionValues: [{ key: string; label: string }] };
  commerceProductCompound?: [{ productid?: string; variantid?: string }];
}

export function ProductHighlight({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  const {
    title,
    connectorid: connectorIdSel,
    commerceProductCompound,
  } = (component && page
    && getContainerItemContent<ProductHighlightCompound>(component, page)) ?? {} as ProductHighlightCompound;
  const { productRefs, connectorId } = useMemo(
    () => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      let connectorId: string | undefined;
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const productRefs: string[] = commerceProductCompound?.map(({ productid, variantid }) => {
        const { itemId, connectorId: connId } = parseProductPickerField(productid, variantid) ?? {};
        connectorId = connectorId || connId;
        return itemId;
      }).filter(Boolean as any) ?? [];

      connectorId = connectorId || connectorIdSel?.selectionValues[0].key;

      return {
        productRefs,
        connectorId,
      };
    },
    [commerceProductCompound, connectorIdSel?.selectionValues],
  )!;

  const {
    discoveryAccountId,
    discoveryAuthKey,
    discoveryConnector,
    discoveryCustomAttrFields,
    discoveryCustomVarAttrFields,
    discoveryCustomVarListPriceField,
    discoveryCustomVarPurchasePriceField,
    discoveryDomainKey,
    discoveryViewId,
    brEnvType,
  } = useContext(CommerceContext);

  const [cookies] = useCookies(['_br_uid_2']);
  const params: ProductsByIdsInputProps = useMemo(
    () => ({
      itemIds: productRefs,
      brUid2: cookies._br_uid_2,
      connector: connectorId ?? discoveryConnector,
      customAttrFields: discoveryCustomAttrFields,
      customVariantAttrFields: discoveryCustomVarAttrFields,
      customVariantListPriceField: discoveryCustomVarListPriceField,
      customVariantPurchasePriceField: discoveryCustomVarPurchasePriceField,
      discoveryAccountId,
      discoveryAuthKey,
      discoveryDomainKey,
      discoveryViewId,
      brEnvType,
    }),
    [
      productRefs,
      cookies._br_uid_2,
      discoveryCustomAttrFields,
      discoveryAccountId,
      discoveryAuthKey,
      discoveryConnector,
      discoveryCustomVarAttrFields,
      discoveryCustomVarListPriceField,
      discoveryCustomVarPurchasePriceField,
      discoveryDomainKey,
      discoveryViewId,
      connectorId,
      brEnvType,
    ],
  );

  const [, result, loading, apiErr] = useProductsByIds(params);

  // If a variant is selected, retrieve the actual variant from the resultset. Otherwise, return the main product.
  const items = useMemo(() => {
    if (!result?.items) {
      return undefined;
    }
    return productRefs.map((selectedItemId) => {
      for (let i = 0; i < result.items.length; i++) {
        const item = result.items[i];
        if (!item) {
          continue;
        }
        const itemId = `${item.itemId.id ?? ''}___${item.itemId.code ?? item.itemId.id ?? ''}`;
        if (selectedItemId === itemId) {
          // return the main product if its id/code matches the selection
          return item;
        }

        // otherwise, continue searching thru the variants (if any) of the main product to see if there is any match
        const variant = item.variants?.find((v) => {
          if (!v) {
            return false;
          }
          const variantId = `${v.itemId.id ?? ''}___${v.itemId.code ?? v.itemId.id ?? ''}`;
          return selectedItemId === variantId;
        });
        if (variant) {
          return variant;
        }
      }
      return null;
    }).filter(Boolean);
  }, [productRefs, result?.items]);

  if (!result && apiErr) {
    return (
      <div>
        <Alert variant="danger" className="mt-3 mb-3">
          This widget is not working properly. Try again later.
        </Alert>
      </div>
    );
  }

  return (
    <div className={`${styles.highlight} mw-container mx-auto`}>
      <div className={styles.grid__header}>{title && <h4 className="mb-4">{title}</h4>}</div>
      <Row>
        {!isLoading(loading) && items
          ?.map((item) => (
            <Col
              key={`${item?.itemId.id ?? ''}___${item?.itemId.code ?? ''}`}
              as={ProductHighlightItem}
              md="3"
              className="mb-4"
              itemDetail={item}
            />
          ))}
      </Row>
    </div>
  );
}
