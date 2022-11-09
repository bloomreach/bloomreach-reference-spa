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
import { useCategories, CategoriesInputProps } from '@bloomreach/connector-components-react';
import styles from './CategoryHighlight.module.scss';
import { CommerceContext } from '../CommerceContext';
import { CategoryHighlightItem } from './CategoryHighlightItem';
import { isLoading, parseCategoryPickerField } from '../../src/utils';

interface CategoryHighlightCompound {
  title: string;
  connectorid: { selectionValues: [{ key: string; label: string }] };
  commerceCategoryCompound?: [{ categoryid: string }];
}

export function CategoryHighlight({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  const {
    title,
    connectorid: connectorIdSel,
    commerceCategoryCompound,
  } = (component && page
    && getContainerItemContent<CategoryHighlightCompound>(component, page)) ?? {} as CategoryHighlightCompound;
  const { categoryIds, connectorId } = useMemo(
    () => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      let connectorId: string | undefined;
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const categoryIds: string[] = commerceCategoryCompound?.map(({ categoryid }) => {
        const { categoryId, connectorId: connId } = parseCategoryPickerField(categoryid) ?? {};
        connectorId = connectorId || connId;
        return categoryId;
      }).filter(Boolean as any) ?? [];
      connectorId = connectorId || connectorIdSel?.selectionValues[0].key;
      return {
        categoryIds,
        connectorId,
      };
    },
    [commerceCategoryCompound, connectorIdSel?.selectionValues],
  );

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
  const params: CategoriesInputProps = useMemo(
    () => ({
      categoryIds,
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
      categoryIds,
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
  const [categories, loading, apiError] = useCategories(params);

  if (!categories && apiError) {
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
        {!isLoading(loading) && categories
          ?.map((category) => (
            <Col
              key={`${category?.id}`}
              as={CategoryHighlightItem}
              md="3"
              className="mb-4"
              category={category}
            />
          ))}
      </Row>
    </div>
  );
}
