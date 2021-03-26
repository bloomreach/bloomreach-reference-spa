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

import React, { useContext, useMemo } from 'react';
import { Image } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { BrPageContext } from '@bloomreach/react-sdk';
import { ItemIdModel, ProductDetailInputProps, useProductDetail } from '@bloomreach/connector-components-react';
import { CommerceContext } from '../../CommerceContext';
import styles from './ProductHighlightItem.module.scss';
import { notEmpty } from '../../utils';

import { Link } from '../Link';

interface ProductHighlightItemProps extends React.ComponentPropsWithoutRef<'a'> {
  itemId: ItemIdModel;
}

type Attribute = Record<string, string>;

export function ProductHighlightItem({ itemId }: ProductHighlightItemProps): JSX.Element {
  const page = React.useContext(BrPageContext);

  const {
    smAccountId,
    smAuthKey,
    smConnector,
    smCustomAttrFields,
    smCustomVarAttrFields,
    smCustomVarListPriceField,
    smCustomVarPurchasePriceField,
    smDomainKey,
    smViewId,
  } = useContext(CommerceContext);
  const [cookies] = useCookies(['_br_uid_2']);
  const customAttrFields = useMemo(() => [...(smCustomAttrFields ?? [])], [smCustomAttrFields]);
  const params: ProductDetailInputProps = useMemo(
    () => ({
      itemId,
      brUid2: cookies._br_uid_2,
      connector: smConnector,
      customAttrFields,
      customVariantAttrFields: smCustomVarAttrFields,
      customVariantListPriceField: smCustomVarListPriceField,
      customVariantPurchasePriceField: smCustomVarPurchasePriceField,
      smAccountId,
      smAuthKey,
      smDomainKey,
      smViewId,
    }),
    [
      itemId,
      cookies._br_uid_2,
      customAttrFields,
      smAccountId,
      smAuthKey,
      smConnector,
      smCustomVarAttrFields,
      smCustomVarListPriceField,
      smCustomVarPurchasePriceField,
      smDomainKey,
      smViewId,
    ],
  );
  const [item, loading] = useProductDetail(params);
  const { purchasePrice, displayName, imageSet, customAttrs } = item ?? {};
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
  const thumbnail = useMemo(() => imageSet?.original?.link?.href, [imageSet]);

  if (!itemId || loading) {
    return <div />;
  }

  return (
    <Link href={page?.getUrl()} className={`${styles.banner} text-reset text-decoration-none`}>
      {thumbnail && (
        <span className={`${styles.banner__container} d-block position-relative h-0 mb-3`}>
          <Image className={`${styles.banner__image} w-100 h-100`} src={thumbnail} alt={displayName ?? ''} />
        </span>
      )}
      <span className="d-block h4 mb-3">{item?.displayName}</span>
      <div className="text-muted">
        Product No. <span className="text-primary ml-1">{itemId.code}</span>
      </div>
      <div className="text-muted mb-4">
        Manufacturer <span className="text-primary ml-1">{customAttributes?.brand}</span>
      </div>
      <h4 className="mb-4">
        {sale && (
          <span className={styles['product__sale-price']}>
            {sale.currency ?? '$'} {sale.amount}
          </span>
        )}
      </h4>
    </Link>
  );
}
