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
  smConnector?: string;
  smAccountId?: string;
  smAuthKey?: string;
  smDomainKey?: string;
  smViewId?: string;
  smCatalogViews?: string;
  smCustomAttrFields?: string[];
  smCustomVarAttrFields?: string[];
  smCustomVarListPriceField?: string;
  smCustomVarPurchasePriceField?: string;
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
    smViewId,
    smAccountId,
    smAuthKey,
    smDomainKey,
    smCatalogViews,
    smCustomAttrFields,
    smCustomVarAttrFields,
    smCustomVarListPriceField,
    smCustomVarPurchasePriceField,
    brEnvType,
  } = commerceConfig;
  return (
    <CommerceContext.Provider
      value={{
        connector,
        smConnector: 'brsm',
        smViewId,
        smAccountId,
        smAuthKey,
        smDomainKey,
        smCatalogViews,
        smCustomAttrFields,
        smCustomVarAttrFields,
        smCustomVarListPriceField,
        smCustomVarPurchasePriceField,
        commerceClientFactory,
        brEnvType,
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
}
