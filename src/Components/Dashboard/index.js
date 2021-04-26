import React from 'react';
import { Layout, Tabs, Badge } from 'antd';
import {
  useHistory, useLocation, Route, Switch,
} from 'react-router-dom';

import DashboardMeetings from './meetings';
import DashboardWebinars from './webinars';

const { Header, Content } = Layout;
const { TabPane } = Tabs;

export default function Dashboard() {
  const { push } = useHistory();
  const { pathname, search } = useLocation();

  return (
    <Layout className="layout-container">
      <Header className="header-flex">
        <div>
          Live Dashboard
          <span>
            <Badge className="live-badge" status="processing" />
          </span>
        </div>
      </Header>
      <Content>
        <Tabs
          type="card"
          size="large"
          activeKey={pathname}
          onChange={(key) => push(key + (search || ''))}
        >
          <TabPane tab="Meetings" key="/dashboard" />
          <TabPane tab="Webinars" key="/dashboard/webinars" />
        </Tabs>
        <Switch>
          <Route path="/dashboard/webinars">
            <DashboardWebinars />
          </Route>
          <Route>
            <DashboardMeetings />
          </Route>
        </Switch>
      </Content>
    </Layout>
  );
}