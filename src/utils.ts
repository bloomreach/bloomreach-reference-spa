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

import { Configuration, PageModel, extractSearchParams } from '@bloomreach/spa-sdk';
import { ParsedUrlQuery } from 'querystring';
import { NEXT_PUBLIC_BR_MULTI_TENANT_SUPPORT, NEXT_PUBLIC_BRXM_ENDPOINT } from './constants';

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

type BuildConfigurationOptions = {
  endpoint: string | (string | null)[];
  baseUrl: string;
};

type ConfigurationBuilder = Omit<Configuration & Partial<BuildConfigurationOptions>, 'httpClient'>;

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

export function buildConfiguration(
  path: string,
  endpoint: string = NEXT_PUBLIC_BRXM_ENDPOINT,
  hasMultiTenantSupport: boolean = NEXT_PUBLIC_BR_MULTI_TENANT_SUPPORT,
): ConfigurationBuilder {
  const configuration: ConfigurationBuilder = {
    path,
  };
  if (endpoint) {
    configuration.endpoint = endpoint;
    // The else statement below is needed for multi-tenant support
    // It allows operating the same Reference SPA for different channels in EM using endpoint query parameter in the URL
    // It's used mainly by BloomReach and is not needed for most customers
  } else if (hasMultiTenantSupport) {
    const endpointQueryParameter = 'endpoint';
    const { url, searchParams } = extractSearchParams(path, [endpointQueryParameter].filter(Boolean));

    configuration.endpoint = searchParams.get(endpointQueryParameter) ?? '';
    configuration.baseUrl = `?${endpointQueryParameter}=${searchParams.get(endpointQueryParameter)}`;
    configuration.path = url;
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

  const { graphqlTenantName } = pageModel.channel?.info.props as ChannelParameters;
  if (graphqlTenantName) {
    return graphqlTenantName.toLowerCase();
  }

  const endpoint = NEXT_PUBLIC_BRXM_ENDPOINT || (NEXT_PUBLIC_BR_MULTI_TENANT_SUPPORT ? query?.endpoint : '');
  if (!endpoint) {
    return undefined;
  }
  const endpointValue = Array.isArray(endpoint) ? endpoint[0] : endpoint;
  return new URL(endpointValue).hostname.split('.')[0];
}

export function parseCategoryPickerField(categoryIdValue?: string):
  { categoryId: string, connectorId?: string} | undefined {
  if (!categoryIdValue) {
    return undefined;
  }

  try {
    // new field format in JSON
    const { categoryid: categoryId, connectorid: connectorId } = JSON.parse(categoryIdValue);
    if (categoryId) {
      return {
        categoryId,
        connectorId,
      };
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Error parsing categoryid as JSON: ', err);
  }

  // fall-back to old field format (categoryid as string)
  return { categoryId: categoryIdValue };
}

export function parseProductPickerField(productIdValue?: string, variantIdValue?: string):
  { itemId: string, connectorId?: string } | undefined {
  if (!productIdValue) {
    return undefined;
  }

  try {
    // new field format as a combination of productid/variantid in JSON
    const { productid: productId, variantid: variantId, connectorid: connectorId } = JSON.parse(productIdValue);
    const selectedId = variantId?.id ? variantId : productId;
    const { id, code } = selectedId;
    if (code) {
      return {
        itemId: `${id}___${code}`,
        connectorId,
      };
    }

    if (id) {
      return {
        itemId: `${id}___${id}`,
        connectorId,
      };
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Error parsing itemid as JSON: ', err);
  }

  // fall-back to old field format as separated productid and variantid fields
  const selectedId = variantIdValue?.length ? variantIdValue : productIdValue;
  const [, id, code] = selectedId?.match(/id=([\w\d._=-]+[\w\d=]?)?;code=([\w\d._=/-]+[\w\d=]?)?/i) ?? [];
  if (code) {
    return { itemId: `${id}___${code}` };
  }
  return { itemId: `${id}___${id}` };
}
