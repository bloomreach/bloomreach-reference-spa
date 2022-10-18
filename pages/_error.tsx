/*
 * Copyright 2022 Bloomreach
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
import { Col, Container, Navbar, Row, Image } from 'react-bootstrap';
import axios, { AxiosError } from 'axios';
import { initialize, PageModel } from '@bloomreach/spa-sdk';
import { Link, ProductNotFoundError } from '../components';

import styles from './ErrorPage.module.scss';
import errorImage from './error.gif';
import { buildConfiguration, CommerceConfig, loadCommerceConfig } from '../src/utils';
import { App } from '../components/App';

enum ErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  GENERAL_ERROR = 'GENERAL_ERROR',
}

const ERROR_PAGE_PATH_MAP = {
  [ErrorCode.NOT_FOUND]: '/404',
  [ErrorCode.INTERNAL_SERVER_ERROR]: '/500',
  [ErrorCode.GENERAL_ERROR]: '/error',
};

interface ErrorProps {
  configuration?: Record<string, any>;
  page?: PageModel;
  commerceConfig?: CommerceConfig;
}

const Error: NextPage<ErrorProps> = ({ configuration, page, commerceConfig }) => {
  if (configuration && page) {
    return <App configuration={configuration} page={page} commerceConfig={commerceConfig!} />;
  }
  return (
    <>
      <header>
        <Navbar bg="light" expand="lg" sticky="top" className="py-2 py-lg-3">
          <Container className="justify-content-start px-sm-3">
            <Navbar.Brand as={Link} href="/" title="Pacific Nuts & Bolts">
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
            </Navbar.Brand>
          </Container>
        </Navbar>
      </header>
      <Container as="section" fluid />
      <Container as="section" className="flex-fill pt-4">
        <Row className="flex-lg-nowrap">
          <Col xs="auto" className="flex-fill">
            <article className={styles['error-page']}>
              <h1>Critical error</h1>
              <div className={styles['error-text']}>
                <p>Something is not working properly. Try again later.</p>
              </div>
              <p>
                <Image src={errorImage.src} alt="Critical error" />
              </p>
            </article>
          </Col>
        </Row>
      </Container>
      <Container as="section" fluid />
      <footer className="bg-secondary text-light py-3">
        <Container>
          <Row>
            <Col lg="9" xl="10" />
            <Col lg="3" xl="2" className="text-center text-lg-right py-lg-2">
              &copy; Bloomreach 2021
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

Error.getInitialProps = async ({ req: request, res: response, err, asPath }) => {
  let errorCode: ErrorCode;
  if (err) {
    if ((err as AxiosError).isAxiosError) {
      const axiosError = err as AxiosError;
      errorCode = axiosError.response?.status === 404 ? ErrorCode.NOT_FOUND : ErrorCode.INTERNAL_SERVER_ERROR;
    } else if (err instanceof ProductNotFoundError) {
      errorCode = ErrorCode.NOT_FOUND;
    } else {
      errorCode = ErrorCode.GENERAL_ERROR;
    }
  } else {
    errorCode = response?.statusCode === 404 ? ErrorCode.NOT_FOUND : ErrorCode.GENERAL_ERROR;
  }

  let search = asPath?.split('?')[1] ?? '';
  if (search) {
    search = `?${search}`;
  }
  const path = `${ERROR_PAGE_PATH_MAP[errorCode] ?? ERROR_PAGE_PATH_MAP[ErrorCode.GENERAL_ERROR]}${search}`;
  const configuration = buildConfiguration(path);
  // console.log('[_error]: path=', path);
  try {
    const page = await initialize({ ...configuration, request, httpClient: axios as any });
    const pageJson = page.toJSON();
    const commerceConfig = loadCommerceConfig(pageJson);
    return { configuration, page: page.toJSON(), commerceConfig };
  } catch (e) {
    return {};
  }
};

export default Error;
