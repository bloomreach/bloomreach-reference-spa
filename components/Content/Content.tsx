/*
 * Copyright 2020-2022 Bloomreach
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
import { ContainerItem, getContainerItemContent, ImageSet } from '@bloomreach/spa-sdk';
import { BrProps } from '@bloomreach/react-sdk';
import { BrRichTextContent } from '../BrRichTextContent';
import { ErrorPageContent } from './ErrorPageContent';

import styles from './Content.module.scss';

const errorPages = ['/404', '/500', '/error'];

export function Content({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  if (!component || !page) { return null; }

  const document = getContainerItemContent<ContentDocument>(component, page);
  const pageUrl = page.getUrl() ?? '';

  if (!document || component.isHidden()) {
    return page.isPreview() ? <div /> : null;
  }

  if (errorPages.some((path) => pageUrl.startsWith(path))) {
    return <ErrorPageContent document={document} page={page} />;
  }

  const { content, image: imageRef, title } = document;
  const image = imageRef && page?.getContent<ImageSet>(imageRef)?.getOriginal();

  return (
    <article className="mw-container mx-auto">
      {title && <h1 className="mb-4">{title}</h1>}
      {image && (
        <div className={`${styles['content__image-container']} mb-4`}>
          <Image className={`${styles.content__image} d-block w-100 h-100`} src={image.getUrl()} alt={title} />
        </div>
      )}
      {content?.value && <BrRichTextContent page={page!} content={{ html: content.value }} className="mb-4" />}
    </article>
  );
}
