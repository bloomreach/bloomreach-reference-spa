/*
 * Copyright 2021 Bloomreach
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

import React, { useContext, useEffect, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { BrPageContext } from '@bloomreach/react-sdk';
import { CategoryInputProps, useCategory } from '@bloomreach/connector-components-react';
import { Link } from '../Link';
import { CommerceContext } from '../../CommerceContext';

interface CategoryHighlightItemProps extends React.ComponentPropsWithoutRef<'a'> {
  connectorId: string | undefined;
  categoryId: string;
  setError: React.Dispatch<React.SetStateAction<Error | undefined>>;
}

export function CategoryHighlightItem({ connectorId, categoryId, setError }: CategoryHighlightItemProps): JSX.Element {
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
  const params: CategoryInputProps = useMemo(
    () => ({
      categoryId,
      brUid2: cookies._br_uid_2,
      connector: connectorId ?? smConnector,
      customAttrFields: smCustomAttrFields,
      customVariantAttrFields: smCustomVarAttrFields,
      customVariantListPriceField: smCustomVarListPriceField,
      customVariantPurchasePriceField: smCustomVarPurchasePriceField,
      smAccountId,
      smAuthKey,
      smDomainKey,
      smViewId,
    }),
    [
      categoryId,
      cookies._br_uid_2,
      smCustomAttrFields,
      smAccountId,
      smAuthKey,
      smConnector,
      smCustomVarAttrFields,
      smCustomVarListPriceField,
      smCustomVarPurchasePriceField,
      smDomainKey,
      smViewId,
      connectorId,
    ],
  );
  const [category, loading, error] = useCategory(params);
  useEffect(() => {
    if (error) {
      setError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
  const { displayName } = category ?? {};

  if (!category || loading) {
    return <div />;
  }

  return (
    <div className="col-6 col-sm-3 mb-4">
      <Button
        type="link"
        as={Link}
        href={page?.getUrl(`/categories/${categoryId}`)}
        variant="primary"
        className="w-100 h-100"
      >
        <table className="w-100 h-100">
          <tbody>
            <tr>
              <td className="align-middle">{displayName}</td>
            </tr>
          </tbody>
        </table>
      </Button>
    </div>
  );
}
