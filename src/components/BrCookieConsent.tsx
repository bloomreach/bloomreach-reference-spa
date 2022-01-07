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
