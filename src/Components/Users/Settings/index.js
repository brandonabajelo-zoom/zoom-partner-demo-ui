import React from 'react';
import useAxios from 'axios-hooks';
import { Layout, Spin } from 'antd';
import _ from 'lodash';
import { useParams } from 'react-router-dom';


import SettingsForm from '../Forms/userSettings';
import Error from '../error';

const { Content } = Layout;

export default function Settings() {
  const { userId } = useParams();
  const [{ data = {}, loading, error }, refetch] = useAxios(`/api/users/${userId}/settings`);

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

  const { feature = {}, recording = {} } = data;

  return (
    <SettingsForm
      userId={userId}
      initialValues={{ cloud_recording: recording.cloud_recording, webinar: feature.webinar }}
      refetch={refetch}
    />
  );
}