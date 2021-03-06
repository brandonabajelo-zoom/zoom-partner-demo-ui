import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { useLocation, Switch, Route } from 'react-router-dom';
import axios from 'axios';

import Nav from './Components/Nav';
import Home from './Components/Home';
import Users from './Components/Users';
import WebSDK from './Components/WebSDK';
import Dashboard from './Components/Dashboard';
import RefreshToken from './Components/Refresh';

const { Header, Content } = Layout;

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => { axios.post('/api/login'); }, []);

  return (
    <Layout>
      <Header>
        <Nav path={pathname} />
      </Header>
      <Content>
        <Switch>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/websdk">
            <WebSDK />
          </Route>
          <Route path="/refresh">
            <RefreshToken />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Content>
    </Layout>
  );
}
