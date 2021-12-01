/*
 * Copyright 2020 Bloomreach
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
import { MenuItem, TYPE_LINK_EXTERNAL } from '@bloomreach/spa-sdk';

import { Link } from '../Link';

interface MenuLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  to: MenuItem;
}

export const MenuLink = React.forwardRef(
  ({ to, href = to.getUrl(), ...props }: MenuLinkProps, ref: React.Ref<HTMLAnchorElement>) =>
    to.getLink()?.type === TYPE_LINK_EXTERNAL ? (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <a ref={ref} href={href} role="button" {...props} />
    ) : (
      <Link ref={ref} href={href} {...props} />
    ),
);
