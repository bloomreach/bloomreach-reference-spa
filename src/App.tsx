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

import React, { ReactElement } from 'react';
import axios, { AxiosError } from 'axios';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Container, Image, Navbar, Row } from 'react-bootstrap';
import { BrComponent, BrPageContext, BrPage } from '@bloomreach/react-sdk';

import {
  BannerCollection,
  BrPixel,
  Content,
  CtaBanner,
  Link,
  Images,
  Map,
  Menu,
  MultiBannerCarousel,
  Navigation,
  PageCatalog,
  Product,
  ProductGrid,
  ProductSearch,
  SearchBar,
  SingleBannerCarousel,
  TitleAndText,
  Video,
} from './components';
import styles from './App.module.scss';
import { CommerceContextProvider, CommerceContextConsumer } from './CommerceContext';

export interface ErrorCodeState {
  errorCode?: number;
}

export default class App extends React.Component<RouteComponentProps, ErrorCodeState> {
  private mapping = {
    BannerCollection,
    Content,
    CtaBanner,
    Images,
    Map,
    MultiBannerCarousel,
    Navigation,
    PageCatalog,
    Product,
    ProductGrid,
    ProductSearch,
    SingleBannerCarousel,
    SearchBar,
    TitleAndText,
    Video,
  };

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = { errorCode: undefined };
  }

  static getDerivedStateFromError(error: Error | AxiosError): ErrorCodeState {
    let status;
    if ('isAxiosError' in error && error.isAxiosError) {
      status = error.response?.status;
    }

    return { errorCode: status === 404 ? 404 : 500 };
  }

  componentDidCatch(): void {
    const { history } = this.props;
    const { errorCode } = this.state;
    if (errorCode) {
      this.setState({ errorCode: undefined });
      history.push(`/${errorCode}`);
    }
  }

  render(): ReactElement | null {
    const { location } = this.props;
    const configuration = {
      endpoint: process.env.REACT_APP_BRXM_ENDPOINT,
      endpointQueryParameter: 'endpoint',
      httpClient: axios,
      path: `${location.pathname}${location.search}`,
    };

    return (
      <BrPage configuration={configuration} mapping={this.mapping}>
        <CommerceContextProvider>
          <header>
            <Navbar bg="light" expand="lg" sticky="top" className="py-2 py-lg-3">
              <Container className="justify-content-start px-sm-3">
                <BrPageContext.Consumer>
                  {(page) => (
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
                  )}
                </BrPageContext.Consumer>

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
                <Col lg="3" xl="2" className="text-center text-lg-right py-lg-2">
                  &copy; Bloomreach 2021
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
      </BrPage>
    );
  }
}
