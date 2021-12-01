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
import { ContainerItem, getContainerItemContent } from '@bloomreach/spa-sdk';
import { BrProps } from '@bloomreach/react-sdk';

import styles from './TitleAndText.module.scss';

interface TitleAndTextCompound {
  title?: string;
  text?: {
    value?: string;
  };
}

export function TitleAndText({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  if (component.isHidden()) {
    return page.isPreview() ? <div /> : null;
  }

  let title;
  let text;

  const content = getContainerItemContent<TitleAndTextCompound>(component, page);
  if (content !== null) {
    title = content.title;
    text = content.text;
  }

  const { titlesize = 'H3', textalignment = 'center', style = 'style1' } = component.getParameters();
  const sectionStyle = styles[style];

  return (
    <section className={`${sectionStyle} pt-4 text-${textalignment}`}>
      {titlesize === 'H1' && <h1 className="mb-2">{title}</h1>}
      {titlesize === 'H2' && <h2 className="mb-2">{title}</h2>}
      {titlesize === 'H3' && <h3 className="mb-2">{title}</h3>}
      {titlesize === 'H4' && <h4 className="mb-2">{title}</h4>}
      {titlesize === 'H5' && <h5 className="mb-2">{title}</h5>}
      {text && <div>{text}</div>}
    </section>
  );
}
