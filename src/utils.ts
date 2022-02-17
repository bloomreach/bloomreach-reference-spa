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

import { PageModel } from '@bloomreach/spa-sdk';
import { CommerceConfig } from '../components/CommerceContext';

export const DUMMY_BR_UID_2_FOR_PREVIEW = 'uid%3D0000000000000%3Av%3D11.5%3Ats%3D1428617911187%3Ahc%3D55';

export function loadCommerceConfig(page: PageModel): CommerceConfig {
  const channelParams = page.channel?.info.props as ChannelParameters | undefined;
  const commerceConfig: CommerceConfig = {
    graphqlServiceUrl:
      channelParams?.graphql_baseurl || process.env.NEXT_PUBLIC_APOLLO_SERVER_URI || 'http://localhost:4000',
    connector: process.env.NEXT_PUBLIC_DEFAULT_CONNECTOR ?? '',
    smAccountId: channelParams?.smAccountId || process.env.NEXT_PUBLIC_BRSM_ACCOUNT_ID,
    smAuthKey: process.env.NEXT_PUBLIC_BRSM_AUTH_KEY,
    smDomainKey: channelParams?.smDomainKey || process.env.NEXT_PUBLIC_BRSM_DOMAIN_KEY,
    smViewId: process.env.NEXT_PUBLIC_BRSM_VIEW_ID,
    smCatalogViews: process.env.NEXT_PUBLIC_BRSM_CATALOG_VIEWS,
    smCustomAttrFields: process.env.NEXT_PUBLIC_BRSM_CUSTOM_ATTR_FIELDS?.split(','),
    smCustomVarAttrFields: process.env.NEXT_PUBLIC_BRSM_CUSTOM_VARIANT_ATTR_FIELDS?.split(','),
    smCustomVarListPriceField: process.env.NEXT_PUBLIC_BRSM_CUSTOM_VARIANT_LIST_PRICE_FIELD,
    smCustomVarPurchasePriceField: process.env.NEXT_PUBLIC_BRSM_CUSTOM_VARIANT_PURCHASE_PRICE_FIELD,
    brEnvType: process.env.NEXT_PUBLIC_BR_ENV_TYPE,
  };

  return commerceConfig;
}

export function notEmpty<T>(value: T | null | undefined): value is T {
  return !!value;
}

// eslint-disable-next-line max-len
// Hack needed to avoid JSON-Serialization validation error from Next.js https://github.com/zeit/next.js/discussions/11209
// >>> Reason: `undefined` cannot be serialized as JSON. Please use `null` or omit this value all together.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deleteUndefined(obj: Record<string, any> | undefined): void {
  if (obj) {
    Object.keys(obj).forEach((key: string) => {
      if (obj[key] && typeof obj[key] === 'object') {
        deleteUndefined(obj[key]);
      } else if (typeof obj[key] === 'undefined') {
        delete obj[key]; // eslint-disable-line no-param-reassign
      }
    });
  }
}
