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

import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Button, Col, Collapse, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { BrComponentContext, BrPageContext } from '@bloomreach/react-sdk';

import { useSearch } from '../../hooks';
import { Filters } from './Filters';
import { FiltersPlaceholder } from './FiltersPlaceholder';
import { Pagination } from './Pagination';
import { Products } from './Products';
import { ProductsPlaceholder } from './ProductsPlaceholder';
import { Sorting } from './Sorting';
import { Stats } from './Stats';
import { StatsPlaceholder } from './StatsPlaceholder';

import styles from './ProductGrid.module.scss';

interface ProductGridProps {
  filters?: string[];
  limit: number;
  pagination?: boolean;
  params: Omit<
    Parameters<typeof useSearch>[1],
    'account_id' | 'domain_key' | 'fl' | 'fq' | 'rows' | 'sort' | 'start' | 'url'
  >;
  sorting?: boolean;
  stats?: boolean;
  title?: string;
}

export function ProductGrid({
  filters: allowedFilters = [],
  limit,
  pagination: isPagination,
  params: defaults,
  sorting: isSorting,
  stats: isStats,
  title,
}: ProductGridProps): React.ReactElement {
  const id = useContext(BrComponentContext)?.getId() ?? '';
  const { smAccountId = '', smDomainKey, smEndpoint = '' } =
    useContext(BrPageContext)?.getChannelParameters<ChannelParameters>() ?? {};

  const history = useHistory();

  const { page, sorting, filters } = useMemo(() => {
    const search = new URLSearchParams(history.location.search);

    return {
      page: Number(search.get(`${id}:page`) ?? 1),
      sorting: search.get(`${id}:sort`) ?? undefined,
      filters: Object.fromEntries(
        allowedFilters
          .map((filter) => [filter, search.getAll(`${id}:filter:${filter}`)])
          .filter(([, values]) => values.length),
      ) as React.ComponentProps<typeof Filters>['values'],
    };
  }, [history.location.search, id, allowedFilters]);

  const params = useMemo(
    () => ({
      ...defaults,
      account_id: smAccountId,
      domain_key: smDomainKey,
      fl: ['brand', 'pid', 'price', 'sale_price', 'title', 'thumb_image', 'url'],
      fq: Object.entries(filters).map(
        ([filter, values]) => `${filter}:${values.map((value) => `"${value}"`).join(' OR ')}`,
      ),
      rows: limit,
      sort: sorting,
      start: limit * (page - 1),
      url: window.location.href,
    }),
    [defaults, filters, limit, page, smAccountId, smDomainKey, sorting],
  );

  const [pageState, setPage] = useState(page);
  const [sortingState, setSorting] = useState(sorting);
  const [filtersState, setFilters] = useState(filters);
  const [filteringVisibility, toggleFiltering] = useState(false);

  const [results, loading] = useSearch<ProductDocument>(smEndpoint, params);
  const availableFilters = useMemo(
    () =>
      Object.fromEntries(
        allowedFilters
          .map((facet) => [facet, results?.facet_counts.facet_fields[facet]])
          .filter(([, values]) => values?.length),
      ),
    [allowedFilters, results],
  );
  const isFiltering = allowedFilters.length > 0 && (!results || Object.keys(availableFilters).length > 0);

  useEffect(() => setPage(page), [page]);
  useEffect(() => setSorting(sorting), [sorting]);
  useEffect(() => setFilters(filters), [filters]);
  useEffect(() => {
    const search = new URLSearchParams(history.location.search);
    const current = search.toString();

    if (sortingState) {
      search.set(`${id}:sort`, sortingState);
    } else {
      search.delete(`${id}:sort`);
    }

    if (pageState > 1) {
      search.set(`${id}:page`, `${pageState}`);
    } else {
      search.delete(`${id}:page`);
    }

    allowedFilters.forEach((filter) => search.delete(`${id}:filter:${filter}`));

    Object.entries(filtersState).forEach(([filter, values]) =>
      values.forEach((value) => search.append(`${id}:filter:${filter}`, value)),
    );

    if (current !== search.toString()) {
      history.push({ search: `?${search.toString()}` });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedFilters, filtersState, id, pageState, sortingState]);

  return (
    <div className={`${styles.grid}`}>
      <div className={styles.grid__header}>
        {title && <h4 className="mb-4">{title}</h4>}
        <Row className="align-items-center">
          <Col sm="auto" className="flex-fill">
            {isStats &&
              (results ? (
                <Stats
                  offset={results.response.start}
                  size={results.response.docs.length}
                  total={results.response.numFound}
                />
              ) : (
                <StatsPlaceholder />
              ))}
          </Col>
          <Col sm="auto">
            <Row className="align-items-center">
              <Col xs="auto" className="flex-fill">
                {isSorting && <Sorting id={`${id}-sorting`} value={sorting} onChange={setSorting} />}
              </Col>
              {isFiltering && (
                <Col xs="auto" className="d-lg-none">
                  <Button
                    variant="primary"
                    size="sm"
                    className="mb-4"
                    onClick={() => toggleFiltering(!filteringVisibility)}
                  >
                    Filters
                  </Button>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </div>
      {isFiltering && (
        <Collapse in={filteringVisibility}>
          <div className={`${styles.grid__facets} d-lg-block`}>
            {results ? (
              <Filters
                filters={availableFilters}
                values={filters}
                onChange={(newFilters) => {
                  setPage(1);
                  setFilters(newFilters);
                }}
              />
            ) : (
              <FiltersPlaceholder size={allowedFilters.length} />
            )}
          </div>
        </Collapse>
      )}
      <div className={styles.grid__products}>
        {!loading && results ? <Products products={results.response.docs} /> : <ProductsPlaceholder size={limit} />}
        {isPagination && results && (
          <Pagination
            limit={limit}
            offset={results.response.start}
            total={results.response.numFound}
            onChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
