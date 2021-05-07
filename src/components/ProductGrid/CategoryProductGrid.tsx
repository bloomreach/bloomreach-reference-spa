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
import { BrProps } from '@bloomreach/react-sdk';
import { ContainerItem } from '@bloomreach/spa-sdk';
import { ProductGridCategoryInputProps, useProductGridCategory } from '@bloomreach/connector-components-react';

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

export function CategoryProductGrid({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  const {
    category,
    filters: filtersParameter = '',
    limit,
    pagination,
    sorting,
    title,
    total,
  } = component.getParameters<ProductGridParameters>();
  const params: ProductGridCategoryInputProps = useMemo(() => ({ categoryId: category }), [category]);

  const filters = useMemo(
    () =>
      filtersParameter
        .split(';')
        .map((filter) => filter.trim())
        .filter(Boolean),
    [filtersParameter],
  );

  if (component.isHidden()) {
    return page.isPreview() ? <div /> : null;
  }

  return (
    <ProductGrid
      filters={filters}
      limit={limit}
      pagination={pagination}
      params={params}
      sorting={sorting}
      stats={total}
      title={title}
      useSearch={useProductGridCategory}
    />
  );
}
