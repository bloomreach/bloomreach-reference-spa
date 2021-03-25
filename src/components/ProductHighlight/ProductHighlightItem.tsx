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

import React from 'react';
import { BrPageContext } from '@bloomreach/react-sdk';
import { ItemFragment } from '@bloomreach/connector-components-react';
import styles from './ProductHighlightItem.module.scss';

import { Link } from '../Link';

interface ProductHighlightItemProps extends React.ComponentPropsWithoutRef<'a'> {
  item: ItemFragment | undefined;
}

export const ProductHighlightItem = React.forwardRef(
  ({ item, className, ...props }: ProductHighlightItemProps, ref: React.Ref<HTMLAnchorElement>) => {
    const page = React.useContext(BrPageContext);
    return (
      <Link
        ref={ref}
        href="/"
        className={`${styles.banner} ${page?.isPreview() ? 'has-edit-button' : ''} ${
          className ?? ''
        } text-reset text-decoration-none`}
        {...props}
      >
        <span className="d-block h4 mb-3">{item?.displayName}</span>
      </Link>
    );
  },
);
