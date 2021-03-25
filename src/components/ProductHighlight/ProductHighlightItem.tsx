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

import React, { useContext } from 'react';
import { useCookies } from 'react-cookie';
import { BrPageContext } from '@bloomreach/react-sdk';
import { ItemIdModel, useProductDetail } from '@bloomreach/connector-components-react';
import { CommerceContext } from '../../CommerceContext';
import styles from './ProductHighlightItem.module.scss';

import { Link } from '../Link';

interface ProductHighlightItemProps extends React.ComponentPropsWithoutRef<'a'> {
  itemId: ItemIdModel;
}

export function ProductHighlightItem({ itemId }: ProductHighlightItemProps): JSX.Element {
  const {
    smDomainKey,
    smConnector,
    smViewId,
    smAccountId,
    smAuthKey,
    smCustomAttrFields,
    smCustomVarAttrFields,
  } = useContext(CommerceContext);
  const [cookies] = useCookies(['_br_uid_2']);

  const [item] = useProductDetail({
    itemId,
    // smAccountId,
    // smDomainKey,
    // smAuthKey,
    smViewId,
    brUid2: cookies._br_uid_2,
    connector: smConnector,
    // customAttrFields: smCustomAttrFields,
    // customVariantAttrFields: smCustomVarAttrFields,
  });

  const page = React.useContext(BrPageContext);
  return (
    <Link
      href="/"
      className={`${styles.banner} ${page?.isPreview() ? 'has-edit-button' : ''} text-reset text-decoration-none`}
    >
      <span className="d-block h4 mb-3">{item?.displayName}</span>
    </Link>
  );
}
