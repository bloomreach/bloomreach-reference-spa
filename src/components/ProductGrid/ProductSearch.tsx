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
import { useHistory } from 'react-router-dom';
import { BrProps } from '@bloomreach/react-sdk';

import { ProductGrid } from './ProductGrid';

interface ProductSearchParameters {
  limit: number;
  pagination: boolean;
  sorting: boolean;
  total: boolean;
}

export function ProductSearch({ component }: BrProps): React.ReactElement {
  const { limit, pagination, sorting, total } = component.getParameters<ProductSearchParameters>();
  const history = useHistory();

  const query = useMemo(() => {
    const search = new URLSearchParams(history.location.search);

    return search.get('q') ?? '';
  }, [history.location.search]);

  const params = useMemo(
    () => ({
      q: query,
      request_type: 'search',
      search_type: 'keyword',
    }),
    [query],
  );

  return (
    <ProductGrid
      limit={limit}
      pagination={pagination}
      params={params}
      sorting={sorting}
      stats={total}
      title={
        <>
          <span className="font-weight-normal">Search results for</span>{' '}
          <span className="font-weight-bold text-capitalize">{query}</span>
        </>
      }
    />
  );
}
