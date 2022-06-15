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

import { Configuration, PageModel } from '@bloomreach/spa-sdk';
import { ParsedUrlQuery } from 'querystring';

export interface CommerceConfig {
  graphqlServiceUrl: string;
  connector: string;
  discoveryAccountId?: string;
  discoveryAuthKey?: string;
  discoveryDomainKey?: string;
  discoveryViewId?: string;
  discoveryCatalogViews?: string;
  discoveryCustomAttrFields?: string[];
  discoveryCustomVarAttrFields?: string[];
  discoveryCustomVarListPriceField?: string;
  discoveryCustomVarPurchasePriceField?: string;
  brEnvType?: string;
  brAccountName?: string;
}

export const DUMMY_BR_UID_2_FOR_PREVIEW = 'uid%3D0000000000000%3Av%3D11.5%3Ats%3D1428617911187%3Ahc%3D55';

export function loadCommerceConfig(page: PageModel, query?: ParsedUrlQuery): CommerceConfig {
  const channelParams = page.channel?.info.props as ChannelParameters | undefined;
  const commerceConfig: CommerceConfig = {
    graphqlServiceUrl:
      channelParams?.graphql_baseurl || process.env.NEXT_PUBLIC_APOLLO_SERVER_URI || 'http://localhost:4000',
    connector: process.env.NEXT_PUBLIC_DEFAULT_CONNECTOR ?? '',
    discoveryAccountId: channelParams?.discoveryAccountId || process.env.NEXT_PUBLIC_DISCOVERY_ACCOUNT_ID,
    discoveryAuthKey: process.env.NEXT_PUBLIC_DISCOVERY_AUTH_KEY,
    discoveryDomainKey: channelParams?.discoveryDomainKey || process.env.NEXT_PUBLIC_DISCOVERY_DOMAIN_KEY,
    discoveryViewId: channelParams?.discoveryViewId || process.env.NEXT_PUBLIC_DISCOVERY_VIEW_ID,
    discoveryCatalogViews: process.env.NEXT_PUBLIC_DISCOVERY_CATALOG_VIEWS,
    discoveryCustomAttrFields: process.env.NEXT_PUBLIC_DISCOVERY_CUSTOM_ATTR_FIELDS?.split(','),
    discoveryCustomVarAttrFields: process.env.NEXT_PUBLIC_DISCOVERY_CUSTOM_VARIANT_ATTR_FIELDS?.split(','),
    discoveryCustomVarListPriceField: process.env.NEXT_PUBLIC_DISCOVERY_CUSTOM_VARIANT_LIST_PRICE_FIELD,
    discoveryCustomVarPurchasePriceField: process.env.NEXT_PUBLIC_DISCOVERY_CUSTOM_VARIANT_PURCHASE_PRICE_FIELD,
    brEnvType: channelParams?.discoveryRealm === 'PRODUCTION'
      ? undefined
      : channelParams?.discoveryRealm || process.env.NEXT_PUBLIC_BR_ENV_TYPE,
    brAccountName: getBrAccountName(page, query),
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

export function buildConfiguration(path: string, query: ParsedUrlQuery): Omit<Configuration, 'httpClient'> {
  const endpointQueryParameter = 'endpoint';
  const configuration: Record<string, any> = {
    endpointQueryParameter,
    path,
  };
  const endpoint = query[endpointQueryParameter];
  if (!endpoint) {
    configuration.endpoint = process.env.NEXT_PUBLIC_BRXM_ENDPOINT;
  }
  return configuration;
}

export function isLoading(loading: boolean): boolean {
  const ssrMode = typeof window === 'undefined';
  // In SSR phase, ignore the `loading` param returned by Apollo client's hooks.
  return ssrMode ? false : loading;
}

function getBrAccountName(pageModel: PageModel, query?: ParsedUrlQuery): string | undefined {
  if (process.env.NEXT_PUBLIC_BR_ACCOUNT_NAME) {
    return process.env.NEXT_PUBLIC_BR_ACCOUNT_NAME;
  }

  const { discoveryDomainKey } = pageModel.channel?.info.props as ChannelParameters;
  if (discoveryDomainKey) {
    return discoveryDomainKey.toLowerCase().replace('_', '-');
  }

  const endpoint = query?.endpoint ?? process.env.NEXT_PUBLIC_BRXM_ENDPOINT;
  if (!endpoint) {
    return undefined;
  }
  const endpointValue = Array.isArray(endpoint) ? endpoint[0] : endpoint;
  return new URL(endpointValue).hostname.split('.')[0];
}
