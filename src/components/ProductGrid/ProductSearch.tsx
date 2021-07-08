/*
 * Copyright 2020-2021 Hippo B.V. (http://www.onehippo.com)
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
import { useHistory } from 'react-router-dom';
import { BrProps } from '@bloomreach/react-sdk';
import { ContainerItem } from '@bloomreach/spa-sdk';
import { ProductGridSearchInputProps, useProductGridSearch } from '@bloomreach/connector-components-react';

import { ProductGrid } from './ProductGrid';

interface ProductSearchParameters {
  limit: number;
  pagination: boolean;
  sorting: boolean;
  total: boolean;
}

export function ProductSearch({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  const { limit, pagination, sorting, total } = component.getParameters<ProductSearchParameters>();
  const history = useHistory();

  const query = useMemo(() => {
    const search = new URLSearchParams(history.location.search);

    return search.get('q') ?? '';
  }, [history.location.search]);

  const params: ProductGridSearchInputProps = useMemo(() => ({ searchText: query }), [query]);

  if (component.isHidden()) {
    return page.isPreview() ? <div /> : null;
  }

  return (
    <ProductGrid
      limit={limit}
      pagination={pagination}
      params={params}
      sorting={sorting}
      stats={total}
      query={query}
      title="Search results for"
      appendQueryToTitle
      useSearch={useProductGridSearch}
    />
  );
}
