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

import React from 'react';
import { BrProps } from '@bloomreach/react-sdk';
import { ProductHighlightItem } from './ProductHighlightItem';

const MAX_PRODUCTS = 4;

export function ProductHighlight({ component, page }: BrProps): React.ReactElement | null {
  const params = component.getParameters();
  const { title } = params;
  const itemIds = [...Array(MAX_PRODUCTS).keys()]
    .map((i) => ({
      id: params[`id${i + 1}`],
      code: params[`code${i + 1}`],
    }))
    .filter((itemId) => itemId.id || itemId.code);

  if (!itemIds.length) {
    return page.isPreview() ? <div /> : null;
  }

  return (
    <div className="mw-container mx-auto my-4">
      {title && <h3 className="mb-4">{title}</h3>}
      {itemIds.map((itemId) => (
        <ProductHighlightItem itemId={itemId} />
      ))}
    </div>
  );
}
