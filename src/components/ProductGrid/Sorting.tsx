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

import React, { useRef } from 'react';
import { Form } from 'react-bootstrap';

interface SortingProps {
  id: string;
  value?: string;
  onChange?: (value?: string) => void;
}

export function Sorting({ id, onChange, value = '' }: SortingProps): React.ReactElement {
  const selectRef = useRef<HTMLSelectElement>(null);
  const handleChange = (): void => {
    onChange?.(selectRef.current?.value || undefined);
  };

  return (
    <Form inline className="mb-4">
      <Form.Group controlId={id} className="d-flex align-items-center mb-0">
        <Form.Label className="text-muted mr-2 mb-0">Sort by</Form.Label>
        <Form.Control ref={selectRef} as="select" size="sm" value={value} onChange={handleChange} className="w-auto">
          <option value="">Default</option>
          <option value="purchasePrice">Price</option>
          <option value="displayName">Name</option>
        </Form.Control>
      </Form.Group>
    </Form>
  );
}
