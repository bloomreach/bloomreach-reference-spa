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
import { Carousel, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ContainerItem, getContainerItemContent } from '@bloomreach/spa-sdk';
import { BrProps } from '@bloomreach/react-sdk';

import { Banner } from './Banner';
import styles from './MultiBannerCarousel.module.scss';

const DOCUMENTS_PER_SLIDE = 4;

interface MultiBannerCarouselParameters {
  interval?: number;
}

interface MultiBannerCarouselCompound {
  title: string;
  banners: BannerDocument[];
}

export function MultiBannerCarousel({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  const { interval = 0 } = component.getParameters<MultiBannerCarouselParameters>();
  const { title, banners } = getContainerItemContent<MultiBannerCarouselCompound>(component, page) ?? {};
  const slides = [];

  while (banners?.length) {
    slides.push(banners.splice(0, DOCUMENTS_PER_SLIDE));
  }

  return (
    <div className="mw-container mx-auto my-4">
      {title && <h3 className={styles.carouselTitle}>{title}</h3>}
      <Carousel
        controls={slides.length > 1}
        indicators={false}
        interval={interval}
        prevIcon={<FontAwesomeIcon icon={faChevronLeft} size="2x" className="text-secondary" />}
        nextIcon={<FontAwesomeIcon icon={faChevronRight} size="2x" className="text-secondary" />}
        className={styles.carousel}
      >
        {slides.map((slide, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Carousel.Item key={index}>
            <Row>
              {slide.map((banner, internalIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <Col key={`${index}-${internalIndex}`} as={Banner} xs={12 / DOCUMENTS_PER_SLIDE} document={banner} />
              ))}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}
