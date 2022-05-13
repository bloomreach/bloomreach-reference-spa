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

import React, { ReactElement } from 'react';
import { Col, Container, Image, Navbar, Row } from 'react-bootstrap';
import { Link } from './components';

import styles from './ErrorPage.module.scss';
import errorImage from './error.gif';

export default function ErrorPage(): ReactElement {
  return (
    <>
      <header>
        <Navbar bg="light" expand="lg" sticky="top" className="py-2 py-lg-3">
          <Container className="justify-content-start px-sm-3">
            <Navbar.Brand as={Link} href="/" title="Pacific Nuts & Bolts">
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
                <Image src={errorImage} alt="Critical error" />
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
}
