/*
 * Copyright 2020 Bloomreach
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
import { Col, Image, Row } from 'react-bootstrap';
import { Document, ImageSet } from '@bloomreach/spa-sdk';
import { BrManageContentButton, BrPageContext } from '@bloomreach/react-sdk';

import { Link } from '../Link';
import styles from './Page.module.scss';

interface PageProps extends React.ComponentPropsWithoutRef<typeof Link> {
  document: Document;
}

export const Page = React.forwardRef(
  ({ document, className, ...props }: PageProps, ref: React.Ref<HTMLAnchorElement>) => {
    const page = React.useContext(BrPageContext);
    const { image: imageRef, introduction, title } = document.getData<ContentDocument>();
    const image = imageRef && page?.getContent<ImageSet>(imageRef)?.getOriginal();

    return (
      <Row
        ref={ref}
        as={Link}
        href={document.getUrl()}
        className={`${className ?? ''} text-decoration-none text-reset`}
        {...props}
      >
        <Col as="span" xs="3" sm="4" className="pr-0">
          <span className={`${styles['page__image-container']} ${!image ? 'bg-light' : ''} d-block`}>
            {image && (
              <Image className={`${styles.page__image} d-block w-100 h-100`} src={image.getUrl()} alt={title} />
            )}
          </span>
        </Col>
        <Col as="span" xs="9" sm="8" className={page?.isPreview() ? 'has-edit-button' : ''}>
          <BrManageContentButton content={document} />
          {title && <span className="d-block h6">{title}</span>}
          {introduction && <small className="d-block text-muted">{introduction}</small>}
        </Col>
      </Row>
    );
  },
);
