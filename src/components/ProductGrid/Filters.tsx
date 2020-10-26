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

import React, { useRef } from 'react';
import { Form } from 'react-bootstrap';

interface Option {
  count: number;
  name: string;
}

type Filters = Record<string, Option[]>;
type Values = Record<string, string[]>;

interface FiltersProps {
  filters: Filters;
  values: Values;
  onChange?: (values: Values) => void;
}

export function Filters({ filters, values, onChange }: FiltersProps): React.ReactElement | null {
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (): void => {
    const data = new FormData(formRef?.current ?? undefined);
    const newValues = [...data.keys()].reduce(
      (result, filter) => Object.assign(result, { [filter]: data.getAll(filter) }),
      {} as Values,
    );

    onChange?.(newValues);
  };

  return (
    <Form ref={formRef} className="border rounded px-4 pt-1 pb-3 mb-4">
      {Object.entries(filters).map(([filter, options]) => (
        <React.Fragment key={filter}>
          <div className="h5 text-capitalize my-3">{filter}</div>
          {options.map(({ count, name }) => (
            <Form.Group key={name} className="mb-1">
              <Form.Check
                name={filter}
                value={name}
                id={`${filter}-${name}`}
                label={`${name} (${count})`}
                checked={values[filter]?.includes(name)}
                onChange={handleChange}
              />
            </Form.Group>
          ))}
        </React.Fragment>
      ))}
    </Form>
  );
}
