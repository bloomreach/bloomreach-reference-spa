/*
 * Copyright 2020-2021 Hippo B.V. (http://www.onehippo.com)
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

import React, { useRef, useState, Dispatch, SetStateAction, FocusEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ContainerItem, Document, Reference } from '@bloomreach/spa-sdk';
import { ProductSearchSuggestionInputProps, useProductSearchSuggestion } from '@bloomreach/connector-components-react';
import { BrPageContext, BrProps } from '@bloomreach/react-sdk';
import { CommerceContextConsumer } from '../../CommerceContext';
import { Link } from '../Link';

import styles from './SearchBar.module.scss';

interface SearchBarModels {
  document?: Reference;
}

interface SearchBarCatalogParameters {
  suggestionsEnabled?: boolean;
  suggestionsLimit: number;
}

export function SearchBar({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  const ref = useRef<HTMLFormElement>(null);
  const history = useHistory();
  const { suggestionsEnabled, suggestionsLimit } = component.getParameters<SearchBarCatalogParameters>();
  const [keyword, setKeyword] = useState<string>('');
  const [hideSuggestions, setHideSuggestions] = useState<boolean>(true);

  if (component.isHidden()) {
    return page.isPreview() ? <div /> : null;
  }

  const handleInputChange = (value: string): void => {
    setKeyword(value);
    if (value?.length > 0) {
      setHideSuggestions(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent, term?: string): void => {
    e?.preventDefault();
    setHideSuggestions(true);

    const { document: documentRef } = component.getModels<SearchBarModels>();
    const document = documentRef && page.getContent<Document>(documentRef);
    const url = document?.getUrl() ?? '';

    if (!url) {
      return;
    }

    let params;
    if (!term) {
      const data = new FormData(ref?.current ?? undefined);
      params = new URLSearchParams([...data.entries()] as [string, string][]);
    } else {
      params = new URLSearchParams({ q: term });
    }

    history.push(`${url}${url.includes('?') ? '&' : '?'}${params.toString()}`);
  };

  const handleBlur = (e: FocusEvent): void => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setHideSuggestions(true);
    }
  };

  return (
    <Form ref={ref} onSubmit={handleSubmit} inline className={styles.search} autoComplete="off" onBlur={handleBlur}>
      <Form.Control
        type="search"
        name="q"
        placeholder="Find products and articles"
        className={`${styles.search__input} w-100`}
        onChange={(event) => handleInputChange(event.target.value)}
        value={keyword}
      />
      {suggestionsEnabled && (
        <CommerceContextConsumer>
          {({ smConnector }) => (
            <ProductSuggestion
              connector={smConnector}
              text={keyword}
              setKeyword={setKeyword}
              handleSubmit={handleSubmit}
              hideSuggestions={hideSuggestions}
              suggestionsLimit={suggestionsLimit ?? 5}
            />
          )}
        </CommerceContextConsumer>
      )}
      {!keyword && (
        <Button type="submit" variant="link" className={`${styles.search__button}`} title="Search">
          <FontAwesomeIcon icon={faSearch} />
        </Button>
      )}
      {keyword && (
        <Button
          type="reset"
          variant="link"
          className={`${styles.search__button}`}
          title="Reset"
          onClick={() => handleInputChange('')}
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      )}
    </Form>
  );
}

interface SuggestionsProps extends ProductSearchSuggestionInputProps {
  setKeyword: Dispatch<SetStateAction<string>>;
  handleSubmit: (event?: React.FormEvent, term?: string) => void;
  hideSuggestions: boolean;
  suggestionsLimit: number;
}

function ProductSuggestion({
  text,
  connector,
  setKeyword,
  handleSubmit,
  hideSuggestions,
  suggestionsLimit,
}: SuggestionsProps): React.ReactElement | null {
  const [result] = useProductSearchSuggestion({ text, connector });
  const { terms, items } = result ?? {};
  const visibility = hideSuggestions ? 'invisible' : 'visible';
  const page = React.useContext(BrPageContext);

  const handleClick = (term: string | null): void => {
    setKeyword(term ?? '');
    handleSubmit(undefined, term ?? '');
  };

  if (!terms?.length && !items?.length) {
    return <div />;
  }

  return (
    <div className={`${styles.autocompleteItems} ${visibility} border overflow-auto`}>
      {terms?.length && <h6 className="border-top-right-radius border-top-left-radius">Suggested keywords</h6>}
      {terms?.slice(0, Math.min(suggestionsLimit, terms.length)).map((term) => (
        <button type="button" key={term} onClick={() => handleClick(term)} onKeyDown={() => handleClick(term)}>
          {term}
        </button>
      ))}
      {items && items.length > 1 && (
        <>
          <hr />
          <h6>Recommended products</h6>
        </>
      )}
      {items?.slice(0, Math.min(suggestionsLimit, items.length)).map((item) => (
        <Link
          href={page?.getUrl(`/products/${item?.itemId.code ?? item?.itemId.id}`)}
          key={item?.itemId.id}
          onClick={() => setKeyword('')}
        >
          <div>
            <img
              src={item?.imageSet?.thumbnail?.link?.href ?? ''}
              alt={item?.displayName ?? item?.itemId.id}
              className="text-truncate"
            />
            <h5>
              {item?.displayName}
              <span className="text-truncate"> ({item?.itemId.code ?? item?.itemId.id})</span>
              <div className="pl-0">
                {item?.listPrice?.moneyAmounts
                  ?.filter((entry) => entry?.amount && entry.amount > 0)
                  .map((entry) => (
                    <del className="text-muted mr-2">
                      {entry?.currency ?? '$'} {entry?.amount}
                    </del>
                  ))}
                {item?.purchasePrice?.moneyAmounts?.map((entry) => (
                  <span key={item.itemId.id} className="text-danger">
                    {entry?.currency ?? '$'} {entry?.amount}
                  </span>
                ))}
              </div>
            </h5>
          </div>
        </Link>
      ))}
    </div>
  );
}
