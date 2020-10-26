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
import { BrProps } from '@bloomreach/react-sdk';

import { ProductGrid } from './ProductGrid';

interface ProductGridParameters {
  category: string;
  filters?: string;
  limit: number;
  pagination: boolean;
  sorting: boolean;
  title?: string;
  total: boolean;
  view?: string;
  widget?: string;
}

export function CategoryProductGrid({ component }: BrProps): React.ReactElement {
  const {
    category,
    filters: filtersParameter = '',
    limit,
    pagination,
    sorting,
    title,
    total,
    view,
    widget,
  } = component.getParameters<ProductGridParameters>();
  const params = useMemo(
    () => ({
      q: category,
      request_type: 'search',
      search_type: 'category',
      view_id: view,
      widget_id: widget,
    }),
    [category, view, widget],
  );

  const filters = useMemo(
    () =>
      filtersParameter
        .split(';')
        .map((filter) => filter.trim())
        .filter(Boolean),
    [filtersParameter],
  );

  return (
    <ProductGrid
      filters={filters}
      limit={limit}
      pagination={pagination}
      params={params}
      sorting={sorting}
      stats={total}
      title={title}
    />
  );
}
