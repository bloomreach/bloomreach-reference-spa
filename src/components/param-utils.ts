/*
 * Copyright 2021 Bloomreach
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

import { Document, Page } from '@bloomreach/spa-sdk';

export interface DocumentParameter {
  document: Document;
  parameterName: string;
}

export function getEffectiveMultipleDocumentParameters(
  page: Page,
  models: Record<string, any>,
  maxCount: number,
): DocumentParameter[] {
  return [...Array(maxCount).keys()]
    .map((n) => {
      const parameterName = `document${n + 1}`;
      const ref = models[`document${n + 1}`];
      return {
        parameterName,
        document: ref && page.getContent<Document>(ref),
      };
    })
    .filter<DocumentParameter>((docParam): docParam is DocumentParameter => !!docParam.document);
}
