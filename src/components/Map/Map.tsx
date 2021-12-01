/*
 * Copyright 2020-2021 Bloomreach
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

import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { BrProps } from '@bloomreach/react-sdk';
import { ContainerItem } from '@bloomreach/spa-sdk';

import styles from './Map.module.scss';

interface MapParameters {
  token?: string;
  latitude: number;
  longitude: number;
  marker?: boolean;
  zoom: number;
  address?: string;
  type: string;
}

export function Map({ component, page }: BrProps<ContainerItem>): React.ReactElement | null {
  const { token } = component.getParameters<MapParameters>();

  if (component.isHidden()) {
    return page.isPreview() ? <div /> : null;
  }

  return (
    <div className="mw-container mx-auto my-4">
      <LoadScript
        key={token}
        googleMapsApiKey={token ?? ''}
        loadingElement={<div className="shimmer position-absolute w-100 h-100" />}
      >
        <RenderMap component={component} />
      </LoadScript>
    </div>
  );
}

function RenderMap({ component }: { component: ContainerItem }): React.ReactElement {
  const {
    latitude: lat,
    longitude: lng,
    marker = false,
    zoom,
    address,
    type,
  } = component.getParameters<MapParameters>();
  const [center, setCenter] = useState<google.maps.LatLngLiteral | google.maps.LatLng>({ lat, lng });

  useEffect(() => {
    if (address) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          setCenter(results[0].geometry.location);
        }
      });
    } else {
      setCenter({ lat, lng });
    }
  }, [address, lat, lng]);

  return (
    <GoogleMap
      center={center}
      zoom={zoom}
      mapContainerClassName={`${styles.map__container} position-relative h-0`}
      mapTypeId={type}
    >
      {marker && <Marker position={center} />}
    </GoogleMap>
  );
}
