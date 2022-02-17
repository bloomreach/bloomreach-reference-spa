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
import { BrComponent, BrPage, BrPageContext } from '@bloomreach/react-sdk';
import { initialize } from '@bloomreach/spa-sdk';
import { relevance } from '@bloomreach/spa-sdk/lib/express';
import {
  APOLLO_STATE_PROP_NAME,
  CommerceApiClientFactory,
  CommerceConnectorProvider,
} from '@bloomreach/connector-components-react';
import { Container, Navbar, Image, Row, Col } from 'react-bootstrap';
import {
  BannerCollection,
  BannerCTA,
  BrCookieConsent,
  BrPixel,
  CategoryHighlight,
  Content,
  Link,
  Images,
  Map,
  Menu,
  MultiBannerCarousel,
  Navigation,
  PageCatalog,
  PathwaysRecommendations,
  Product,
  ProductGrid,
  ProductHighlight,
  SearchBar,
  SingleBannerCarousel,
  SingleBannerCarouselX,
  TitleAndText,
  Video,
} from '../components';
import MyApp from './_app';
import { deleteUndefined, loadCommerceConfig } from '../src/utils';
import { CommerceContextConsumer, CommerceContextProvider } from '../components/CommerceContext';
import styles from './App.module.scss';

let commerceClientFactory: CommerceApiClientFactory;

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req: request, res: response, resolvedUrl: path, query } = ctx;
  // console.log('[getServerSideProps]: path=', path);

  relevance(request, response);

  const endpointQueryParameter = 'endpoint';
  const configuration: Record<string, any> = {
    endpointQueryParameter,
    path,
  };

  const endpoint = query[endpointQueryParameter];
  if (!endpoint) {
    configuration.endpoint = process.env.BRXM_ENDPOINT;
  }
  const page = await initialize({ ...configuration, request, httpClient: axios });
  let props: Record<string, any> = { configuration, page: page.toJSON() };

  const commerceConfig = loadCommerceConfig(props.page);

  const cookies = cookie.parse(request.headers.cookie ?? '');

  props = { ...props, ...commerceConfig, cookies };

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
  props = { ...props, ...apolloData.stateProp, apolloContent: apolloData.content };

  // eslint-disable-next-line max-len
  // Hack needed to avoid JSON-Serialization validation error from Next.js https://github.com/zeit/next.js/discussions/11209
  // >>> Reason: `undefined` cannot be serialized as JSON. Please use `null` or omit this value all together.
  if (process.env.NODE_ENV !== 'production') {
    deleteUndefined(props);
  }

  //

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
  apolloContent,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const ssrMode = typeof window === 'undefined';

  if (apolloContent && ssrMode) {
    return <div dangerouslySetInnerHTML={{ __html: apolloContent }} />;
  }

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
        <div>
          <CSR
            configuration={configuration}
            page={page}
            graphqlServiceUrl={graphqlServiceUrl}
            connector={connector}
            smDomainKey={smDomainKey}
            smAccountId={smAccountId}
            cookies={cookies}
            apolloState={apolloState}
          />
        </div>
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
  cookies,
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
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  // console.log('>>>> pageeeeeee', page);

  const mapping = {
    BannerCollection,
    BannerCTA,
    CategoryHighlight,
    Content,
    Images,
    Map,
    Menu,
    MultiBannerCarousel,
    Navigation,
    PageCatalog,
    PathwaysRecommendations,
    Product,
    ProductGrid,
    ProductHighlight,
    SingleBannerCarousel,
    SingleBannerCarouselX,
    SearchBar,
    TitleAndText,
    Video,
  };

  return (
    <CommerceConnectorProvider
      graphqlServiceUrl={graphqlServiceUrl}
      connector={connector}
      accountEnvId={accountEnvId}
      commerceClientFactory={clientCommerceFactory}
      apolloState={apolloState}
    >
      <BrPage configuration={{ ...configuration, httpClient: axios }} mapping={mapping} page={page}>
        <BrPageContext.Consumer>
          {(contextPage) => (
            <CommerceContextProvider page={page} commerceClientFactory={clientCommerceFactory}>
              <header>
                <Navbar bg="light" expand="lg" sticky="top" className="py-2 py-lg-3">
                  <Container className="justify-content-start px-sm-3">
                    <Navbar.Brand as={Link} href={contextPage?.getUrl('/')} title="Pacific Nuts & Bolts">
                      <Image
                        alt="Pacific Nuts & Bolts"
                        src="/logo.png"
                        srcSet="/logo.png 1x, /logo@2x.png 2x"
                        height="30"
                        className="d-none d-sm-block"
                      />

                      <Image
                        alt="Pacific Nuts & Bolts"
                        src="/logo-sm.png"
                        srcSet="/logo-sm.png 1x, /logo-sm@2x.png 2x"
                        height="30"
                        className="d-block d-sm-none"
                      />

                      <CommerceContextConsumer>
                        {({ smAccountId, smDomainKey }) => (
                          <BrPixel
                            accountId={smAccountId ?? ''}
                            domainKey={smDomainKey ?? ''}
                            page={page!}
                            pageType="search"
                            pageLabels="pacific,nut,bolt,commerce"
                            type="pageview"
                          />
                        )}
                      </CommerceContextConsumer>
                    </Navbar.Brand>
                    {!contextPage?.getUrl()?.startsWith('/_error') && (
                      <>
                        <BrComponent path="header">
                          <div className={`${styles.navbar__container} order-lg-2 mr-3 mr-lg-0`}>
                            <BrComponent />
                          </div>
                        </BrComponent>
                        <Navbar.Toggle className="ml-auto" />
                        <Navbar.Collapse className="order-lg-1 mr-lg-3">
                          <BrComponent path="menu">
                            <Menu />
                          </BrComponent>
                        </Navbar.Collapse>
                      </>
                    )}
                  </Container>
                </Navbar>
              </header>
              <BrComponent path="top">
                <Container as="section" fluid>
                  <BrComponent />
                </Container>
              </BrComponent>
              <Container as="section" className="flex-fill pt-4">
                <Row className="flex-lg-nowrap">
                  <BrComponent path="main">
                    <Col xs="auto" className="flex-fill">
                      <BrComponent />
                    </Col>
                  </BrComponent>
                  <BrComponent path="right">
                    <Col lg="3" className="flex-fill py-lg-2">
                      <BrComponent />
                    </Col>
                  </BrComponent>
                </Row>
              </Container>
              <BrComponent path="bottom">
                <Container as="section" fluid>
                  <BrComponent />
                </Container>
              </BrComponent>
              <BrComponent path="footer">
                <footer className="bg-secondary text-light py-3">
                  <Container>
                    <Row>
                      <Col lg="9" xl="10">
                        <BrComponent />
                      </Col>
                      <Col lg="3" xl="2" className="text-center text-lg-right py-lg-2">
                        &copy; Bloomreach 2021
                      </Col>
                    </Row>
                  </Container>
                </footer>
              </BrComponent>
            </CommerceContextProvider>
          )}
        </BrPageContext.Consumer>
      </BrPage>
    </CommerceConnectorProvider>
  );
}
