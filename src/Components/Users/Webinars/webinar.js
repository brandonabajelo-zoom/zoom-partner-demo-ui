import React from 'react';
import {
  Layout, Spin, Tooltip, Tabs, Button, notification, Tag,
  Menu, Dropdown,
} from 'antd';
import {
  useParams, useLocation, Link, Switch, Route, useHistory, Redirect,
} from 'react-router-dom';
import useAxios from 'axios-hooks';
import { DateTime } from 'luxon';
import _ from 'lodash';
import { RightOutlined, CopyOutlined } from '@ant-design/icons';

import Error from '../error';
import WebinarForm from '../Forms/webinar';
import RegistrationForm from '../Forms/register';
import Registrants from './registrants';
import Participants from './participants';

const { Header, Content } = Layout;
const { TabPane } = Tabs;

const copyText = (type) => {
  const isRegistration = type === 'registration';
  const message = isRegistration
    ? 'Registration URL Copied!'
    : 'Join URL Copied!';
  let copyText = isRegistration
    ? document.getElementById('webinar-registration-url')
    : document.getElementById('webinar-join-url');
  let textArea = document.createElement("textarea");
  textArea.value = copyText.textContent;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("Copy");
  textArea.remove();

  notification.success({
    message,
    icon: <CopyOutlined style={{ color: '#2D8CFF' }} />,
    duration: 3,
  })
}

/**
 * View single webinar
 */
export default function Webinar() {
  const { userId, webinarId } = useParams();
  const { push } = useHistory();
  const { pathname, search } = useLocation();
  const [{ data = {}, loading, error }, refetchWebinar] = useAxios(`/api/webinars/${webinarId}`);
  const [{ data: userData = {} }] = useAxios(`/api/users/${userId}`);

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
  const {
    topic = '', registration_url = '', start_time, duration, join_url,
  } = data;

  const menu = (
    <Menu onClick={e => copyText(e.key)}>
      {!!registration_url && (
        <Menu.Item key="registration">
          <span className="copy-title">Registration URL: </span>
          <span id="webinar-registration-url">{registration_url}</span>
          <Tooltip title="Copy">
            <Button shape="circle" type="default" icon={<CopyOutlined />} />
          </Tooltip>
        </Menu.Item>
      )}
      {!!join_url && (
        <Menu.Item key="join">
          <span className="copy-title">Join URL:</span>
          <span id="webinar-join-url">{join_url}</span>
          <Tooltip title="Copy">
            <Button shape="circle" type="default" icon={<CopyOutlined />} />
          </Tooltip>
        </Menu.Item>
      )}

    </Menu>
  );

  const tabBarExtraContent = {
    right: (
      <Dropdown.Button overlay={menu}>
        Webinars URLS
      </Dropdown.Button>
    ),
  }

  const webinarExpired = DateTime.fromISO(start_time).plus({ minutes: duration }) < DateTime.now()

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
        {webinarExpired && <small><Tag>Expired</Tag></small>}
      </Header>
      <Content>
        {webinarExpired && (
          <>
            <Tabs
              className="user-tabs"
              type="card"
              size="large"
              activeKey={pathname}
              onChange={(key) => push(key + (search || ''))}
            >
              <TabPane tab="Participants" key={`/users/${userId}/webinars/${webinarId}/participants`} />
            </Tabs>
            <Switch>
              <Route path="/users/:userId/webinars/:webinarId/participants">
                <Participants />
              </Route>
              <Redirect to="/users/:userId/webinars/:webinarId/participants" />
            </Switch>
          </>
        )}
        {!webinarExpired && (
          <>
            <Tabs
              className="user-tabs"
              type="card"
              size="large"
              activeKey={pathname}
              onChange={(key) => push(key + (search || ''))}
              tabBarExtraContent={tabBarExtraContent}
            >
              <TabPane tab="Manage" key={`/users/${userId}/webinars/${webinarId}`} />
              <TabPane tab="Participants" key={`/users/${userId}/webinars/${webinarId}/participants`} />
              <TabPane tab="Registrants" key={`/users/${userId}/webinars/${webinarId}/registrants`} />
              <TabPane tab="Register" key={`/users/${userId}/webinars/${webinarId}/register`} />
            </Tabs>
            <Switch>
              <Route path="/users/:userId/webinars/:webinarId/participants">
                <Participants />
              </Route>
              <Route path="/users/:userId/webinars/:webinarId/registrants">
                <Registrants />
              </Route>
              <Route path="/users/:userId/webinars/:webinarId/register">
                <RegistrationForm />
              </Route>
              <Route>
                <WebinarForm initialValues={data} refetch={refetchWebinar} />
              </Route>
            </Switch>
          </>
        )}
      </Content>
    </Layout>
  );
}
