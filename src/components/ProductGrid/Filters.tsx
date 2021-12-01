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

import {
  FacetFieldFilterInput,
  FacetResultFragment_fields as FacetField,
} from '@bloomreach/connector-components-react';
import React, { useRef } from 'react';
import { Form } from 'react-bootstrap';

import { notEmpty } from '../../utils';

interface FiltersProps {
  filters: FacetField[];
  values: FacetFieldFilterInput[];
  onChange?: (values: FacetFieldFilterInput[]) => void;
}

export function Filters({ filters, values, onChange }: FiltersProps): React.ReactElement | null {
  const formRef = useRef<HTMLFormElement>(null);

  const facetSelected = (facetId: string, optionId: string): boolean => {
    return values.find((facet) => facet.id === facetId)?.values.includes(optionId) ?? false;
  };

  const handleChange = (): void => {
    const data = new FormData(formRef?.current ?? undefined);
    const newValues = [...data.keys()].map((facetId) => ({ id: facetId, values: data.getAll(facetId) as string[] }));

    onChange?.(newValues);
  };

  return (
    <Form ref={formRef} className="border rounded px-4 pt-1 pb-3 mb-4">
      {filters.map(({ id: facetId, name: filter, values: options }) => (
        <React.Fragment key={facetId}>
          <div className="h5 text-capitalize my-3">{filter}</div>
          {options.filter(notEmpty).map(({ id: optionId, count, name }) => (
            <Form.Group key={optionId} className="mb-1">
              <Form.Check
                name={facetId}
                value={optionId}
                id={`${facetId}-${optionId}`}
                label={`${name} (${count})`}
                checked={facetSelected(facetId, optionId)}
                onChange={handleChange}
              />
            </Form.Group>
          ))}
        </React.Fragment>
      ))}
    </Form>
  );
}
