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

import React from 'react';

interface FiltersPlaceholderProps {
  size: number;
}

export function FiltersPlaceholder({ size }: FiltersPlaceholderProps): React.ReactElement | null {
  return (
    <div className="border rounded px-4 pt-1 pb-3 mb-4">
      {[...Array(size).keys()].map((index) => (
        <React.Fragment key={index}>
          <div className="shimmer pt-4 my-4 w-100" />
          <div className="shimmer pt-3 pb-1 mb-2 w-75" />
          <div className="shimmer pt-3 pb-1 mb-2 w-50" />
          <div className="shimmer pt-3 pb-1 mb-2 w-75" />
        </React.Fragment>
      ))}
    </div>
  );
}
