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
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import styles from './Search.module.scss';

export function Search({ className, ...props }: React.ComponentProps<typeof Form>): React.ReactElement {
  return (
    <Form inline className={`${styles.search} ${className ?? ''}`} {...props}>
      <Form.Control type="search" placeholder="Find products and articles" className={styles.search__input} />
      <Button type="submit" variant="link" className={`${styles.search__button}`} title="Search">
        <FontAwesomeIcon icon={faSearch} />
      </Button>
    </Form>
  );
}
