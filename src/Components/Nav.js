import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

import { HomeOutlined, UserOutlined, WifiOutlined } from '@ant-design/icons';

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
      <Menu.Item key="/" icon={<HomeOutlined />}>
        <Link to="/">
          Home
        </Link>
      </Menu.Item>
      <Menu.Item key="/users" icon={<UserOutlined />}>
        <Link to="/users">
          Users
        </Link>
      </Menu.Item>
      <Menu.Item key="/dashboard" icon={<WifiOutlined />}>
        <Link to="/dashboard">
          Dashboard
        </Link>
      </Menu.Item>
    </Menu>
  );
}

Nav.propTypes = {
  path: PropTypes.string.isRequired,
};
