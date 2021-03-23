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

import React, { useMemo } from 'react';
import { Image } from 'react-bootstrap';
import { BrComponentContext, BrPageContext } from '@bloomreach/react-sdk';
import { ItemFragment } from '@bloomreach/connector-components-react';

import { PathwaysRecommendationsParameters } from './PathwaysRecommendations';
import { Link } from '../Link';
import { notEmpty } from '../../utils';

import styles from './Product.module.scss';

interface ProductProps extends React.ComponentPropsWithoutRef<typeof Link> {
  product: ItemFragment;
}

type Attribute = Record<string, string>;

export const Product = React.forwardRef(
  ({ product, className, ...props }: ProductProps, ref: React.Ref<HTMLAnchorElement>) => {
    const page = React.useContext(BrPageContext);
    const component = React.useContext(BrComponentContext);
    const { showDescription, showPid, showPrice, showTitle } =
      component?.getParameters<PathwaysRecommendationsParameters>() ?? {};
    const { itemId, listPrice, purchasePrice, displayName, imageSet, customAttrs } = product;
    const customAttributes = useMemo(
      () =>
        customAttrs
          ?.filter(notEmpty)
          .reduce(
            (result, attr) => Object.assign(result, { [attr.name]: attr.values?.filter(notEmpty).join(', ') ?? '' }),
            {} as Attribute,
          ),
      [customAttrs],
    );
    const sale = useMemo(() => purchasePrice?.moneyAmounts?.[0]?.amount, [purchasePrice]);
    const price = useMemo(() => listPrice?.moneyAmounts?.[0]?.amount, [listPrice]);
    const thumbnail = useMemo(() => imageSet?.original?.link?.href, [imageSet]);

    return (
      <Link
        ref={ref}
        href={page?.getUrl(`/products/${itemId.id ?? ''}___${itemId.code ?? ''}`)}
        className={`${className ?? ''} text-decoration-none text-reset`}
        {...props}
      >
        <span className={`${styles['product__image-container']} ${!thumbnail ? 'bg-light' : ''} d-block mb-3`}>
          {thumbnail && (
            <Image className={`${styles.product__image} d-block w-100 h-100`} src={thumbnail} alt={displayName ?? ''} />
          )}
        </span>
        {showTitle && (
          <span className="h6 d-block text-truncate mb-2" title={displayName ?? ''}>
            {displayName}
          </span>
        )}
        {showPid && (
          <small className="text-muted d-block mb-1">
            Product No. <span className="text-primary ml-1">{itemId.code}</span>
          </small>
        )}
        <small className="text-muted d-block mb-2">
          Manufacturer <span className="text-primary ml-1">{customAttributes?.brand}</span>
        </small>
        {showPrice && <strong className="h6">$ {(sale ?? price)?.toFixed(2)}</strong>}
      </Link>
    );
  },
);
