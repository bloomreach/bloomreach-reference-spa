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
import { Button, Carousel, Image } from 'react-bootstrap';
import { Document, ImageSet } from '@bloomreach/spa-sdk';
import { BrComponentContext, BrManageContentButton, BrPageContext } from '@bloomreach/react-sdk';

import { Link } from '../Link';
import { BrRichTextContent } from '..';
import styles from './Banner.module.scss';

interface BannerProps extends React.ComponentProps<'div'> {
  document: Document;
  parameterName?: string;
}

interface BannerParameters {
  alignment?: 'left' | 'center' | 'right';
}

export const Banner = React.forwardRef(
  ({ document, parameterName, className, ...props }: BannerProps, ref: React.Ref<HTMLDivElement>) => {
    const component = React.useContext(BrComponentContext);
    const page = React.useContext(BrPageContext);
    const { alignment = 'center' } = component?.getParameters<BannerParameters>() ?? {};
    const { content, cta, image: imageRef, link: linkRef, title } = document.getData<BannerDocument>();
    const image = imageRef && page?.getContent<ImageSet>(imageRef);
    const link = linkRef && page?.getContent<Document>(linkRef);

    return (
      <div ref={ref} className={`${className} ${page?.isPreview() ? 'has-edit-button' : ''}`} {...props}>
        <BrManageContentButton
          content={document}
          documentTemplateQuery="new-banner-document"
          folderTemplateQuery="new-banner-folder"
          parameter={parameterName ?? 'document'}
          root="banners"
          relative
        />

        {image && (
          <Image
            className={`${styles.banner__image} d-block w-100 h-100`}
            src={image.getOriginal()?.getUrl()}
            alt={title}
          />
        )}

        <Carousel.Caption className={`text-${alignment}`}>
          {title && (
            <h3 className="my-0">
              <mark className="d-inline-block">{title}</mark>
            </h3>
          )}
          {content && (
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
      </div>
    );
  },
);
