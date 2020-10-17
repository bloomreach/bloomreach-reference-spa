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
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { Document, Reference } from '@bloomreach/spa-sdk';
import { BrProps } from '@bloomreach/react-sdk';

const MAX_DOCUMENTS = 5;

interface NavigationModels {
  document1?: Reference;
  document2?: Reference;
  document3?: Reference;
  document4?: Reference;
  document5?: Reference;
}

interface NavigationLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  document: Document;
}

const NavigationLink = React.forwardRef(
  ({ document, ...props }: NavigationLinkProps, ref: React.Ref<HTMLAnchorElement>) => {
    const { title } = document.getData<DocumentData>();
    const url = document.getUrl();

    if (!url) {
      return (
        <a ref={ref} role="button" {...props}>
          {title}
        </a>
      );
    }

    return (
      <Link ref={ref} to={url} role="button" {...props}>
        {title}
      </Link>
    );
  },
);

export function Navigation({ component, page }: BrProps): React.ReactElement | null {
  const models = component.getModels<NavigationModels>();
  const documents = [...Array(MAX_DOCUMENTS).keys()]
    .map((n) => `document${n + 1}` as keyof NavigationModels)
    .map((model) => models[model])
    .map((reference) => reference && page.getContent<Document>(reference))
    .filter<Document>(Boolean as any);

  if (!documents.length) {
    return null;
  }

  return (
    <Nav as="ul">
      {documents.map((document, index) => (
        <Nav.Item as="li">
          <Nav.Link
            key={index}
            as={NavigationLink}
            document={document}
            className={`text-reset ${index === 0 ? 'pl-0' : ''} ${index === documents.length - 1 ? 'pr-0' : ''}`}
          />
        </Nav.Item>
      ))}
    </Nav>
  );
}
