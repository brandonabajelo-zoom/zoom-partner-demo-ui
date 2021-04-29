import React, { useState } from 'react';
import { Layout, Tabs, Badge, Drawer } from 'antd';
import {
  useHistory, useLocation, Route, Switch,
} from 'react-router-dom';
import { InfoCircleOutlined } from '@ant-design/icons';

import DashboardMeetings from './meetings';
import DashboardWebinars from './webinars';

const { Header, Content } = Layout;
const { TabPane } = Tabs;

export default function Dashboard() {
  const { push } = useHistory();
  const [drawerVisible, setVisible] = useState(false);
  const { pathname, search } = useLocation();

  return (
    <Layout className="layout-container">
      <Header className="header-flex">
        <div>
          <span>
            <Badge className="live-badge" status="processing" />
          </span>
          Live Dashboard
          <div className="drawer-icon">
            <InfoCircleOutlined onClick={() => setVisible(true)} />
          </div>
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
      <Drawer
        title="Zoom APIs -- https://api.zoom.us/v2"
        closable={false}
        onClose={() => setVisible(false)}
        visible={drawerVisible}
        width={400}
      >
        <h3>Dashboards</h3>
        <hr />
        <ul>
          <li><h4>GET /metrics/meetings</h4></li>
          <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/dashboards/dashboardmeetings" target="_blank" rel="noreferrer">
            https://marketplace.zoom.us/docs/api-reference/zoom-api/dashboards/dashboardmeetings
          </a>
          <hr />
          <li><h4>GET /metrics/webinars</h4></li>
          <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/dashboards/dashboardwebinars" target="_blank" rel="noreferrer">
            https://marketplace.zoom.us/docs/api-reference/zoom-api/dashboards/dashboardwebinars
          </a>
        </ul>
      </Drawer>
    </Layout>
  );
}