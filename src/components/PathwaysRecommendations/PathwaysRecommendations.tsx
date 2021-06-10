/*
 * Copyright 2020-2021 Hippo B.V. (http://www.onehippo.com)
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
import { useCookies } from 'react-cookie';
import { Alert, Row } from 'react-bootstrap';

import { BrProps } from '@bloomreach/react-sdk';
import { ContainerItem } from '@bloomreach/spa-sdk';
import { ProductGridWidgetInputProps, useProductGridWidget } from '@bloomreach/connector-components-react';

import { CommerceContext } from '../../CommerceContext';
import { Products } from './Products';
import { DUMMY_BR_UID_2_FOR_PREVIEW, notEmpty } from '../../utils';

import styles from './PathwaysRecommendations.module.scss';
import { ProductsPlaceholder } from '../ProductGrid/ProductsPlaceholder';

export interface PathwaysRecommendationsParameters {
  category?: string;
  interval?: number;
  keyword?: string;
  limit: number;
  pids?: string;
  showDescription: boolean;
  showPid: boolean;
  showPrice: boolean;
  showTitle: boolean;
  title?: string;
  widgetId: string;
  widgetAlgo: string;
}

export function PathwaysRecommendations({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  const {
    category,
    interval,
    keyword,
    limit,
    pids,
    title,
    widgetId,
    widgetAlgo,
  } = component.getParameters<PathwaysRecommendationsParameters>();
  const {
    smDomainKey,
    smViewId,
    smAccountId,
    smAuthKey,
    smCatalogViews,
    smCustomAttrFields,
    smCustomVarAttrFields,
    smCustomVarListPriceField,
    smCustomVarPurchasePriceField,
  } = useContext(CommerceContext);
  const [cookies] = useCookies(['_br_uid_2']);
  const brUid2 = cookies._br_uid_2 || (page.isPreview() ? DUMMY_BR_UID_2_FOR_PREVIEW : undefined);
  const params: ProductGridWidgetInputProps = useMemo(() => {
    const widgetType = widgetAlgo.split('.')[0];

    return {
      smAccountId,
      smAuthKey,
      smCatalogViews,
      smDomainKey,
      smViewId,
      widgetId,
      widgetType,
      brUid2,
      searchText: keyword,
      categoryId: category,
      pageSize: limit,
      productIds: pids?.split(','),
      customAttrFields: smCustomAttrFields,
      customVariantAttrFields: smCustomVarAttrFields,
      customVariantListPriceField: smCustomVarListPriceField,
      customVariantPurchasePriceField: smCustomVarPurchasePriceField,
    };
  }, [
    category,
    brUid2,
    keyword,
    limit,
    pids,
    smAccountId,
    smAuthKey,
    smCatalogViews,
    smCustomAttrFields,
    smCustomVarAttrFields,
    smCustomVarListPriceField,
    smCustomVarPurchasePriceField,
    smDomainKey,
    smViewId,
    widgetAlgo,
    widgetId,
  ]);
  const [, results, loading, apolloError] = useProductGridWidget(params);
  const error = useMemo(() => {
    if (apolloError) {
      // console.log(apolloError);
      return 'This widget is not working properly. Try again later.';
    }
    switch (params.widgetType) {
      case 'item':
        return !pids ? 'Widget configured incorrectly: please add Product IDs' : undefined;
      case 'category':
        return !category ? 'Widget configured incorrectly: please add a Category ID' : undefined;
      case 'keyword':
      case 'personalized':
        return !keyword ? 'Widget configured incorrectly: please add a Keyword' : undefined;
      default:
        return undefined;
    }
  }, [apolloError, category, keyword, params.widgetType, pids]);

  if (component.isHidden()) {
    return page.isPreview() ? <div /> : null;
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-3 mb-3">
        {error}
      </Alert>
    );
  }

  return (
    <div className={`${styles.grid} ${styles['pathways-and-recommendations']} mw-container mx-auto`}>
      <div className={styles.grid__header}>{title && <h4 className="mb-4">{title}</h4>}</div>
      <Row>
        {!loading && results?.items ? (
          <Products products={results.items.filter(notEmpty)} interval={interval} />
        ) : (
          <ProductsPlaceholder size={limit} />
        )}
      </Row>
    </div>
  );
}
