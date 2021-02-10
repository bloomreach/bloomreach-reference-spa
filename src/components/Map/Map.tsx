/*
 * Copyright 2020-2021 Hippo B.V. (http://www.onehippo.com)
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
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';
import { BrProps } from '@bloomreach/react-sdk';
import { ContainerItem } from '@bloomreach/spa-sdk';

import styles from './Map.module.scss';

const GoogleMaps = withScriptjs(withGoogleMap(GoogleMap));

interface MapParameters {
  token?: string;
  latitude: number;
  longitude: number;
  marker?: boolean;
  zoom: number;
}

export function Map({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  const { latitude: lat, longitude: lng, marker = false, token, zoom } = component.getParameters<MapParameters>();

  if (component.isHidden()) {
    return page.isPreview() ? <div /> : null;
  }

  return (
    <div className="mw-container mx-auto my-4">
      <GoogleMaps
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places${token && `&key=${token}`}`}
        defaultCenter={{ lat, lng }}
        defaultZoom={zoom}
        containerElement={<div className={`${styles.map__container} position-relative h-0`} />}
        loadingElement={<div className="shimmer position-absolute w-100 h-100" />}
        mapElement={<div className="position-absolute w-100 h-100" />}
      >
        {marker && <Marker position={{ lat, lng }} />}
      </GoogleMaps>
    </div>
  );
}
