import React, { useState } from 'react';
import {
  Layout, Descriptions, Badge, Tag, Spin, Tabs, Tooltip, Drawer,
} from 'antd';
import {
  useParams, useLocation, Route, Switch, useHistory, Link,
} from 'react-router-dom';
import useAxios from 'axios-hooks';
import _ from 'lodash';
import qs from 'query-string';
import { DateTime } from 'luxon';
import { VideoCameraOutlined, InfoCircleOutlined } from '@ant-design/icons';

import EditUser from './Forms/editUser';
import UserMeetings from './Meetings/meetings';
import UserWebinars from './Webinars/webinars';
import UserRecordings from './Recordings';
import UserReports from './Reports';
import UserSettings from './Settings';
import Error from './error';

const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { Item } = Descriptions;

const itemStyles = {
  labelStyle: {
    backgroundColor: '#2D8CFF',
    color: '#fff',
    fontSize: 15,
    borderRadius: 6,
  },
  contentStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    borderRadius: 6,
  },
};

/**
 * Main navigational entry to the application. Here you can view user info, settings, webianrs, meetings,
 * cloud recordings, and reports for a particular user (depending on what licenses are available).
 */
export default function User() {
  const { userId } = useParams();
  const [drawerVisible, setVisible] = useState(false);
  const { pathname, search } = useLocation();
  const { push } = useHistory();

  const [{ data = {}, loading, error = {} }, refetch] = useAxios(`/api/users/${userId}`);

  const {
    first_name = '', last_name = '', email = '', created_at = '',
    status = '', timezone = '', pmi = '', id = '', last_login_time = '', use_pmi = true,
  } = data;

  if (loading && _.isEmpty(data)) {
    return (
      <Layout className="layout-container">
        <Content className="align-center">
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout className="layout-container">
        <Content className="align-center">
          <Error error={error} />
        </Content>
      </Layout>
    );
  }

  const queryParams = qs.stringify({
    meetingNumber: pmi, userName: `${first_name} ${last_name}`, userId: id,
  });

  return (
    <Layout className="layout-container">
      <Header className="header-flex">
        <div>
          {`${first_name} ${last_name}`}
          <div className="drawer-icon">
            <InfoCircleOutlined onClick={() => setVisible(true)} />
          </div>
        </div>
        <small>{email}</small>
      </Header>
      <Content>
        <Descriptions size="middle" bordered>
          <Item {...itemStyles} label="User ID">
            {id}
          </Item>
          <Item {...itemStyles} label="Personal Meeting ID">
            {pmi}
            {use_pmi && (
            <Tooltip title="Click to start an instant zoom meeting!">
              <Link to={`/websdk?${queryParams}`}>
                <VideoCameraOutlined className="question-icon" />
              </Link>
            </Tooltip>              
            )}
          </Item>
          <Item {...itemStyles} label="Timezone">
            <Tag color="blue">{timezone}</Tag>
          </Item>
          <Item {...itemStyles} label="Status">
            <Badge
              status={status === 'active' ? 'success' : 'danger'}
              text={_.upperFirst(status)}
            />
          </Item>
          <Item {...itemStyles} label="Created">
            {DateTime.fromISO(created_at).toLocaleString(DateTime.DATETIME_MED)}
          </Item>
          <Item {...itemStyles} label="Last Login">
            {DateTime.fromISO(last_login_time).toLocaleString(DateTime.DATETIME_MED)}
          </Item>
        </Descriptions>
        <Tabs
          className="user-tabs"
          type="card"
          size="large"
          activeKey={pathname}
          onChange={(key) => push(key + (search || ''))}
        >
          <TabPane tab="User" key={`/users/${userId}`} />
          <TabPane tab="Features" key={`/users/${userId}/features`} />
          <TabPane tab="Meetings" key={`/users/${userId}/meetings`} />
          <TabPane tab="Webinars" key={`/users/${userId}/webinars`} />
          <TabPane tab="Cloud Recordings" key={`/users/${userId}/recordings`} />
          <TabPane tab="Reports" key={`/users/${userId}/reports`} />
        </Tabs>
        <Switch>
          <Route path="/users/:userId/reports">
            <UserReports />
          </Route>
          <Route path="/users/:userId/recordings">
            <UserRecordings />
          </Route>
          <Route path="/users/:userId/webinars">
            <UserWebinars
              userId={userId}
              userName={`${first_name} ${last_name}`}
              userEmail={email}
            />
          </Route>
          <Route path="/users/:userId/meetings">
            <UserMeetings userName={`${first_name} ${last_name}`} />
          </Route>
          <Route path="/users/:userId/features">
            <UserSettings />
          </Route>
          <Route>
            <EditUser initialValues={data} refetch={refetch} />
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
        <h3>User</h3>
        <hr />
        <ul>
          <li><h4>GET /users/:userId</h4></li>
          <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/users/user" target="_blank" rel="noreferrer">
            https://marketplace.zoom.us/docs/api-reference/zoom-api/users/user
          </a>
        </ul>
      </Drawer>
    </Layout>
  );
}
