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
import { Carousel, Col, Container, Image, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Document, ImageSet, Reference } from '@bloomreach/spa-sdk';
import { BrManageContentButton, BrPageContext, BrProps } from '@bloomreach/react-sdk';

import styles from './MultiBannerCarousel.module.scss';

const MAX_DOCUMENTS = 10;
const DOCUMENTS_PER_SLIDE = 4;

interface MultiBannerCarouselModels {
  document1?: Reference;
  document2?: Reference;
  document3?: Reference;
  document4?: Reference;
  document5?: Reference;
  document6?: Reference;
  document7?: Reference;
  document8?: Reference;
  document9?: Reference;
  document10?: Reference;
}

interface BannerProps {
  document: Document;
}

function Banner({ document }: BannerProps): React.ReactElement {
  const page = React.useContext(BrPageContext)!;

  const { image: imageRef, link: linkRef, title } = document.getData<DocumentData>();
  const link = linkRef && page.getContent<Document>(linkRef)?.getUrl();
  const src = imageRef && page.getContent<ImageSet>(imageRef)?.getOriginal()?.getUrl();
  const image = src && <Image className={`${styles.banner__image} d-block w-100 h-100`} src={src} alt={title} />;

  return (
    <Col xs={3} className={`${styles.banner} ${page.isPreview() ? 'has-edit-button' : ''}`}>
      <BrManageContentButton content={document} />
      {link ? <Link to={link}>{image}</Link> : image}
    </Col>
  );
}

export function MultiBannerCarousel({ component, page }: BrProps): React.ReactElement | null {
  const { interval = 0, title } = component.getParameters();
  const models = component.getModels<MultiBannerCarouselModels>();
  const documents = [...Array(MAX_DOCUMENTS).keys()]
    .map((n) => `document${n + 1}` as keyof MultiBannerCarouselModels)
    .map((model) => models[model])
    .map((reference) => reference && page.getContent<Document>(reference))
    .filter<Document>(Boolean as any);
  const slides = [];

  while (documents.length) {
    slides.push(documents.splice(0, DOCUMENTS_PER_SLIDE));
  }

  if (!slides.length) {
    return null;
  }

  /* eslint-disable react/no-array-index-key */
  return (
    <Container className="py-4">
      {title && <h3 className="mb-4 text-center">{title}</h3>}
      <Carousel
        controls={slides.length > 1}
        indicators={false}
        interval={interval}
        prevIcon={<FontAwesomeIcon icon={faChevronLeft} size="2x" className="text-secondary" />}
        nextIcon={<FontAwesomeIcon icon={faChevronRight} size="2x" className="text-secondary" />}
        className={styles.carousel}
      >
        {slides.map((slide, index) => (
          <Carousel.Item key={index}>
            <Row>
              {slide.map((document, subindex) => (
                <Banner key={subindex} document={document} />
              ))}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
}
