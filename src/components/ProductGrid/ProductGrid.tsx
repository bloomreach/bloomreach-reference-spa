/*
 * Copyright 2020-2021 Bloomreach
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

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Alert, Col, Collapse, Row, Button } from 'react-bootstrap';
import { BrComponentContext, BrProps } from '@bloomreach/react-sdk';
import { ContainerItem, getContainerItemContent } from '@bloomreach/spa-sdk';
import {
  CategoryInputProps,
  FacetFieldFilterInput,
  useCategory,
  useProductGridCategory,
  useProductGridSearch,
} from '@bloomreach/connector-components-react';
import { CommerceContext } from '../../CommerceContext';
import { notEmpty } from '../../utils';
import { Stats } from './Stats';
import { StatsPlaceholder } from './StatsPlaceholder';
import { Filters } from './Filters';
import { FiltersPlaceholder } from './FiltersPlaceholder';
import { Sorting } from './Sorting';
import { Products } from './Products';
import { ProductsPlaceholder } from './ProductsPlaceholder';
import { Pagination } from './Pagination';

import styles from './ProductGrid.module.scss';

interface ProductGridParameters {
  filters?: string;
  limit: number;
  pagination: boolean;
  sorting: boolean;
  total: boolean;
  facets: boolean;
  view?: string;
}

interface ProductGridCompound {
  title?: string;
  searchtype: SelectionType;
  query?: string;
  category?: { categoryid: string };
}

interface ProductGridProps {
  title?: string;
  searchType: string;
  query?: string;
  categoryId?: string;
  component: ContainerItem;
}

type SearchHookType = typeof useProductGridSearch | typeof useProductGridCategory;
type ProductGridParamsType = Parameters<SearchHookType>[0];

export function ProductGrid({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  const { title, searchtype, query, category } = getContainerItemContent<ProductGridCompound>(component, page) ?? {};

  const searchType = searchtype?.selectionValues[0].key;

  if (component.isHidden() || !searchType) {
    return page.isPreview() ? <div /> : null;
  }

  return (
    <ProductGridProcessor
      component={component}
      searchType={searchType}
      categoryId={category?.categoryid}
      query={query}
      title={title}
    />
  );
}

function ProductGridProcessor({
  title,
  searchType,
  query: queryParameter,
  categoryId: categoryIdParameter,
  component,
}: ProductGridProps): React.ReactElement | null {
  const {
    filters: filtersParameter = '',
    limit,
    pagination: isPagination,
    sorting: isSorting,
    total: isStats,
    facets: isFacets,
    view,
  } = component.getParameters<ProductGridParameters>();

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

  const allowedFilters = useMemo(
    () =>
      filtersParameter
        .split(';')
        .map((filter) => filter.trim())
        .filter(Boolean),
    [filtersParameter],
  );

  const query = useMemo(() => {
    const search = new URLSearchParams(history.location.search);

    return search.get('q') ?? queryParameter;
  }, [history.location.search, queryParameter]);

  const categoryId = useMemo(() => {
    if (categoryIdParameter) {
      return categoryIdParameter;
    }

    const matches = history.location.pathname.match(/\/categories\/([^/].*)/);
    if (matches && matches.length > 1) {
      return matches[1];
    }

    return undefined;
  }, [categoryIdParameter, history.location.pathname]);

  const { page, sortFields, filters } = useMemo(() => {
    const search = new URLSearchParams(history.location.search);

    return {
      page: Number(search.get(`${id}:page`) ?? 1),
      sortFields: search.get(`${id}:sort`) ?? undefined,
      filters:
        allowedFilters
          ?.map((filter) => ({ id: filter, values: search.getAll(`${id}:filter:${filter}`) }))
          .filter(({ values }) => values.length) ?? [],
    };
  }, [history.location.search, id, allowedFilters]);

  const params: ProductGridParamsType = useMemo(() => {
    const defaults: ProductGridParamsType = {
      smAccountId,
      smAuthKey,
      smDomainKey,
      sortFields,
      customAttrFields: smCustomAttrFields,
      customVariantAttrFields: smCustomVarAttrFields,
      customVariantListPriceField: smCustomVarListPriceField,
      customVariantPurchasePriceField: smCustomVarPurchasePriceField,
      facetFieldFilters: filters,
      pageSize: limit,
      connector: smConnector,
      offset: limit * (page - 1),
      brUid2: cookies._br_uid_2,
      smViewId: view || smViewId,
    };
    if (searchType === 'category') {
      return {
        ...defaults,
        categoryId: categoryId || ' ', // workaround for "All categories"
      };
    }

    return {
      ...defaults,
      searchText: query,
    };
  }, [
    smAccountId,
    smAuthKey,
    smDomainKey,
    sortFields,
    smCustomAttrFields,
    smCustomVarAttrFields,
    smCustomVarListPriceField,
    smCustomVarPurchasePriceField,
    filters,
    limit,
    smConnector,
    page,
    cookies._br_uid_2,
    view,
    smViewId,
    searchType,
    query,
    categoryId,
  ]);

  const [pageState, setPageState] = useState(page);
  const [sortingState, setSorting] = useState(sortFields);
  const [filtersState, setFilters] = useState<FacetFieldFilterInput[]>(filters);
  const [filteringVisibility, toggleFiltering] = useState(false);
  const [action, setAction] = useState<string>();
  const [error, setError] = useState<Error>();

  const useSearch: SearchHookType = searchType === 'category' ? useProductGridCategory : useProductGridSearch;

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

  const isFiltering = isFacets && !!allowedFilters?.length && (!results?.items || !!availableFilters?.length);

  useEffect(() => setPageState(page), [page]);
  useEffect(() => setSorting(sortFields), [sortFields]);
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

  const effectiveTitle = useMemo(() => {
    if (searchType === 'category' && categoryId) {
      return <CategoryName categoryId={categoryId} title={title} />;
    }
    if (searchType === 'search') {
      const autoCorrectQuery = results?.queryHint?.autoCorrectQuery;
      const effectiveQuery = autoCorrectQuery && autoCorrectQuery !== query ? autoCorrectQuery : query;
      return (
        <>
          {title && <h4 className="mb-4">{title}</h4>}
          <h4 className="mb-4">
            {effectiveQuery && effectiveQuery !== query && (
              <div>
                <span className="font-weight-normal">
                  Did you mean <span className="font-weight-bold">{effectiveQuery}</span>?
                </span>{' '}
              </div>
            )}
            <div>
              <span className="font-weight-normal">Search results for</span>{' '}
              <span className="font-weight-bold text-capitalize">{effectiveQuery}</span>
            </div>
          </h4>
        </>
      );
    }
    return null;
  }, [categoryId, query, results?.queryHint?.autoCorrectQuery, searchType, title]);

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
        {effectiveTitle}
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
                    value={sortFields}
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

function CategoryName({ categoryId, title }: { categoryId: string; title?: string }): React.ReactElement | null {
  const {
    smAccountId,
    smAuthKey,
    smConnector,
    smCustomAttrFields,
    smCustomVarAttrFields,
    smCustomVarListPriceField,
    smCustomVarPurchasePriceField,
    smDomainKey,
    smViewId,
  } = useContext(CommerceContext);
  const [cookies] = useCookies(['_br_uid_2']);
  const params: CategoryInputProps = useMemo(
    () => ({
      categoryId,
      brUid2: cookies._br_uid_2,
      connector: smConnector,
      customAttrFields: smCustomAttrFields,
      customVariantAttrFields: smCustomVarAttrFields,
      customVariantListPriceField: smCustomVarListPriceField,
      customVariantPurchasePriceField: smCustomVarPurchasePriceField,
      smAccountId,
      smAuthKey,
      smDomainKey,
      smViewId,
    }),
    [
      categoryId,
      cookies._br_uid_2,
      smCustomAttrFields,
      smAccountId,
      smAuthKey,
      smConnector,
      smCustomVarAttrFields,
      smCustomVarListPriceField,
      smCustomVarPurchasePriceField,
      smDomainKey,
      smViewId,
    ],
  );
  const [category] = useCategory(params);
  if (!category) {
    return null;
  }
  return (
    <>
      {title && <h4 className="mb-4">{title}</h4>}
      <h4 className="mb-4">Category &quot;{category.displayName}&quot;</h4>
    </>
  );
}
