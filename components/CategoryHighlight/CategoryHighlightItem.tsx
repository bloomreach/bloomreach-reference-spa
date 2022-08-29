/*
 * Copyright 2021 Bloomreach
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

import React, { useContext, ComponentPropsWithoutRef } from 'react';
import { Button } from 'react-bootstrap';
import { BrPageContext } from '@bloomreach/react-sdk';
import { CategoryFragment } from '@bloomreach/connector-components-react';
import { Link } from '../Link';

interface CategoryHighlightItemProps extends ComponentPropsWithoutRef<'a'> {
  category: CategoryFragment | null;
}

export function CategoryHighlightItem({ category }: CategoryHighlightItemProps): JSX.Element {
  const page = useContext(BrPageContext);

  if (!category) {
    return <div />;
  }

  return (
    <div className="col-6 col-sm-3 mb-4">
      <Button
        type="link"
        as={Link}
        href={page?.getUrl(`/categories/${category.id}`)}
        variant="primary"
        className="w-100 h-100"
      >
        <table className="w-100 h-100">
          <tbody>
            <tr>
              <td className="align-middle">{category.displayName}</td>
            </tr>
          </tbody>
        </table>
      </Button>
    </div>
  );
}
