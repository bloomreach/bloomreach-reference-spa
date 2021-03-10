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

import { CommerceConfig } from './CommerceContext';

export function loadCommerceConfig(): CommerceConfig {
  const commerceConfig: CommerceConfig = {
    graphqlServiceUrl: process.env.REACT_APP_GRAPHQL_SERVICE_URL || 'http://localhost:4000',
    connector: process.env.REACT_APP_DEFAULT_CONNECTOR ?? '',
    smAccountId: process.env.REACT_APP_DEFAULT_SM_ACCOUNT_ID,
    smDomainKey: process.env.REACT_APP_DEFAULT_SM_DOMAIN_KEY,
    smViewId: process.env.REACT_APP_DEFAULT_SM_VIEW_ID,
    smCatalogViews: process.env.REACT_APP_DEFAULT_SM_CATALOG_VIEWS,
  };

  return commerceConfig;
}