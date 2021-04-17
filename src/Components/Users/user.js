import React from 'react';
import {
  Layout, Descriptions, Badge, Tag, Spin, Tabs, Tooltip,
} from 'antd';
import {
  useParams, useLocation, Route, Switch, useHistory, Link,
} from 'react-router-dom';
import useAxios from 'axios-hooks';
import _ from 'lodash';
import qs from 'query-string';
import { DateTime } from 'luxon';
import { VideoCameraOutlined } from '@ant-design/icons';

import UserMeetings from './Meetings/meetings';
import UserWebinars from './Webinars/webinars';
import UserRecordings from './Recordings';

const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { Item } = Descriptions;

const labelStyle = {
  backgroundColor: '#2D8CFF',
  color: '#fff',
  fontSize: 15,
  borderRadius: 6,
};

const contentStyle = {
  backgroundColor: '#fff',
  fontSize: 15,
  borderRadius: 6,
};

const itemStyles = { labelStyle, contentStyle };

export default function User() {
  const { userId } = useParams();
  const { pathname, search } = useLocation();
  const { push } = useHistory();

  const [{ data = {}, loading, error }] = useAxios(`/api/users/${userId}`);

  const {
    first_name = '', last_name = '', email = '', created_at = '',
    status = '', timezone = '', pmi = '', id = '', last_login_time = '',
  } = data;

  if (loading && !data) {
    return (
      <Layout className="layout-container">
        <Content className="align-center">
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (error && !loading && !data) {
    return (
      <Layout className="layout-container">
        <Content className="align-center">
          <h1>Error Fetching User</h1>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="layout-container">
      <Header className="header-flex">
        <div>{`${first_name} ${last_name}`}</div>
        <small>{email}</small>
      </Header>
      <Content>
        <Descriptions bordered>
          <Item {...itemStyles} label="User ID">
            {id}
          </Item>
          <Item {...itemStyles} label="Personal Meeting ID">
            {pmi}
            <Tooltip title="Click to start an instant zoom meeting!">
              <Link to={`/websdk?${qs.stringify({ meetingNumber: pmi, userName: `${first_name} ${last_name}`, userId: id })}`}>
                <VideoCameraOutlined className="question-icon" />
              </Link>
            </Tooltip>
          </Item>
          <Item {...itemStyles} label="Timezone"><Tag color="blue">{timezone}</Tag></Item>
          <Item {...itemStyles} label="Status">
            <Badge status={status === 'active' ? 'success' : 'danger'} text={_.upperFirst(status)} />
          </Item>
          <Item {...itemStyles} label="Created">{DateTime.fromISO(created_at).toLocaleString(DateTime.DATETIME_MED)}</Item>
          <Item {...itemStyles} label="Last Login">{DateTime.fromISO(last_login_time).toLocaleString(DateTime.DATETIME_MED)}</Item>
        </Descriptions>
        <Tabs className="user-tabs" type="card" size="large" activeKey={pathname} onChange={(key) => push(key + (search || ''))}>
          <TabPane tab="Meetings" key={`/users/${userId}`} />
          <TabPane tab="Webinars" key={`/users/${userId}/webinars`} />
          <TabPane tab="Cloud Recordings" key={`/users/${userId}/recordings`} />
        </Tabs>
        <Switch>
          <Route path="/users/:userId/webinars">
            <UserWebinars userId={userId} userName={`${first_name} ${last_name}`} userEmail={email} />
          </Route>
          <Route path="/users/:userId/recordings">
            <UserRecordings />
          </Route>
          <Route>
            <UserMeetings userId={userId} userName={`${first_name} ${last_name}`} />
          </Route>
        </Switch>
      </Content>
    </Layout>
  );
}
