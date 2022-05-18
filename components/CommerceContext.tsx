/*
 * Copyright 2020 Bloomreach
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

import React from 'react';
import { CommerceApiClientFactory } from '@bloomreach/connector-components-react';
import { CommerceConfig } from '../src/utils';

interface CommerceContextProps {
  connector?: string;
  discoveryConnector?: string;
  discoveryAccountId?: string;
  discoveryAuthKey?: string;
  discoveryDomainKey?: string;
  discoveryViewId?: string;
  discoveryCatalogViews?: string;
  discoveryCustomAttrFields?: string[];
  discoveryCustomVarAttrFields?: string[];
  discoveryCustomVarListPriceField?: string;
  discoveryCustomVarPurchasePriceField?: string;
  commerceClientFactory?: CommerceApiClientFactory;
  brEnvType?: string;
}

interface CommerceContextInputProps {
  commerceConfig: CommerceConfig;
  commerceClientFactory: CommerceApiClientFactory;
}

export const CommerceContext = React.createContext<CommerceContextProps>({});
export const CommerceContextConsumer = CommerceContext.Consumer;
export function CommerceContextProvider({
  commerceConfig,
  commerceClientFactory,
  children,
}: React.PropsWithChildren<CommerceContextInputProps>): React.ReactElement {
  const {
    connector,
    discoveryViewId,
    discoveryAccountId,
    discoveryAuthKey,
    discoveryDomainKey,
    discoveryCatalogViews,
    discoveryCustomAttrFields,
    discoveryCustomVarAttrFields,
    discoveryCustomVarListPriceField,
    discoveryCustomVarPurchasePriceField,
    brEnvType,
  } = commerceConfig;
  return (
    <CommerceContext.Provider
      value={{
        connector,
        discoveryConnector: 'brsm',
        discoveryViewId,
        discoveryAccountId,
        discoveryAuthKey,
        discoveryDomainKey,
        discoveryCatalogViews,
        discoveryCustomAttrFields,
        discoveryCustomVarAttrFields,
        discoveryCustomVarListPriceField,
        discoveryCustomVarPurchasePriceField,
        commerceClientFactory,
        brEnvType,
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
}
