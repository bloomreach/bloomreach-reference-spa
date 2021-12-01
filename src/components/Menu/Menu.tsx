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
import { Dropdown, Nav } from 'react-bootstrap';
import { Menu as BrMenu, Reference, isMenu } from '@bloomreach/spa-sdk';
import { BrComponentContext, BrManageMenuButton, BrPageContext } from '@bloomreach/react-sdk';

import { MenuItem } from './MenuItem';
import { MenuLink } from './MenuLink';

interface MenuModels {
  menu: Reference;
}

export function Menu(): React.ReactElement | null {
  const component = React.useContext(BrComponentContext);
  const page = React.useContext(BrPageContext);
  const menuRef = component?.getModels<MenuModels>()?.menu;
  const menu = menuRef && page?.getContent<BrMenu>(menuRef);

  if (!isMenu(menu)) {
    throw new Error('Menu is not available');
  }

  return (
    <Nav as="ul" navbar className={`w-100 ${page!.isPreview() ? 'has-edit-button' : ''}`}>
      <BrManageMenuButton menu={menu} />
      {menu.getItems().map((item) =>
        item.getChildren().length ? (
          <Dropdown as="li" key={item.getName()}>
            <Dropdown.Toggle as={MenuItem} item={item} />

            <Dropdown.Menu className="mt-lg-3">
              {item.getChildren().map((subitem) => (
                <Dropdown.Item key={subitem.getName()} as={MenuLink} to={subitem}>
                  {subitem.getName()}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Nav.Item as="li" key={item.getName()}>
            <MenuItem item={item} />
          </Nav.Item>
        ),
      )}
    </Nav>
  );
}
