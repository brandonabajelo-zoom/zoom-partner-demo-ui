import React from 'react';
import {
  Layout, Spin, Tooltip, Tabs, Button, notification,
} from 'antd';
import {
  useParams, useHistory, useLocation, Link, Switch, Route,
} from 'react-router-dom';
import useAxios from 'axios-hooks';
import _ from 'lodash';
import { RightOutlined, CopyOutlined } from '@ant-design/icons';

import MeetingForm from '../Forms/meeting';
import Participants from './participants';
import Error from '../error';

const { Header, Content } = Layout;
const { TabPane } = Tabs;

const copyText = () => {
  let copyText = document.getElementById("join");
  let textArea = document.createElement("textarea");
  textArea.value = copyText.textContent;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("Copy");
  textArea.remove();

  notification.success({
    message: 'Join URL Copied!',
    icon: <CopyOutlined style={{ color: '#2D8CFF' }} />,
    duration: 3,
  })
}

/**
 * View single meeting
 */
export default function Meeting() {
  const { userId, meetingId } = useParams();
  const { push } = useHistory();
  const { pathname, search } = useLocation();

  const [{ data = {}, loading, error }, refetchMeeting] = useAxios(`/api/meetings/${meetingId}`);
  const [{ data: userData = {} }] = useAxios(`/api/users/${userId}`);

  const { first_name = '', last_name = '' } = userData;
  const { topic = '', join_url = '', uuid = '' } = data;

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

  const tabBarExtraContent = {
    right: (
      <div className="join-url">
        <div>
          Join URL:
          <span id="join">
            {join_url}
          </span>
        </div>
        <Tooltip title="Copy">
          <Button onClick={copyText} shape="circle" type="default" icon={<CopyOutlined />} />
        </Tooltip>
      </div>
    ),
  }

  return (
    <Layout className="layout-container">
      <Header className="header-start">
        <div>
          <Link to={`/users/${userId}/meetings`}>
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
        </div>
      </Header>
      <Content>
        <Tabs
          className="user-tabs"
          type="card"
          size="large"
          activeKey={pathname}
          onChange={(key) => push(key + (search || ''))}
          tabBarExtraContent={tabBarExtraContent}
        >
          <TabPane tab="Manage" key={`/users/${userId}/meetings/${meetingId}`} />
          <TabPane tab="Participants" key={`/users/${userId}/meetings/${meetingId}/participants`} />
        </Tabs>
        <Switch>
          <Route path="/users/:userId/meetings/:meetingId/participants">
            <Participants meetingUUID={uuid} />
          </Route>
          <Route>
            <MeetingForm initialValues={data} refetch={refetchMeeting} />
          </Route>
        </Switch>
      </Content>
    </Layout>
  );
}
