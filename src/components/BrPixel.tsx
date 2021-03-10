/*
 * Copyright 2021 Hippo B.V. (http://www.onehippo.com)
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
import { Page } from '@bloomreach/spa-sdk';

export interface BrPixelProps {
  accountId: string;
  domainKey: string;
  page: Page;
  pageType?: string;
  pageLabels?: string;
  type?: string;
}

export function BrPixel(props: BrPixelProps): React.ReactElement | null {
  useEffect(() => {
    if (/^\d+$/.test(props.accountId) && props.domainKey) {
      (window as any).br_data = {
        page_type: `${props.pageType}`,
        page_labels: `${props.pageLabels}`,
        acct_id: `${props.accountId}`,
        domain_key: `${props.domainKey}`,
        type: `${props.type}`,
      };

      const brtrk = document.createElement('script');
      brtrk.type = 'text/javascript';
      brtrk.async = true;
      brtrk.src = `//cdns.brsrvr.com/v1/br-trk-${props.accountId}.js`;
      const s = document.getElementsByTagName('script')[0];
      s.parentNode?.insertBefore(brtrk, s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
