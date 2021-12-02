/*
 * Copyright 2020-2021 Bloomreach
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

import { useContext } from 'react';
import { BrPageContext } from '@bloomreach/react-sdk';
import { CommerceConfig } from './CommerceContext';

export const DUMMY_BR_UID_2_FOR_PREVIEW = 'uid%3D0000000000000%3Av%3D11.5%3Ats%3D1428617911187%3Ahc%3D55';

export function loadCommerceConfig(): CommerceConfig {
  const channelParams = useContext(BrPageContext)?.getChannelParameters<ChannelParameters>();
  const commerceConfig: CommerceConfig = {
    graphqlServiceUrl:
      channelParams?.graphql_baseurl || process.env.REACT_APP_GRAPHQL_SERVICE_URL || 'http://localhost:4000',
    connector: process.env.REACT_APP_DEFAULT_CONNECTOR ?? '',
    smAccountId: channelParams?.smAccountId || process.env.REACT_APP_DEFAULT_SM_ACCOUNT_ID,
    smAuthKey: process.env.REACT_APP_DEFAULT_SM_AUTH_KEY,
    smDomainKey: channelParams?.smDomainKey || process.env.REACT_APP_DEFAULT_SM_DOMAIN_KEY,
    smViewId: process.env.REACT_APP_DEFAULT_SM_VIEW_ID,
    smCatalogViews: process.env.REACT_APP_DEFAULT_SM_CATALOG_VIEWS,
    smCustomAttrFields: process.env.REACT_APP_SM_CUSTOM_ATTR_FIELDS?.split(','),
    smCustomVarAttrFields: process.env.REACT_APP_SM_CUSTOM_VARIANT_ATTR_FIELDS?.split(','),
    smCustomVarListPriceField: process.env.REACT_APP_SM_CUSTOM_VARIANT_LIST_PRICE_FIELD,
    smCustomVarPurchasePriceField: process.env.REACT_APP_SM_CUSTOM_VARIANT_PURCHASE_PRICE_FIELD,
  };

  return commerceConfig;
}

export function notEmpty<T>(value: T | null | undefined): value is T {
  return !!value;
}
