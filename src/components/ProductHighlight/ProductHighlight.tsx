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

const MAX_PRODUCTS = 4;

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
  const { title, id1, code1, id2, code2, id3, code3, id4, code4 } = component.getParameters<
    ProductHighlightParameters
  >();
  return page.isPreview() ? <div /> : null;
}
