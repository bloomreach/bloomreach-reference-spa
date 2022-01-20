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

import React, { ReactElement, useContext, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Col, Container, Image, Navbar, Row } from 'react-bootstrap';
import { BrComponent, BrPageContext, BrPage } from '@bloomreach/react-sdk';
import { Configuration } from '@bloomreach/spa-sdk';
import { getCookieConsentValue } from 'react-cookie-consent';

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
} from './components';
import { CommerceContextProvider, CommerceContextConsumer } from './CommerceContext';
import { ErrorContext, ErrorCode } from './ErrorContext';
import ErrorPage from './ErrorPage';

import styles from './App.module.scss';

export const ERROR_PAGE_PATH_MAP = {
  [ErrorCode.NOT_FOUND]: '/404',
  [ErrorCode.INTERNAL_SERVER_ERROR]: '/500',
  [ErrorCode.GENERAL_ERROR]: '/_error',
};

const MAPPING = {
  BannerCollection,
  BannerCTA,
  CategoryHighlight,
  Content,
  Images,
  Map,
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

export default function App(): ReactElement | null {
  const { errorCode, requestURL } = useContext(ErrorContext);
  const [, setCookieConsentVal] = useState<boolean>();
  const location = useLocation();
  if (errorCode && requestURL) {
    const { pathname } = new URL(requestURL);
    if (pathname.endsWith(ERROR_PAGE_PATH_MAP[errorCode])) {
      // To avoid infinite loop
      return <ErrorPage />;
    }
  }

  const path = errorCode
    ? `${ERROR_PAGE_PATH_MAP[errorCode] ?? ERROR_PAGE_PATH_MAP[ErrorCode.GENERAL_ERROR]}${location.search}`
    : `${location.pathname}${location.search}`;

  const endpointQueryParameter = 'endpoint';
  const configuration: Configuration = {
    endpointQueryParameter,
    httpClient: axios,
    path,
  };

  const urlParams = new URLSearchParams(location.search);
  const endpoint = urlParams.get(endpointQueryParameter);
  if (!endpoint) {
    configuration.endpoint = process.env.REACT_APP_BRXM_ENDPOINT;
  }

  const updateCookieConsentVal = (val: boolean): void => {
    setCookieConsentVal(val);
  };

  return (
    <BrPage configuration={configuration} mapping={MAPPING}>
      <CommerceContextProvider>
        <Header />
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
            <BrPageContext.Consumer>
              {(page) => !page?.isPreview() && <BrCookieConsent csUpdate={updateCookieConsentVal} />}
            </BrPageContext.Consumer>
          </footer>
        </BrComponent>
      </CommerceContextProvider>
    </BrPage>
  );
}

function Header(): ReactElement {
  const page = useContext(BrPageContext);
  return (
    <header>
      <Navbar bg="light" expand="lg" sticky="top" className="py-2 py-lg-3">
        <Container className="justify-content-start px-sm-3">
          <Navbar.Brand as={Link} href={page?.getUrl('/')} title="Pacific Nuts & Bolts">
            <Image
              alt="Pacific Nuts & Bolts"
              src={`${process.env.PUBLIC_URL}/logo.png`}
              srcSet={`${process.env.PUBLIC_URL}/logo.png 1x, ${process.env.PUBLIC_URL}/logo@2x.png 2x`}
              height="30"
              className="d-none d-sm-block"
            />

            <Image
              alt="Pacific Nuts & Bolts"
              src={`${process.env.PUBLIC_URL}/logo-sm.png`}
              srcSet={`${process.env.PUBLIC_URL}/logo-sm.png 1x, ${process.env.PUBLIC_URL}/logo-sm@2x.png 2x`}
              height="30"
              className="d-block d-sm-none"
            />

            <CommerceContextConsumer>
              {({ smAccountId, smDomainKey }) =>
                getCookieConsentValue() && (
                  <BrPixel
                    accountId={smAccountId ?? ''}
                    domainKey={smDomainKey ?? ''}
                    page={page!}
                    pageType="search"
                    pageLabels="pacific,nut,bolt,commerce"
                    type="pageview"
                  />
                )
              }
            </CommerceContextConsumer>
          </Navbar.Brand>
          {!page?.getUrl()?.startsWith('/_error') && (
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
  );
}
