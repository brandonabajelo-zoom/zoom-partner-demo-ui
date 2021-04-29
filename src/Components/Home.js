import React from 'react';
import zoomLogo from '../Images/zoomBlue.png';

import { VideoCameraOutlined } from '@ant-design/icons';

export default function Home() {
  return (
    <div className="home-img-container">
      <h1>
        Virtual Events
        <VideoCameraOutlined />
      </h1>
      <h4>powered by</h4>
      <img src={zoomLogo} alt="" className="logo" />
    </div>
  );
}
