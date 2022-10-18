/*
 * Copyright 2020-2022 Bloomreach
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
import { Alert } from 'react-bootstrap';

import { BrProps } from '@bloomreach/react-sdk';
import { ContainerItem, getContainerItemContent } from '@bloomreach/spa-sdk';
import { ProductGridWidgetInputProps, useProductGridWidget } from '@bloomreach/connector-components-react';

import { CommerceContext } from '../CommerceContext';
import { Products } from './Products';
import { DUMMY_BR_UID_2_FOR_PREVIEW, isLoading, notEmpty } from '../../src/utils';

import styles from './PathwaysRecommendations.module.scss';
import { ProductsPlaceholder } from '../ProductGrid/ProductsPlaceholder';

export const DOCUMENTS_PER_SLIDE = 4;

interface PathwaysRecommendationsParameters {
  interval?: number;
  limit: number;
  showDescription: boolean;
  showPid: boolean;
  showPrice: boolean;
  showTitle: boolean;
  title?: string;
}

interface PathwaysRecommendationsCompound {
  categoryCompound?: { categoryid: string };
  keyword?: string;
  productCompound?: [{ productid: string }];
  widgetCompound?: {
    widgetid: string;
    widgetalgo: {
      sourceName: string;
      selectionValues: [{ key: string; label: string }];
    };
  };
}

export function PathwaysRecommendations({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  const { interval, limit, title } = component?.getParameters<PathwaysRecommendationsParameters>() ?? {};

  const {
    categoryCompound,
    keyword,
    productCompound,
    widgetCompound,
  } = (component && page
    && getContainerItemContent<PathwaysRecommendationsCompound>(component, page))
  ?? {} as PathwaysRecommendationsCompound;
  const { categoryid: category } = categoryCompound ?? {};
  const pids = productCompound?.map(({ productid }) => {
    const [, id, code] = productid.match(/id=([\w\d._=-]+[\w\d=]?)?;code=([\w\d._=/-]+[\w\d=]?)?/i) ?? [];
    return code ?? id;
  });
  const { widgetid: widgetId = '', widgetalgo: widgetAlgo } = widgetCompound ?? {};
  const {
    discoveryDomainKey,
    discoveryViewId,
    discoveryAccountId,
    discoveryAuthKey,
    discoveryCatalogViews,
    discoveryCustomAttrFields,
    discoveryCustomVarAttrFields,
    discoveryCustomVarListPriceField,
    discoveryCustomVarPurchasePriceField,
    brEnvType,
  } = useContext(CommerceContext);
  const [cookies] = useCookies(['_br_uid_2']);
  const brUid2 = cookies._br_uid_2 || (page?.isPreview() ? DUMMY_BR_UID_2_FOR_PREVIEW : undefined);
  const params: ProductGridWidgetInputProps = useMemo(() => {
    const widgetType = widgetAlgo?.selectionValues?.[0].key.split('.')[0] ?? '';

    return {
      discoveryAccountId,
      discoveryAuthKey,
      discoveryCatalogViews,
      discoveryDomainKey,
      discoveryViewId,
      widgetId,
      widgetType,
      brUid2,
      searchText: keyword,
      categoryId: category,
      pageSize: limit || DOCUMENTS_PER_SLIDE,
      productIds: pids,
      customAttrFields: discoveryCustomAttrFields,
      customVariantAttrFields: discoveryCustomVarAttrFields,
      customVariantListPriceField: discoveryCustomVarListPriceField,
      customVariantPurchasePriceField: discoveryCustomVarPurchasePriceField,
      brEnvType,
    };
  }, [
    category,
    brUid2,
    keyword,
    limit,
    pids,
    discoveryAccountId,
    discoveryAuthKey,
    discoveryCatalogViews,
    discoveryCustomAttrFields,
    discoveryCustomVarAttrFields,
    discoveryCustomVarListPriceField,
    discoveryCustomVarPurchasePriceField,
    discoveryDomainKey,
    discoveryViewId,
    widgetAlgo,
    widgetId,
    brEnvType,
  ]);
  const [, results, loading, apolloError] = useProductGridWidget(params);
  const error = useMemo(() => {
    let message;
    if ((widgetId ?? 'undefined') !== 'undefined' && params.widgetType) {
      switch (params.widgetType) {
        case 'item':
          message = !pids ? 'Widget configured incorrectly: please add Product IDs' : undefined;
          break;
        case 'category':
          message = !category ? 'Widget configured incorrectly: please add a Category ID' : undefined;
          break;
        case 'keyword':
        case 'personalized':
          message = !keyword ? 'Widget configured incorrectly: please add a Keyword' : undefined;
          break;
        default:
          message = undefined;
      }

      if (!message && !results && apolloError) {
        // console.log(apolloError);
        message = 'This widget is not working properly. Try again later.';
      }
    } else {
      message = 'Please configure Widget ID and Widget Type first';
    }

    return message;
  }, [widgetId, params.widgetType, results, apolloError, pids, category, keyword]);

  if (component?.isHidden()) {
    return page?.isPreview() ? <div/> : null;
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-3 mb-3">
        {error}
      </Alert>
    );
  }

  return (
    <div className={`${styles['pathways-and-recommendations']} mw-container mx-auto`}>
      {title && <h4 className="mb-4">{title}</h4>}
      {!isLoading(loading) && results?.items ? (
        <Products products={results.items.filter(notEmpty)} interval={interval} maxProducts={DOCUMENTS_PER_SLIDE}/>
      ) : (
        <ProductsPlaceholder size={1}/>
      )}
    </div>
  );
}
