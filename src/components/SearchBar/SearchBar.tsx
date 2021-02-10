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

import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ContainerItem, Document, Reference } from '@bloomreach/spa-sdk';
import { BrProps } from '@bloomreach/react-sdk';

import styles from './SearchBar.module.scss';

interface SearchBarModels {
  document?: Reference;
}

export function SearchBar({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  const ref = useRef<HTMLFormElement>(null);
  const history = useHistory();

  if (component.isHidden()) {
    return page.isPreview() ? <div /> : null;
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    const { document: documentRef } = component.getModels<SearchBarModels>();
    const document = documentRef && page.getContent<Document>(documentRef);
    const url = document?.getUrl() ?? '';

    if (!url) {
      return;
    }

    const data = new FormData(ref?.current ?? undefined);
    const params = new URLSearchParams([...data.entries()] as [string, string][]);

    history.push(`${url}${url.includes('?') ? '&' : '?'}${params.toString()}`);
  };

  return (
    <Form ref={ref} onSubmit={handleSubmit} inline className={styles.search}>
      <Form.Control
        type="search"
        name="q"
        placeholder="Find products and articles"
        className={`${styles.search__input} w-100`}
      />
      <Button type="submit" variant="link" className={`${styles.search__button}`} title="Search">
        <FontAwesomeIcon icon={faSearch} />
      </Button>
    </Form>
  );
}
