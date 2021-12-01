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

const MAX_PAGES = 5;

interface PaginationProps extends React.ComponentPropsWithoutRef<typeof Pagination> {
  limit: number;
  offset: number;
  total: number;
  onChange?: (page: number) => void;
}

const PaginationComponent = React.forwardRef(
  ({ limit, offset, onChange, total, className, ...props }: PaginationProps, ref: React.Ref<HTMLUListElement>) => {
    if (limit === 0 || total <= limit || offset >= total) {
      return null;
    }

    const current = Math.floor(offset / limit) + 1;
    const pages = Math.ceil(total / limit);
    const minPage = Math.max(Math.min(current - Math.floor(MAX_PAGES / 2), pages - MAX_PAGES + 1), 1);
    const maxPage = Math.min(minPage + MAX_PAGES - 1, pages);

    return (
      <Pagination ref={ref} className={`justify-content-center mb-4 ${className ?? ''}`} {...props}>
        <Pagination.Prev disabled={current === 1} onClick={() => onChange?.(current - 1)}>
          Previous
        </Pagination.Prev>
        {[...Array(maxPage - minPage + 1).keys()]
          .map((number) => minPage + number)
          .map((number) => (
            <Pagination.Item key={number} active={current === number} onClick={() => onChange?.(number)}>
              {number}
            </Pagination.Item>
          ))}
        <Pagination.Next disabled={current === pages} onClick={() => onChange?.(current + 1)}>
          Next
        </Pagination.Next>
      </Pagination>
    );
  },
);

export { PaginationComponent as Pagination };
