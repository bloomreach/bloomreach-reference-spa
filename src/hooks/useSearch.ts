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

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

/* eslint-disable camelcase */

interface SearchParams {
  account_id: string;
  domain_key?: string;
  fl: string[];
  fq?: string | string[];
  q?: string;
  request_type: 'search' | string;
  rows: number;
  search_type: 'keyword' | 'category' | string;
  sort?: string;
  start?: number;
  url: string;
  view_id?: string;
  widget_id?: string;
}

interface SearchFacetCount {
  count: number;
  name: string;
}

interface SearchFacetCounts {
  facet_fields: Record<string, SearchFacetCount[]>;
}

interface SearchResult {
  pid: string;
}

interface SearchResponse<T extends SearchResult> {
  docs: T[];
  numFound: number;
  start: number;
}

interface SearchResults<T extends SearchResult> {
  category_map: Record<string, string>;
  facet_counts: SearchFacetCounts;
  response: SearchResponse<T>;
}

export function useSearch<T extends SearchResult = SearchResult>(
  endpoint: string,
  params: SearchParams,
): [SearchResults<T> | undefined, boolean, Error | undefined] {
  const [error, setError] = useState<Error | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SearchResults<T> | undefined>(undefined);

  const query = useMemo(() => {
    const { fl, fq, ...rest } = params;

    return new URLSearchParams(
      [
        ...Object.entries(rest),
        ['fl', fl.join(',')],
        ...(Array.isArray(fq) ? fq : [fq]).map((value) => ['fq', value]),
      ].filter((value): value is [string, string] => !!value[1]),
    ).toString();
  }, [params]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${endpoint}?${query}`);
        setResults(response.data);
      } catch (e) {
        setResults(undefined);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [endpoint, query]);

  return [results, loading, error];
}
