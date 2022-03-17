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
import { Document, ImageSet, Page } from '@bloomreach/spa-sdk';
import { useRouter } from 'next/router';

interface MetaProps {
  page: Page;
}

export function Meta({ page }: MetaProps): JSX.Element {
  const router = useRouter();
  const document = page.getDocument<Document>();
  const { title, description, preventIndexing, ogCompound } = document?.getData<PageDocument>() ?? {};
  const { description: ogDescription, locale, type, url, image: imageRef } = ogCompound ?? {};
  const image = imageRef && page.getContent<ImageSet>(imageRef);
  const canonicalUrl = url || router.asPath;

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
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        {image && <meta property="og:image" content={image.getOriginal()?.getUrl()} />}
      </>)}
    </Head>
  );
}
