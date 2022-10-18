/* eslint-disable jsx-a11y/anchor-is-valid */
/*
 * Copyright 2019-2022 Bloomreach
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

import { NextPage } from 'next';
import axios from 'axios';
import cookie from 'cookie';
import { Configuration, initialize, PageModel } from '@bloomreach/spa-sdk';
import { relevance } from '@bloomreach/spa-sdk/lib/express';
import { APOLLO_STATE_PROP_NAME, CommerceApiClientFactory } from '@bloomreach/connector-components-react';
import { buildConfiguration, CommerceConfig, deleteUndefined, loadCommerceConfig } from '../src/utils';
import { App } from '../components/App';

let commerceClientFactory: CommerceApiClientFactory;

interface IndexPageProps {
  configuration: Omit<Configuration, 'httpClient'>;
  page: PageModel;
  commerceConfig: CommerceConfig;
  [APOLLO_STATE_PROP_NAME]?: any;
  cookies?: Record<string, string>;
}

const Index: NextPage<IndexPageProps> = ({
  configuration,
  page,
  commerceConfig,
  [APOLLO_STATE_PROP_NAME]: apolloState,
  cookies,
}): JSX.Element => {
  return <App
    configuration={configuration}
    page={page}
    commerceConfig={commerceConfig}
    apolloState={apolloState}
    commerceClientFactory={commerceClientFactory}
    cookies={cookies}
  />;
};

Index.getInitialProps = async ({ req: request, res: response, asPath: path, query }) => {
  // console.log('[getServerSideProps]: path=', path);
  // console.log('[getServerSideProps]: query=', query);

  const configuration = buildConfiguration(path ?? '/');
  const page = await initialize({ ...configuration, request, httpClient: axios as any });
  const pageJson = page.toJSON();
  const commerceConfig = loadCommerceConfig(pageJson, query);
  const props: IndexPageProps = { configuration, commerceConfig, page: pageJson };

  if (!request || !response) {
    return props;
  }

  relevance(request, response);
  const cookies = cookie.parse(request.headers.cookie ?? '');
  props.cookies = cookies;

  const { graphqlServiceUrl, connector, brAccountName: accountEnvId } = commerceConfig;
  const defaultRequestHeaders = undefined;
  const defaultAnonymousCredentials = undefined;

  // For SSG and SSR always create a new Apollo Client
  commerceClientFactory = new CommerceApiClientFactory(
    graphqlServiceUrl,
    connector,
    accountEnvId,
    defaultRequestHeaders,
    defaultAnonymousCredentials,
    true,
  );
  // Apollo client will go thru all components on the page and perform queries necessary.
  // The results will be stored in the cache for client-side rendering.
  // const pageProps = { pageProps: { ...props } };
  // const apolloData = await commerceClientFactory.getDataFromTree(<MyApp.AppTree {...pageProps} />);
  // console.log('[getServerSideProps]: apolloData=', apolloData);
  // props = { ...props, ...apolloData.stateProp };

  // eslint-disable-next-line max-len
  // Hack needed to avoid JSON-Serialization validation error from Next.js https://github.com/zeit/next.js/discussions/11209
  // >>> Reason: `undefined` cannot be serialized as JSON. Please use `null` or omit this value all together.
  if (process.env.NODE_ENV !== 'production') {
    deleteUndefined(props);
  }

  return props;
};

export default Index;
