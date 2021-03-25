/*
 * Copyright 2021 Hippo B.V. (http://www.onehippo.com)
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
import { Col, Row } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { BrProps } from '@bloomreach/react-sdk';
import { useProductDetail } from '@bloomreach/connector-components-react';
import { CommerceContext } from '../../CommerceContext';

import { ProductHighlightItem } from './ProductHighlightItem';

interface ProductHighlightParameters {
  title?: string;
  id1?: string;
  code1?: string;
  id2?: string;
  code2?: string;
  id3?: string;
  code3?: string;
  id4?: string;
  code4?: string;
}

export function ProductHighlight({ component, page }: BrProps): React.ReactElement | null {
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
  const { title, id1, code1, id2, code2, id3, code3, id4, code4 } = component.getParameters<
    ProductHighlightParameters
  >();

  const baseProps = {
    // smAccountId,
    // smDomainKey,
    // smAuthKey,
    smViewId,
    brUid2: cookies._br_uid_2,
    connector: smConnector,
    // customAttrFields: smCustomAttrFields,
    // customVariantAttrFields: smCustomVarAttrFields,
  };

  const [item1] = useProductDetail({ ...baseProps, itemId: { id: id1, code: code1 } });
  const [item2] = useProductDetail({ ...baseProps, itemId: { id: id2, code: code2 } });
  const [item3] = useProductDetail({ ...baseProps, itemId: { id: id3, code: code3 } });
  const [item4] = useProductDetail({ ...baseProps, itemId: { id: id4, code: code4 } });

  const items = [item1, item2, item3, item4].filter((item) => item?.itemId?.id);

  if (!items.length) {
    return page.isPreview() ? <div /> : null;
  }

  return (
    <div className="mw-container mx-auto my-4">
      {title && <h3 className="mb-4">{title}</h3>}
      <Row>
        {items.map((item) => (
          <Col as={ProductHighlightItem} xs="6" md="4" lg="3" item={item} />
        ))}
      </Row>
    </div>
  );
}
