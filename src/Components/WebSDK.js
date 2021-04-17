import React from 'react';
import { useHistory } from 'react-router-dom';
import { Spin } from 'antd';
import qs from 'query-string';

// eslint-disable-next-line
declare var ZoomMtg

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.1/lib', '/av');

export default function WebSDK() {
  const {
    meetingNumber, userName, userId, userEmail = '',
  } = qs.parse((useHistory().location || {}).search);
  const {
    REACT_APP_ZOOM_API_KEY = '', REACT_APP_SIGNATURE_ENDPOINT = '',
  } = process.env;

  const startMeeting = (signature) => {
    document.getElementById('zmmtg-root').style.display = 'block';
    ZoomMtg.init({
      leaveUrl: `http://localhost:3000/users/${userId}`,
      isSupportAV: true,
      success: (success) => {
        console.log('init success', success);

        ZoomMtg.join({
          signature,
          meetingNumber,
          userName,
          apiKey: REACT_APP_ZOOM_API_KEY,
          // passWord,
          userEmail,
          success: (joinSuccess) => console.log('Meeting join success: ', joinSuccess),
          error: (joinError) => console.error('Error joining meeting: ', joinError),
        });
      },
      error: (initError) => console.error('init error', initError),
    });
  };

  const getSignature = () => {
    const SIGNATURE_OPTIONS = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingNumber,
        role: 1,
      }),
    };

    fetch(REACT_APP_SIGNATURE_ENDPOINT, SIGNATURE_OPTIONS)
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
