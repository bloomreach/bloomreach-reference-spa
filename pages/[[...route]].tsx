/* eslint-disable jsx-a11y/anchor-is-valid */
/*
 * Copyright 2019-2021 Bloomreach
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

import { useMemo } from 'react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import axios from 'axios';
import cookie from 'cookie';
import { initialize } from '@bloomreach/spa-sdk';
import { relevance } from '@bloomreach/spa-sdk/lib/express';
import {
  APOLLO_STATE_PROP_NAME,
  CommerceApiClientFactory,
  CommerceConnectorProvider,
} from '@bloomreach/connector-components-react';
import { Cookies, CookiesProvider } from 'react-cookie';
import MyApp from './_app';
import { buildConfiguration, deleteUndefined, loadCommerceConfig } from '../src/utils';
import { CommerceContextProvider } from '../components/CommerceContext';
import { App } from '../components/App';

let commerceClientFactory: CommerceApiClientFactory;

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req: request, res: response, resolvedUrl: path, query } = ctx;
  // console.log('[getServerSideProps]: path=', path);

  relevance(request, response);

  const configuration = buildConfiguration(path, query);
  const page = await initialize({ ...configuration, request, httpClient: axios });
  const cookies = cookie.parse(request.headers.cookie ?? '');

  let props: Record<string, any> = { configuration, page: page.toJSON(), cookies };

  const commerceConfig = loadCommerceConfig(props.page);

  props = { ...props, ...commerceConfig };

  const { graphqlServiceUrl, connector, smAccountId, smDomainKey } = commerceConfig;
  const accountEnvId = `${smAccountId}_${smDomainKey}`;
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
  const pageProps = { pageProps: { ...props } };
  const apolloData = await commerceClientFactory.getDataFromTree(<MyApp.AppTree {...pageProps} />);
  // console.log('[getServerSideProps]: apolloData=', apolloData);
  props = { ...props, ...apolloData.stateProp };

  // eslint-disable-next-line max-len
  // Hack needed to avoid JSON-Serialization validation error from Next.js https://github.com/zeit/next.js/discussions/11209
  // >>> Reason: `undefined` cannot be serialized as JSON. Please use `null` or omit this value all together.
  if (process.env.NODE_ENV !== 'production') {
    deleteUndefined(props);
  }

  return { props };
};

export default function Index({
  configuration,
  page,
  graphqlServiceUrl,
  connector,
  smDomainKey,
  smAccountId,
  [APOLLO_STATE_PROP_NAME]: apolloState,
  cookies,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const ssrMode = typeof window === 'undefined';

  return (
    <>
      {ssrMode ? (
        <SSR
          configuration={configuration}
          page={page}
          graphqlServiceUrl={graphqlServiceUrl}
          connector={connector}
          smDomainKey={smDomainKey}
          smAccountId={smAccountId}
          cookies={cookies}
        />
      ) : (
        <CSR
          configuration={configuration}
          page={page}
          graphqlServiceUrl={graphqlServiceUrl}
          connector={connector}
          smDomainKey={smDomainKey}
          smAccountId={smAccountId}
          apolloState={apolloState}
        />
      )}
    </>
  );
}

function CSR({
  configuration,
  page,
  graphqlServiceUrl,
  connector,
  smDomainKey,
  smAccountId,
  apolloState,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const accountEnvId = `${smAccountId}_${smDomainKey}`;
  const defaultRequestHeaders = undefined;
  const defaultAnonymousCredentials = undefined;
  const factory = useMemo(() => {
    return new CommerceApiClientFactory(
      graphqlServiceUrl,
      connector,
      accountEnvId,
      defaultRequestHeaders,
      defaultAnonymousCredentials,
      false,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphqlServiceUrl, connector, accountEnvId, defaultRequestHeaders, defaultAnonymousCredentials]);

  return (
    <Common
      configuration={configuration}
      page={page}
      graphqlServiceUrl={graphqlServiceUrl}
      connector={connector}
      clientCommerceFactory={factory}
      accountEnvId={accountEnvId}
      apolloState={apolloState}
    />
  );
}

function SSR({
  configuration,
  page,
  graphqlServiceUrl,
  connector,
  smDomainKey,
  smAccountId,
  cookies,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const accountEnvId = `${smAccountId}_${smDomainKey}`;

  return (
    <Common
      configuration={configuration}
      page={page}
      graphqlServiceUrl={graphqlServiceUrl}
      connector={connector}
      clientCommerceFactory={commerceClientFactory}
      accountEnvId={accountEnvId}
      cookies={cookies}
    />
  );
}

function Common({
  configuration,
  page,
  graphqlServiceUrl,
  connector,
  clientCommerceFactory,
  accountEnvId,
  apolloState,
  cookies,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const reactCookies = cookies ? new Cookies(cookies) : undefined;
  return (
    <CookiesProvider cookies={reactCookies}>
      <CommerceConnectorProvider
        graphqlServiceUrl={graphqlServiceUrl}
        connector={connector}
        accountEnvId={accountEnvId}
        commerceClientFactory={clientCommerceFactory}
        apolloState={apolloState}
      >
        <CommerceContextProvider page={page} commerceClientFactory={clientCommerceFactory}>
          <App configuration={configuration} page={page} />
        </CommerceContextProvider>
      </CommerceConnectorProvider>
    </CookiesProvider>
  );
}
