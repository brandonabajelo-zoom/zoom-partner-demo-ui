import React from 'react';
import {
  Layout, Spin, Tooltip, Tabs,
} from 'antd';
import {
  useParams, useLocation, Link, Switch, Route, useHistory,
} from 'react-router-dom';
import useAxios from 'axios-hooks';
import _ from 'lodash';
import { RightOutlined } from '@ant-design/icons';

import Error from '../error';
import WebinarForm from './form';

const { Header, Content } = Layout;
const { TabPane } = Tabs;

const Participants = () => <div>Participants</div>;

export default function Webinar() {
  const { userId, webinarId } = useParams();
  const { push } = useHistory();
  const { pathname, search } = useLocation();
  const [{ data = {}, loading, error }, refetchWebinar] = useAxios(
    { url: `/api/webinars/${webinarId}` }, { useCache: true },
  );
  const [{ data: userData = {} }] = useAxios(
    { url: `/api/users/${userId}` }, { useCache: true },
  );

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
          <Error />
        </Content>
      </Layout>
    );
  }

  const { first_name = '', last_name = '' } = userData;
  const { topic = '' } = data;

  return (
    <Layout className="layout-container">
      <Header className="header-start">
        <Link to={`/users/${userId}/webinars`}>
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
        <small>Webinar</small>
      </Header>
      <Content>
        <Tabs
          className="user-tabs"
          type="card"
          size="large"
          activeKey={pathname}
          onChange={(key) => push(key + (search || ''))}
        >
          <TabPane tab="Manage" key={`/users/${userId}/webinars/${webinarId}`} />
          <TabPane tab="Participants" key={`/users/${userId}/webinars/${webinarId}/participants`} />
        </Tabs>
        <Switch>
          <Route path="/users/:userId/webinars/:webinarId/participants">
            <Participants />
          </Route>
          <Route>
            <WebinarForm initialValues={data} refetch={refetchWebinar} />
          </Route>
        </Switch>
      </Content>
    </Layout>
  );
}
