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

import React from 'react';
import { Button, Carousel, Image } from 'react-bootstrap';
import { Document, ImageSet } from '@bloomreach/spa-sdk';
import { BrPageContext } from '@bloomreach/react-sdk';

import { Link } from '../Link';
import { BrRichTextContent } from '..';
import styles from './Banner.module.scss';

interface BannerProps extends React.ComponentPropsWithoutRef<'a'> {
  document: BannerDocument;
}

export const Banner = React.forwardRef(
  ({ document, className, ...props }: BannerProps, ref: React.Ref<HTMLAnchorElement>) => {
    const page = React.useContext(BrPageContext);

    const { image: imageRef, link: linkRef, title, content, cta } = document;
    const link = linkRef && page?.getContent<Document>(linkRef);
    const image = imageRef && page?.getContent<ImageSet>(imageRef)?.getOriginal();

    return (
      <Link
        ref={ref}
        href={link?.getUrl()}
        className={`${styles.banner} ${page?.isPreview() ? 'has-edit-button' : ''} ${className ?? ''}`}
        {...props}
      >
        {image && <Image className={`${styles.banner__image} d-block w-100 h-100`} src={image.getUrl()} alt={title} />}

        <Carousel.Caption>
          {title && (
            <h3 className="my-0">
              <mark className="d-inline-block">{title}</mark>
            </h3>
          )}
          {content?.value && (
            <BrRichTextContent
              page={page!}
              content={{ html: content.value }}
              className={`${styles.banner__contents} d-inline-block mark mt-1`}
            />
          )}
          {cta && (
            <div className="mt-2">
              <Button as={Link} variant="primary" href={link?.getUrl()}>
                {cta}
              </Button>
            </div>
          )}
        </Carousel.Caption>
      </Link>
    );
  },
);
