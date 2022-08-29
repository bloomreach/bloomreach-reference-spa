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
import { BrPageContext } from '@bloomreach/react-sdk';
import { ItemIdModel, ItemsByIds_findItemsByIds_items as ItemDetail } from '@bloomreach/connector-components-react';
import styles from './ProductHighlight.module.scss';
import { notEmpty } from '../../src/utils';

import { Link } from '../Link';

interface ProductHighlightItemProps extends React.ComponentPropsWithoutRef<'a'> {
  itemDetail: ItemDetail | null;
}

type Attribute = Record<string, string>;

export function ProductHighlightItem({ itemDetail }: ProductHighlightItemProps): JSX.Element {
  const page = React.useContext(BrPageContext);
  const selectedItemId = itemDetail?.itemId as ItemIdModel;
  const selectedVariant = itemDetail?.variants?.find(
    (variant) => variant?.itemId.id === selectedItemId.id && variant?.itemId.code === selectedItemId.code,
  );
  const { listPrice, purchasePrice, displayName, imageSet, customAttrs } = selectedVariant ?? itemDetail ?? {};
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
  const price = useMemo(() => listPrice?.moneyAmounts?.[0], [listPrice]);
  const sale = useMemo(() => purchasePrice?.moneyAmounts?.[0], [purchasePrice]);
  const displayPrice = sale ?? price;
  const thumbnail = useMemo(() => imageSet?.original?.link?.href, [imageSet]);

  if (!itemDetail) {
    return <div />;
  }
  return (
    <Link
      href={page?.getUrl(`/products/${itemDetail?.itemId.code ?? itemDetail?.itemId.id}`)}
      className="col-sm-3 mb4 text-reset text-decoration-none"
    >
      {thumbnail && (
        <div className={`${styles['img-container']}`}>
          <Image src={thumbnail} alt={displayName ?? ''} />
        </div>
      )}
      <div className={`${styles.name} d-block h4 text-truncate mb-3`}>{itemDetail?.displayName}</div>
      <div className={`${styles['product-number']} text-muted`}>
        Product No. <span className="text-primary ml-1">{itemDetail.itemId.code}</span>
      </div>
      <div className={`${styles.manufacturer} text-muted`}>
        Manufacturer <span className="text-primary ml-1">{customAttributes?.brand}</span>
      </div>
      <h4 className="mb-4">
        {displayPrice && (
          <div className={`${styles.price}`}>
            {displayPrice.currency ?? '$'} {displayPrice.amount}
          </div>
        )}
      </h4>
    </Link>
  );
}
