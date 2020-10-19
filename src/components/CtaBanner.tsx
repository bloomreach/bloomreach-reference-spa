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
import { Button, Container, Jumbotron } from 'react-bootstrap';
import { Document, Reference } from '@bloomreach/spa-sdk';
import { BrManageContentButton, BrProps } from '@bloomreach/react-sdk';

import { Link } from './Link';

interface CtaBannerModels {
  document?: Reference;
}

export function CtaBanner({ component, page }: BrProps): React.ReactElement | null {
  const { document: documentRef } = component.getModels<CtaBannerModels>();
  const document = documentRef && page.getContent<Document>(documentRef);

  if (!document) {
    return page.isPreview() ? <div /> : null;
  }

  const { content, cta, link: linkRef, title } = document.getData<BannerDocument>();
  const link = linkRef && page.getContent<Document>(linkRef);

  return (
    <Jumbotron fluid className="bg-primary text-light text-center my-0">
      <Container className={page.isPreview() ? 'has-edit-button' : ''}>
        <BrManageContentButton content={document} />

        {title && <h3 className="mb-2">{title}</h3>}
        {content && <div dangerouslySetInnerHTML={{ __html: page.rewriteLinks(content.value) }} />}
        {cta && (
          <Button as={Link} href={link?.getUrl()} variant="light" className="text-primary mt-3">
            {cta}
          </Button>
        )}
      </Container>
    </Jumbotron>
  );
}
