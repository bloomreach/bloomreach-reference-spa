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
import { Image } from 'react-bootstrap';
import { BrPageContext } from '@bloomreach/react-sdk';

import { Link } from '../Link';
import styles from './Product.module.scss';

interface ProductProps extends React.ComponentPropsWithoutRef<typeof Link> {
  product: ProductDocument;
}

export const Product = React.forwardRef(
  ({ product, className, ...props }: ProductProps, ref: React.Ref<HTMLAnchorElement>) => {
    const page = React.useContext(BrPageContext);
    const { brand, pid, sale_price: sale, price, title, thumb_image: thumbnail, url } = product;

    return (
      <Link
        ref={ref}
        href={page?.getUrl(url)}
        className={`${className ?? ''} text-decoration-none text-reset`}
        {...props}
      >
        <span className={`${styles['product__image-container']} ${!thumbnail ? 'bg-light' : ''} d-block mb-3`}>
          {thumbnail && (
            <Image className={`${styles.product__image} d-block w-100 h-100`} src={thumbnail} alt={title} />
          )}
        </span>
        <span className="h6 d-block text-truncate mb-2" title={title}>
          {title}
        </span>
        <small className="text-muted d-block mb-1">
          Product No. <span className="text-primary ml-1">{pid}</span>
        </small>
        <small className="text-muted d-block mb-2">
          Manufacturer <span className="text-primary ml-1">{brand}</span>
        </small>
        <strong className="h6">$ {(sale ?? price).toFixed(2)}</strong>
      </Link>
    );
  },
);
