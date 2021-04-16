import React from 'react';
import zoomLogo from '../Images/zoomBlue.png';

export default function Home() {
  return (
    <div className="home-img-container">
      <img src={zoomLogo} alt="" className="logo" />
      <h1>Developer Advocacy | Partner Demo App</h1>
    </div>
  );
}
