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
import { Link } from 'react-router-dom';
import { Button, Carousel, Image } from 'react-bootstrap';
import { Document, ImageSet, Reference } from '@bloomreach/spa-sdk';
import { BrComponentContext, BrManageContentButton, BrPageContext, BrProps } from '@bloomreach/react-sdk';

import styles from './SingleBannerCarousel.module.scss';

const MAX_DOCUMENTS = 5;

interface SingleBannerCarouselModels {
  document1?: Reference;
  document2?: Reference;
  document3?: Reference;
  document4?: Reference;
  document5?: Reference;
}

interface BannerProps extends React.ComponentProps<typeof Carousel.Item> {
  document: Document;
}

const Banner = React.forwardRef(({ document, className, ...props }: BannerProps, ref) => {
  const component = React.useContext(BrComponentContext)!;
  const page = React.useContext(BrPageContext)!;

  const { alignment = 'center' } = component.getParameters();
  const { content, cta, image: imageRef, link: linkRef, title } = document.getData<DocumentData>();
  const image = imageRef && page.getContent<ImageSet>(imageRef);
  const link = linkRef && page.getContent<Document>(linkRef)?.getUrl();

  return (
    <Carousel.Item ref={ref} className={`${className} ${page.isPreview() ? 'has-edit-button' : ''}`} {...props}>
      <BrManageContentButton content={document} />

      {image && (
        <Image
          className={`d-block w-100 h-100 ${styles.banner__image}`}
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
          <div
            className={`d-inline-block mark mt-1 ${styles.banner__contents}`}
            dangerouslySetInnerHTML={{ __html: page.rewriteLinks(content.value) }}
          />
        )}
        {link && (
          <div className="mt-2">
            <Button as={Link} variant="primary" to={link}>
              {cta}
            </Button>
          </div>
        )}
      </Carousel.Caption>
    </Carousel.Item>
  );
});

export function SingleBannerCarousel({ component, page }: BrProps): React.ReactElement | null {
  const { interval = 0 } = component.getParameters();
  const models = component.getModels<SingleBannerCarouselModels>();
  const documents = [...Array(MAX_DOCUMENTS).keys()]
    .map((n) => `document${n + 1}` as keyof SingleBannerCarouselModels)
    .map((model) => models[model])
    .map((reference) => reference && page.getContent<Document>(reference))
    .filter<Document>(Boolean as any);

  if (!documents.length) {
    return null;
  }

  return (
    <Carousel controls={documents.length > 1} indicators={documents.length > 1} interval={interval}>
      {documents.map((document, index) => (
        <Banner key={index} className={styles.carousel__banner} document={document} />
      ))}
    </Carousel>
  );
}
