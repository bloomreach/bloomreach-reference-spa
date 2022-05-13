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

import { notEmpty } from '../../src/utils';

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
    const selectedFacets = new Map<string, Array<string>>();
    [...data.entries()].forEach(([facetId, optionId]) => {
      if (!selectedFacets.has(facetId)) {
        selectedFacets.set(facetId, []);
      }
      selectedFacets.get(facetId)!.push(optionId.toString());
    });
    const newValues = [...selectedFacets.keys()].map((id) => ({ id, values: selectedFacets.get(id) ?? [] }));

    onChange?.(newValues);
  };

  return (
    <Form ref={formRef} className="border rounded px-4 pt-1 pb-3 mb-4">
      {filters.map(({ id: facetId, name: filter, values: options }) => (
        <Form.Group key={facetId} className="mb-1">
          <div className="h5 text-capitalize my-3">{filter}</div>
          {options.filter(notEmpty).map(({ id: optionId, count, name }) => (
            <Form.Check
              key={`${facetId}-${optionId}`}
              name={facetId}
              value={optionId}
              id={`${facetId}-${optionId}`}
              label={`${name} (${count})`}
              checked={facetSelected(facetId, optionId)}
              onChange={handleChange}
            />
          ))}
        </Form.Group>
      ))}
    </Form>
  );
}
