import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { VideoCameraFilled } from '@ant-design/icons';

import SideNavLogo from '../Images/zoom.svg';

const pathAsKeys = (path) => {
  if (!path || path === '/') {
    return ['/'];
  }
  return path
    .replace(/\/$/, '')
    .split('/')
    .map((x, i, a) => `${a.slice(0, i).join('/')}/${x}`)
    .slice(1);
};

export default function Nav({ path }) {
  return (
    <Menu mode="horizontal" defaultSelectedKeys={['/']} selectedKeys={pathAsKeys(path)}>
      <Menu.Item key="/">
        <Link to="/">
          <img className="navbar-logo" src={SideNavLogo} alt="" />
        </Link>
      </Menu.Item>
      <Menu.Item key="/users">
        <Link to="/users">
          Users
        </Link>
      </Menu.Item>
      <Menu.Item className="nav-item-logo" disabled>
        Web SDK
        <VideoCameraFilled />
      </Menu.Item>
    </Menu>
  );
}

Nav.propTypes = {
  path: PropTypes.string.isRequired,
};
