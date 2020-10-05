/*
 * Copyright 2020 Hippo B.V. (http://www.onehippo.com)
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
import axios from 'axios';
import { RouteComponentProps } from 'react-router-dom';
import { BrComponent, BrPage } from '@bloomreach/react-sdk';
import { Content, Menu, NewsList, Navbar, SingleBannerCarousel } from './components';

export default function App({ location }: RouteComponentProps): React.ReactElement {
  const configuration = {
    baseUrl: process.env.REACT_APP_BASE_URL,
    endpoint: process.env.REACT_APP_BRXM_ENDPOINT,
    endpointQueryParameter: 'brxm',
    httpClient: axios,
    request: {
      path: `${location.pathname}${location.search}`,
    },
  };
  const mapping = { Content, 'News List': NewsList, SingleBannerCarousel };

  return (
    <BrPage configuration={configuration} mapping={mapping}>
      <header>
        <Navbar>
          <BrComponent path="menu">
            <Menu />
          </BrComponent>
        </Navbar>
      </header>
      <BrComponent path="top">
        <section>
          <BrComponent />
        </section>
      </BrComponent>
      <section className="container flex-fill pt-3">
        <BrComponent path="main" />
      </section>
      <BrComponent path="bottom">
        <section>
          <BrComponent />
        </section>
      </BrComponent>
      <footer className="bg-dark text-light py-3">
        <div className="container clearfix">
          <div className="float-left pr-3">&copy; Bloomreach</div>
          <div className="overflow-hidden">
            <BrComponent path="footer" />
          </div>
        </div>
      </footer>
    </BrPage>
  );
}
