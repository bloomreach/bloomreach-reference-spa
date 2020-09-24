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
import { Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BrPageContext } from '@bloomreach/react-sdk';

import { Search } from './Search';
import styles from './Navbar.module.scss';

export function NavbarComponent({ children }: React.PropsWithChildren<unknown>): React.ReactElement {
  return (
    <Navbar bg="light" expand="lg" sticky="top" className="py-2 py-lg-3">
      <Container className="justify-content-start px-sm-3">
        <BrPageContext.Consumer>
          {(page) => (
            <Navbar.Brand as={Link} to={page!.getUrl('/')} title="Pacific Nuts & Bolts">
              <img
                alt="Pacific Nuts & Bolts"
                src={`${process.env.PUBLIC_URL}/logo.png`}
                srcSet={`${process.env.PUBLIC_URL}/logo.png 1x, ${process.env.PUBLIC_URL}/logo@2x.png 2x`}
                height="30"
                className="d-none d-sm-block"
              />

              <img
                alt="Pacific Nuts & Bolts"
                src={`${process.env.PUBLIC_URL}/logo-sm.png`}
                srcSet={`${process.env.PUBLIC_URL}/logo-sm.png 1x, ${process.env.PUBLIC_URL}/logo-sm@2x.png 2x`}
                height="30"
                className="d-block d-sm-none"
              />
            </Navbar.Brand>
          )}
        </BrPageContext.Consumer>

        <Search className={`${styles.navbar__search} order-lg-2 mr-3 mr-lg-0`} />

        <Navbar.Toggle className="ml-auto" />
        <Navbar.Collapse className="order-lg-1 mr-lg-3">{children}</Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export { NavbarComponent as Navbar };
