/*
 * Copyright 2021-2022 Bloomreach
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
import CookieConsent, { getCookieConsentValue } from 'react-cookie-consent';
import { useCookies } from 'react-cookie';

export interface csType {
  csUpdate: (val: boolean) => void;
}
export function BrCookieConsent(props: csType): React.ReactElement | null {
  const [, , removeCookie] = useCookies(['_br_uid_2']);
  if (getCookieConsentValue() !== 'true') {
    removeCookie('_br_uid_2');
  }

  return (
    <CookieConsent
      location="bottom"
      buttonText="Allow cookies"
      style={{ background: '#000000', left: '1%', width: '98%', marginBottom: '1%' }}
      buttonStyle={{ color: '#4e503b', fontSize: '13px', fontWeight: 'bold' }}
      declineButtonStyle={{ background: 'transparent', color: '#ffffff' }}
      expires={28}
      enableDeclineButton
      declineButtonText="Decline"
      onAccept={(acceptedByScrolling) => {
        if (!acceptedByScrolling) {
          props.csUpdate(true);
        }
      }}
    >
      This website uses cookies to ensure you get the best experience on our website.{' '}
    </CookieConsent>
  );
}
