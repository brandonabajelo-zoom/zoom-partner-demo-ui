import React from 'react';
import { useHistory } from 'react-router-dom';
import { Spin } from 'antd';
import qs from 'query-string';

declare var ZoomMtg

ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.9/lib', '/av');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

export default function WebSDK() {

  /**
   * The data needed for the WebSDK is passed here through URL paramaters
   */
  const {
    meetingNumber = '', userName = '', userId = '', userEmail = '',
  } = qs.parse((useHistory().location || {}).search);

  /**
   * Retrieve API key and signature endpoint from local .env file
   */
  const {
    REACT_APP_ZOOM_API_KEY = '', REACT_APP_SIGNATURE_ENDPOINT = '',
    NODE_ENV = '', REACT_APP_ZOOM_PROD_API_KEY = '',
  } = process.env;

  const isProduction = NODE_ENV === 'production';

  /**
   * Meetings/Webinars with required passcodes will need to be entered manually on the screen
   */
  const startMeeting = (signature) => {
    document.getElementById('zmmtg-root').style.display = 'block';
    ZoomMtg.init({
      leaveUrl: `${window.location.origin}/users/${userId}`,
      isSupportAV: true,
      success: (success) => {
        console.log('init success', success);

        ZoomMtg.join({
          signature,
          meetingNumber,
          userName,
          apiKey: isProduction ? REACT_APP_ZOOM_PROD_API_KEY : REACT_APP_ZOOM_API_KEY,
          userEmail,
          success: (joinSuccess) => console.log('Meeting join success: ', joinSuccess),
          error: (joinError) => console.error('Error joining meeting: ', joinError),
        });
      },
      error: (initError) => console.error('init error', initError),
    });
  };

  const getSignature = () => {
    const signature_url = isProduction
      ? 'https://zoompartnersignature.herokuapp.com/'
      : REACT_APP_SIGNATURE_ENDPOINT;

    const SIGNATURE_OPTIONS = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meetingNumber, role: 1 }),
    };

    fetch(signature_url, SIGNATURE_OPTIONS)
      .then((data) => data.json())
      .then(({ signature }) => !!signature && startMeeting(signature));
  };

  if (meetingNumber && userName && userId) {
    return (
      <div className="align-center">
        <Spin size="large" />
        {getSignature()}
      </div>
    );
  }

  return null;
}
