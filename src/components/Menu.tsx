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
import { Dropdown, Nav } from 'react-bootstrap';
import { MenuItem as BrMenuItem, Menu as BrMenu, TYPE_LINK_EXTERNAL, isMenu } from '@bloomreach/spa-sdk';
import { BrComponentContext, BrManageMenuButton, BrPageContext } from '@bloomreach/react-sdk';

/* eslint-disable react/jsx-props-no-spreading */

interface MenuLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  item: BrMenuItem;
}

const MenuLink = React.forwardRef(({ item, ...props }: MenuLinkProps, ref: React.Ref<HTMLAnchorElement>) => {
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

interface MenuItemProps extends React.ComponentProps<typeof Nav.Link> {
  item: BrMenuItem;
}

const MenuItem = React.forwardRef(({ item, ...props }: MenuItemProps, ref) => (
  <Nav.Link ref={ref} as={MenuLink} active={item.isSelected()} item={item} {...props} />
));

export function Menu(): React.ReactElement | null {
  const component = React.useContext(BrComponentContext);
  const page = React.useContext(BrPageContext);
  const menuRef = component?.getModels<MenuModels>()?.menu;
  const menu = menuRef && page?.getContent<BrMenu>(menuRef);

  if (!isMenu(menu)) {
    return null;
  }

  /* eslint-disable react/no-array-index-key */
  return (
    <Nav as="ul" navbar className={page!.isPreview() ? 'has-edit-button' : ''}>
      <BrManageMenuButton menu={menu} />
      {menu.getItems().map((item, index) =>
        item.getChildren().length ? (
          <Dropdown as="li" key={index}>
            <Dropdown.Toggle as={MenuItem} item={item} />

            <Dropdown.Menu className="mt-lg-3">
              {item.getChildren().map((subitem, subindex) => (
                <Dropdown.Item key={subindex} as={MenuLink} item={subitem} />
              ))}
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Nav.Item as="li" key={index}>
            <MenuItem item={item} />
          </Nav.Item>
        ),
      )}
    </Nav>
  );
}
