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

export function Product({ product }: ProductProps): React.ReactElement | null {
  const page = React.useContext(BrPageContext);
  const component = React.useContext(BrComponentContext);
  const ref = React.useRef<HTMLAnchorElement>(null);
  const { showDescription, showPid, showPrice, showTitle } =
    component?.getParameters<PathwaysRecommendationsParameters>() ?? {};
  const { itemId, listPrice, purchasePrice, displayName, description, imageSet, customAttrs } = product;
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
  const sale = useMemo(() => purchasePrice?.moneyAmounts?.[0], [purchasePrice]);
  const price = useMemo(() => listPrice?.moneyAmounts?.[0], [listPrice]);
  const displayPrice = sale ?? price;
  const thumbnail = useMemo(() => imageSet?.original?.link?.href, [imageSet]);

  return (
    <Link
      ref={ref}
      href={page?.getUrl(`/products/${itemId.id ?? ''}___${itemId.code ?? ''}`)}
      className="text-decoration-none text-reset"
    >
      <div className={styles['img-container']}>{thumbnail && <Image src={thumbnail} alt={displayName ?? ''} />}</div>
      {showTitle && (
        <div className={`${styles.name}`} title={displayName ?? ''}>
          {displayName}
        </div>
      )}
      {showPid && (
        <div className={`${styles['product-number']} text-muted`}>
          Product No. <span className="text-primary ml-1">{itemId.code}</span>
        </div>
      )}
      <div className={`${styles.manufacturer} text-muted`}>
        Manufacturer <span className="text-primary ml-1">{customAttributes?.brand}</span>
      </div>
      {showDescription && <div className={`${styles.description} text-muted`}>{description}</div>}
      {showPrice && displayPrice && (
        <div className={`${styles.price}`}>
          {displayPrice.currency ?? '$'} {displayPrice.amount?.toFixed(2)}
        </div>
      )}
    </Link>
  );
}
