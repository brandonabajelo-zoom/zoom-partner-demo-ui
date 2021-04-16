import React from 'react';
import { Layout, Spin, Tooltip } from 'antd';
import { useParams, Link } from 'react-router-dom';
import useAxios from 'axios-hooks';
import { RightOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

export default function Webinar() {
  const { userId, webinarId } = useParams();
  const [{ data = {}, loading, error }] = useAxios(
    { url: `/api/webinars/${webinarId}` }, { useCache: true },
  );
  const [{ data: userData = {} }] = useAxios(
    { url: `/api/users/${userId}` }, { useCache: true },
  );

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
          <h1>Error Fetching Webinar</h1>
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
          <RightOutlined style={{ fontSize: 14 }} />
        </div>
        <div className="meeting-topic">
          <Tooltip title={topic}>
            {topic}
          </Tooltip>
        </div>
        <small>Webinar</small>
      </Header>
      <Content>
        {webinarId}
      </Content>
    </Layout>
  );
}
