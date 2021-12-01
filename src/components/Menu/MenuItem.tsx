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
import { Nav } from 'react-bootstrap';
import { MenuItem as BrMenuItem } from '@bloomreach/spa-sdk';

import { MenuLink } from './MenuLink';

interface MenuItemProps extends React.ComponentProps<typeof Nav.Link> {
  item: BrMenuItem;
}

export const MenuItem = React.forwardRef(({ item, ...props }: MenuItemProps, ref) => (
  <Nav.Link ref={ref} as={MenuLink} to={item} active={item.isSelected()} {...props}>
    {item.getName()}
  </Nav.Link>
));
