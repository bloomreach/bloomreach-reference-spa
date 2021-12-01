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
import { Carousel, Row } from 'react-bootstrap';
import { ContainerItem, getContainerItemContent } from '@bloomreach/spa-sdk';
import { BrProps } from '@bloomreach/react-sdk';

import { BannerX } from './BannerX';

import styles from './SingleBannerCarousel.module.scss';

interface SingleBannerCarouselParameters {
  interval?: number;
}

interface SingleBannerCarouselCompound {
  banners: BannerDocument[];
}

export function SingleBannerCarouselX({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  const { interval = 0 } = component.getParameters<SingleBannerCarouselParameters>();
  const { banners } = getContainerItemContent<SingleBannerCarouselCompound>(component, page) ?? {};

  if (!banners?.length || component.isHidden()) {
    return page.isPreview() ? <div /> : null;
  }

  return (
    <Carousel as={Row} controls={banners.length > 1} indicators={banners.length > 1} interval={interval}>
      {banners.map((banner, index) => (
        <Carousel.Item
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          as={BannerX}
          className={styles.carousel__banner}
          document={banner}
        />
      ))}
    </Carousel>
  );
}
