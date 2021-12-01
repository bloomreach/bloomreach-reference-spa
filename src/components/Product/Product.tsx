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

import React, { useContext, useMemo } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Alert, Col, Image, Row, Table } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { ContainerItem, Document, Reference } from '@bloomreach/spa-sdk';
import { BrProps } from '@bloomreach/react-sdk';
import { ProductDetailInputProps, useProductDetail } from '@bloomreach/connector-components-react';

import { Placeholder } from './Placeholder';
import styles from './Product.module.scss';
import { CommerceContext } from '../../CommerceContext';
import { notEmpty } from '../../utils';
import { ProductNotFoundError } from './ProductNotFoundError';

interface ProductModels {
  specifications?: Reference;
}

type Attribute = Record<string, string>;

export function Product({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  const { specifications: specificationsRef } = component.getModels<ProductModels>();
  const specificationsBundle = specificationsRef && page.getContent<Document>(specificationsRef);

  const match = useRouteMatch<{ id: string }>('/products/:id');
  const pid = match?.params.id ?? '';

  const [cookies] = useCookies(['_br_uid_2']);

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

  const { keys = [], messages = [] } = specificationsBundle?.getData<ResourceBundle>() ?? {};
  const customAttrFields = useMemo(() => {
    const result = [...(smCustomAttrFields ?? [])];
    keys.filter((key) => !result.includes(key)).forEach((key) => result.push(key));
    return result;
  }, [keys, smCustomAttrFields]);

  const params: ProductDetailInputProps = useMemo(
    () => ({
      itemId: pid,
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
      cookies._br_uid_2,
      customAttrFields,
      pid,
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
  const [item, loading, error] = useProductDetail(params);
  const { itemId, listPrice, purchasePrice, displayName, description, imageSet, customAttrs } = item ?? {};
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
  const thumbnail = useMemo(() => imageSet?.original?.link?.href, [imageSet]);
  const specifications = useMemo(() => {
    return keys
      .map((key, index) => ({
        key,
        label: messages[index] || key,
        value: customAttributes?.[key],
      }))
      .filter(({ value }) => !!value && value !== 'undefined');
  }, [customAttributes, keys, messages]);

  // To fix ENT-3089
  if (!match) {
    return null;
  }

  if (component.isHidden()) {
    return page.isPreview() ? <div /> : null;
  }

  if (error) {
    // console.log(error);
    return (
      <div className="mw-container mx-auto">
        <Alert variant="danger" className="mt-3 mb-3">
          This widget is not working properly. Try again later.
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mw-container mx-auto">
        <Placeholder />
      </div>
    );
  }

  if (!itemId) {
    throw new ProductNotFoundError(pid);
  }

  return (
    <div className="mw-container mx-auto">
      <Row>
        <Col md={{ span: 8, order: 1 }}>
          <h2 className="mb-4">{displayName}</h2>
          <div className="text-muted">
            Product No. <span className="text-primary ml-1">{itemId.code}</span>
          </div>
          <div className="text-muted mb-4">
            Manufacturer <span className="text-primary ml-1">{customAttributes?.brand}</span>
          </div>
          <h4 className="mb-4">
            {price && (
              <span className={`${sale ? styles['product__list-price'] : ''} mr-2`}>
                {price.currency ?? '$'} {price.amount}
              </span>
            )}
            {sale && (
              <span className={styles['product__sale-price']}>
                {sale.currency ?? '$'} {sale.amount}
              </span>
            )}
          </h4>
        </Col>
        <Col md={{ span: 4, order: 0 }}>
          <div className={`${styles['product__image-container']} ${!thumbnail ? 'bg-light' : ''} mb-4`}>
            {thumbnail && (
              <Image className={`${styles.product__image} w-100 h-100`} src={thumbnail} alt={displayName ?? ''} />
            )}
          </div>
        </Col>
        <Col md={{ order: 2 }} lg="9">
          {description && (
            <>
              <h3 className="mb-4">Features &amp; Benefits</h3>
              <p className="mb-4">{description}</p>
            </>
          )}

          {specifications.length > 0 && (
            <>
              <h3 className="mb-4">Specifications</h3>
              <Table responsive className="mb-4">
                <thead className="thead-light">
                  <tr>
                    <th>Meta</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {specifications.map(({ key, label, value }) => (
                    <tr key={key}>
                      <td>{label}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
