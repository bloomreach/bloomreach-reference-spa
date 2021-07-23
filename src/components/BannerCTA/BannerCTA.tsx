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

import React from 'react';
import { Button } from 'react-bootstrap';
import { ContainerItem, Document, getContainerItemContent, Reference } from '@bloomreach/spa-sdk';
import { BrProps } from '@bloomreach/react-sdk';
import { Link } from '../Link';
import styles from './Banner.module.scss';

interface BannerCTACompound {
  title?: string;
  content?: Content;
  cta?: string;
  link?: Reference;
}

export function BannerCTA(
  { component, page, ...props }: BrProps<ContainerItem>,
  ref: React.Ref<HTMLAnchorElement>,
): React.ReactElement | null {
  const { title, content, cta, link } = getContainerItemContent<BannerCTACompound>(component, page) ?? {};
  const linkedDoc = link && page?.getContent<Document>(link);

  return (
    <Link
      ref={ref}
      href={linkedDoc?.getUrl()}
      className={`${styles.banner} ${page?.isPreview() ? 'has-edit-button' : ''} text-reset text-decoration-none`}
      {...props}
    >
      {title && <span className="d-block h4 mb-3">{title}</span>}
      {content?.value && (
        <span className="d-block text-muted mb-4" dangerouslySetInnerHTML={{ __html: content.value }} />
      )}
      {cta && (
        <div className="mt-2">
          <Button as={Link} variant="primary" href={linkedDoc?.getUrl()}>
            {cta}
          </Button>
        </div>
      )}
    </Link>
  );
}
