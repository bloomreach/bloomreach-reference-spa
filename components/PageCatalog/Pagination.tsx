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
import { Pagination } from 'react-bootstrap';
import { Pagination as BrPagination } from '@bloomreach/spa-sdk';

import { Link } from '../Link';

interface PaginationProps extends React.ComponentPropsWithoutRef<typeof Pagination> {
  pagination: BrPagination;
}

const PaginationComponent = React.forwardRef(
  ({ pagination, className, ...props }: PaginationProps, ref: React.Ref<HTMLUListElement>) => {
    if (!pagination.isEnabled()) {
      return null;
    }

    return (
      <Pagination ref={ref} className={`justify-content-center ${className ?? ''}`} {...props}>
        <Pagination.Prev as={Link} href={pagination.getPrevious()?.getUrl()} disabled={!pagination.getPrevious()}>
          Previous
        </Pagination.Prev>
        {pagination.getPages().map((item) => (
          <Pagination.Item
            key={item.getNumber()}
            as={Link}
            href={item.getUrl()}
            active={pagination.getCurrent().getNumber() === item.getNumber()}
          >
            {item.getNumber()}
          </Pagination.Item>
        ))}
        <Pagination.Next as={Link} href={pagination.getNext()?.getUrl()} disabled={!pagination.getNext()}>
          Next
        </Pagination.Next>
      </Pagination>
    );
  },
);

export { PaginationComponent as Pagination };
