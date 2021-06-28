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
import { Alert, Button, Col, Collapse, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { BrComponentContext } from '@bloomreach/react-sdk';
import {
  useProductGridSearch,
  FacetFieldFilterInput,
  useProductGridCategory,
  CommonProductInputProps,
} from '@bloomreach/connector-components-react';

import { Filters } from './Filters';
import { FiltersPlaceholder } from './FiltersPlaceholder';
import { Pagination } from './Pagination';
import { Products } from './Products';
import { ProductsPlaceholder } from './ProductsPlaceholder';
import { Sorting } from './Sorting';
import { Stats } from './Stats';
import { StatsPlaceholder } from './StatsPlaceholder';

import styles from './ProductGrid.module.scss';
import { CommerceContext } from '../../CommerceContext';
import { notEmpty } from '../../utils';

type SearchHookType = typeof useProductGridSearch | typeof useProductGridCategory;
type ProductGridParamsType = Parameters<SearchHookType>[0];

interface ProductGridProps {
  filters?: string[];
  limit: number;
  pagination?: boolean;
  params: Omit<
    ProductGridParamsType,
    keyof CommonProductInputProps | 'facetFieldFilters' | 'pageSize' | 'sortFields' | 'connector' | 'brUid2' | 'offset'
  >;
  sorting?: boolean;
  stats?: boolean;
  title?: string | React.ReactElement;
  useSearch: SearchHookType;
}

export function ProductGrid({
  filters: allowedFilters,
  limit,
  pagination: isPagination,
  params: defaults,
  sorting: isSorting,
  stats: isStats,
  title,
  useSearch,
}: ProductGridProps): React.ReactElement {
  const id = useContext(BrComponentContext)?.getId() ?? '';
  const {
    smDomainKey,
    smConnector,
    smViewId,
    smAccountId,
    smAuthKey,
    smCustomAttrFields,
    smCustomVarAttrFields,
    smCustomVarListPriceField,
    smCustomVarPurchasePriceField,
  } = useContext(CommerceContext);
  const [cookies] = useCookies(['_br_uid_2']);

  const history = useHistory();

  const { page, sorting, filters } = useMemo(() => {
    const search = new URLSearchParams(history.location.search);

    return {
      page: Number(search.get(`${id}:page`) ?? 1),
      sorting: search.get(`${id}:sort`) ?? undefined,
      filters:
        allowedFilters
          ?.map((filter) => ({ id: filter, values: search.getAll(`${id}:filter:${filter}`) }))
          .filter(({ values }) => values.length) ?? [],
    };
  }, [history.location.search, id, allowedFilters]);

  const params: ProductGridParamsType = useMemo(
    () => ({
      ...defaults,
      smViewId,
      smAccountId,
      smAuthKey,
      smDomainKey,
      customAttrFields: smCustomAttrFields,
      customVariantAttrFields: smCustomVarAttrFields,
      customVariantListPriceField: smCustomVarListPriceField,
      customVariantPurchasePriceField: smCustomVarPurchasePriceField,
      facetFieldFilters: filters,
      pageSize: limit,
      sortFields: sorting,
      connector: smConnector,
      offset: limit * (page - 1),
      brUid2: cookies._br_uid_2,
    }),
    [
      cookies._br_uid_2,
      defaults,
      filters,
      limit,
      page,
      smAccountId,
      smAuthKey,
      smConnector,
      smCustomAttrFields,
      smCustomVarAttrFields,
      smCustomVarListPriceField,
      smCustomVarPurchasePriceField,
      smDomainKey,
      smViewId,
      sorting,
    ],
  );

  const [pageState, setPageState] = useState(page);
  const [sortingState, setSorting] = useState(sorting);
  const [filtersState, setFilters] = useState<FacetFieldFilterInput[]>(filters);
  const [filteringVisibility, toggleFiltering] = useState(false);
  const [action, setAction] = useState<string>();
  const [error, setError] = useState<Error>();

  const [onLoadMore, results, loading, searchError] = useSearch(params as any);
  useEffect(() => {
    setError(searchError);
  }, [searchError]);

  const availableFilters = useMemo(() => {
    const facets = results?.facetResult?.fields.filter(notEmpty);
    if (!facets?.length || !allowedFilters?.length) {
      return [];
    }
    const allowedFiltersCopy = [...allowedFilters];
    const caseSensitiveResult: typeof facets = [];

    return facets
      .filter((facet) => {
        const index = allowedFiltersCopy.indexOf(facet.id);
        if (index >= 0) {
          caseSensitiveResult.push(facet);
          allowedFiltersCopy.splice(index, 1);
          return false;
        }
        return true;
      })
      .filter((facet) => !!allowedFiltersCopy.find((af) => af.toLowerCase() === facet.id.toLowerCase()))
      .concat(caseSensitiveResult);
  }, [allowedFilters, results]);

  const isFiltering = !!allowedFilters?.length && (!results?.items || !!availableFilters?.length);

  useEffect(() => setPageState(page), [page]);
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

    allowedFilters?.forEach((filter) => search.delete(`${id}:filter:${filter}`));

    filtersState.forEach(({ id: facetId, values }) =>
      values.filter(notEmpty).forEach((value) => search.append(`${id}:filter:${facetId}`, value)),
    );

    if (current !== search.toString()) {
      const searchStr = search.toString() ? `?${search.toString()}` : '';
      history.push({ search: searchStr });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedFilters, filtersState, id, pageState, sortingState]);

  const filtersError = useMemo(() => {
    if (error && action === 'filters') {
      return true;
    }
    return false;
  }, [action, error]);

  const setPage = async (pageNum: number): Promise<void> => {
    const offset = (pageNum - 1) * limit;
    try {
      await onLoadMore(offset);
      setPageState(pageNum);
    } catch (err) {
      setError(err);
    }
  };

  // if (error) {
  //   console.log('[ProductGrid Error]: ', error);
  // }

  return (
    <div className={`${styles.grid} mw-container mx-auto`}>
      <div className={styles.grid__header}>
        {title && <h4 className="mb-4">{title}</h4>}
        <Row className="align-items-center">
          <Col sm="auto" className="flex-fill">
            {isStats &&
              (results?.items ? (
                <Stats offset={results.offset} size={results.count} total={results.total} />
              ) : (
                <StatsPlaceholder />
              ))}
          </Col>
          <Col sm="auto">
            <Row className="align-items-center">
              <Col xs="auto" className="flex-fill">
                {isSorting && (
                  <Sorting
                    id={`${id}-sorting`}
                    value={sorting}
                    onChange={(value) => {
                      setSorting(value);
                      setAction('sort');
                    }}
                  />
                )}
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
            {filtersError && (
              <Alert variant="danger" className="mt-3 mb-3">
                The filters are not working properly. Try again later.
              </Alert>
            )}
            {results?.items ? (
              <Filters
                filters={availableFilters!}
                values={filters}
                onChange={(newFilters) => {
                  setPage(1);
                  setFilters(newFilters);
                  setAction('filters');
                }}
              />
            ) : (
              <FiltersPlaceholder size={allowedFilters?.length ?? 0} />
            )}
          </div>
        </Collapse>
      )}
      <div className={styles.grid__products}>
        {error && !filtersError && (
          <Alert variant="danger" className="mt-3 mb-3">
            This widget is not working properly. Try again later.
          </Alert>
        )}
        {!loading && results?.items ? (
          <Products products={results.items.filter(notEmpty)} />
        ) : (
          <ProductsPlaceholder size={limit} />
        )}
        {isPagination && results && (
          <Pagination
            limit={limit}
            offset={results.offset}
            total={results.total}
            onChange={(pageNum: number) => {
              setPage(pageNum);
              setAction('page');
            }}
          />
        )}
      </div>
    </div>
  );
}
