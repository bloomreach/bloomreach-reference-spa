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
import { Image } from 'react-bootstrap';
import { BrManageContentButton } from '@bloomreach/react-sdk';
import { Document, ImageSet, Page } from '@bloomreach/spa-sdk';
import { BrRichTextContent } from '..';

import styles from './ErrorPageContent.module.scss';

interface ErrorPageContentProps {
  page: Page;
  document: Document;
}

export function ErrorPageContent({ document, page }: ErrorPageContentProps): React.ReactElement | null {
  const { content, image: imageRef, title } = document.getData<ContentDocument>();
  const image = imageRef && page.getContent<ImageSet>(imageRef)?.getOriginal();

  return (
    <article className={`${page.isPreview() ? 'has-edit-button' : ''} ${styles['error-page']}`}>
      <BrManageContentButton content={document} />
      {title && <h1>{title}</h1>}
      {content?.value && (
        <BrRichTextContent page={page!} content={{ html: content.value }} className={styles['error-text']} />
      )}
      {image && (
        <p>
          <Image src={image.getUrl()} alt={title} />
        </p>
      )}
    </article>
  );
}
