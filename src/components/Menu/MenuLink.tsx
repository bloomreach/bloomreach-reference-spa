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
import { Link } from 'react-router-dom';
import { MenuItem, TYPE_LINK_EXTERNAL } from '@bloomreach/spa-sdk';

interface MenuLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  item: MenuItem;
}

export const MenuLink = React.forwardRef(({ item, ...props }: MenuLinkProps, ref: React.Ref<HTMLAnchorElement>) => {
  const url = item.getUrl();

  if (!url || item.getLink()?.type === TYPE_LINK_EXTERNAL) {
    return (
      <a ref={ref} href={url} role="button" {...props}>
        {item.getName()}
      </a>
    );
  }

  return (
    <Link ref={ref} to={url} role="button" {...props}>
      {item.getName()}
    </Link>
  );
});
