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

import { BrComponent, BrPage, BrPageContext } from '@bloomreach/react-sdk';
import { PageModel } from '@bloomreach/spa-sdk';
import axios from 'axios';
import { Container, Navbar, Image, Row, Col } from 'react-bootstrap';
import { getCookieConsentValue } from 'react-cookie-consent';
import { useState } from 'react';

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
} from '.';
import { CommerceContextConsumer } from './CommerceContext';

import styles from './App.module.scss';

interface AppProps {
  configuration: Record<string, any>;
  page: PageModel;
}

export function App({ configuration, page }: AppProps): JSX.Element {
  const [, setCookieConsentVal] = useState<boolean>();
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

  const updateCookieConsentVal = (val: boolean): void => {
    setCookieConsentVal(val);
  };

  return (
    <BrPage configuration={{ ...configuration, httpClient: axios }} mapping={mapping} page={page}>
      <BrPageContext.Consumer>
        {(contextPage) => (<>
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
                      getCookieConsentValue() && <BrPixel
                        accountId={smAccountId ?? ''}
                        domainKey={smDomainKey ?? ''}
                        page={contextPage!}
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
            {!contextPage?.isPreview() && <BrCookieConsent csUpdate={updateCookieConsentVal} />}
          </footer>
        </BrComponent>
        </>)}
      </BrPageContext.Consumer>
    </BrPage>
  );
}
