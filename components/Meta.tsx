/*
 * Copyright 2022 Bloomreach
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

import Head from 'next/head';
import { BrProps } from '@bloomreach/react-sdk';
import { ImageSet } from '@bloomreach/spa-sdk';

export function Meta({ page }: BrProps): JSX.Element {
  const { title, description, preventIndexing, ogCompound } = page.getDocument<PageDocument>() ?? {};
  const { description: ogDescription, locale, type, url = page.getUrl(), image: imageRef } = ogCompound ?? {};
  const image = imageRef && page.getContent<ImageSet>(imageRef);

  return (
    <Head>
      {title && (<>
        <title key="title">{title}</title>
        <meta property="og:title" content={title} />
      </>)}
      {description && <meta key="description" name="description" content={description} />}
      {preventIndexing && <meta name="robots" content="noindex, nofollow" />}
      {ogCompound && (<>
        {ogDescription && <meta property="og:description" content={ogDescription} />}
        {locale && <meta property="og:locale" content={locale} />}
        {type && <meta property="og:type" content={type} />}
        {url && <meta property="og:url" content={url} />}
        {image && <meta property="og:image" content={image.getOriginal()?.getUrl()} />}
      </>)}
    </Head>
  );

}
