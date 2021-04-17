import React from 'react';
import { Layout, Spin, Tooltip, Tabs } from 'antd';
import {
  useParams, useHistory, useLocation, Link, Switch, Route,
} from 'react-router-dom';
import useAxios from 'axios-hooks';
import _ from 'lodash';
import { RightOutlined } from '@ant-design/icons';

import MeetingForm from './form';
import Error from '../error';

const { Header, Content } = Layout;
const { TabPane } = Tabs;

const Participants = () => <div>Participants</div>;

export default function Meeting() {
  const { userId, meetingId } = useParams();
  const { push } = useHistory();
  const { pathname, search } = useLocation();

  const [{ data = {}, loading, error }, refetchMeeting] = useAxios({ url: `/api/meetings/${meetingId}` });
  const [{ data: userData = {} }] = useAxios({ url: `/api/users/${userId}` });

  const { first_name = '', last_name = '' } = userData;
  const { topic = '' } = data;

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

  return (
    <Layout className="layout-container">
      <Header className="header-start">
        <Link to={`/users/${userId}`}>
          {`${first_name} ${last_name}`}
        </Link>
        <div className="carrot-right">
          <RightOutlined />
        </div>
        <div className="meeting-topic">
          <Tooltip title={topic}>
            {topic}
          </Tooltip>
        </div>
        <small>Meeting</small>
      </Header>
      <Content>
        <Tabs
          className="user-tabs"
          type="card"
          size="large"
          activeKey={pathname}
          onChange={(key) => push(key + (search || ''))}
        >
          <TabPane tab="Manage" key={`/users/${userId}/meetings/${meetingId}`} />
          <TabPane tab="Participants" key={`/users/${userId}/meetings/${meetingId}/participants`} />
        </Tabs>
        <Switch>
          <Route path="/users/:userId/meetings/:meetingId/participants">
            <Participants />
          </Route>
          <Route>
            <MeetingForm initialValues={data} refetch={refetchMeeting} />
          </Route>
        </Switch>
      </Content>
    </Layout>
  );
}
