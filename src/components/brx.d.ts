/*
 * Copyright 2020 Bloomreach
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

/* eslint-disable camelcase */

interface ChannelParameters {
  smAccountId: string;
  smDomainKey?: string;
  smEndpoint: string;
  graphql_baseurl?: string;
}

interface Content {
  value: string;
}

interface BannerDocument {
  content: Content;
  cta?: string;
  image?: import('@bloomreach/spa-sdk').Reference;
  link?: import('@bloomreach/spa-sdk').Reference;
  title?: string;
}

interface ContentDocument {
  content: Content;
  date?: number;
  image?: import('@bloomreach/spa-sdk').Reference;
  introduction?: string;
  title?: string;
}

interface ProductDocument {
  brand: string;
  description: string;
  pid: string;
  title: string;
  price: number;
  sale_price?: number;
  thumb_image?: string;
  url: string;
}

interface ResourceBundle {
  keys: string[];
  messages: string[];
}

interface SelectionType {
  selectionValues: { key: string; label: string }[];
}
