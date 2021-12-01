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

import React from 'react';
import { Page } from '@bloomreach/spa-sdk';

/**
 * The richtext content data abstraction.
 */
export interface BrRichTextContentData {
  /**
   * HTML content data.
   */
  html: string;
}

/**
 * The richtext content rendering component properties.
 */
export interface BrRichTextContentProps {
  /**
   * The current page.
   */
  page: Page;
  /**
   * The richtext content data.
   */
  content: BrRichTextContentData;
  /**
   * The React dom element component type.
   */
  tagName?: React.ElementType;
  /**
   * The style class name on the container HTML tag.
   */
  className?: string;
}

/**
 * The richtext content rendering function component.
 * @param props richtext content rendering component properties
 * @returns a richtext content rendering function component
 */
export function BrRichTextContent(props: BrRichTextContentProps): React.ReactElement | null {
  const { page, content, tagName, className } = props;
  const Component = tagName || 'div';
  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: page.rewriteLinks(page.sanitize(content.html)) }}
    />
  );
}
