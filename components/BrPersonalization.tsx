/*
 * Copyright 2023 Bloomreach
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

import React, { useEffect } from 'react';
import { segmentsSubscription } from '@bloomreach/segmentation';
import { injectPersonalizationScriptSnippet, runPersonalization } from '../src/personalization';

interface Props {
  path?: string;
}

export function BrPersonalization({ path }: Props): React.ReactElement | null {
  useEffect(() => {
    injectPersonalizationScriptSnippet();

    // eslint-disable-next-line consistent-return
    return segmentsSubscription();
  }, []);

  useEffect(() => {
    runPersonalization(path);
  }, [path]);

  return null;
}
