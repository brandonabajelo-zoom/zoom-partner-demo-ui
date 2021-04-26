import React from 'react';
import { Layout, Button, Result } from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { ReloadOutlined } from '@ant-design/icons';

const { Content } = Layout;

export default function Refresh() {
  const { push } = useHistory();
  const refreshToken = () => axios.post('/api/login')
    .then(() => push('/users'));

  return (
    <Layout className="layout-container">
      <Content className="align-center">
        <Result
          title="401"
          subTitle="Invalid Access Token"
          extra={[
           <Button
            size="large"
            type="primary"
            onClick={refreshToken}
            icon={<ReloadOutlined />}
            key="refresh"
          >
            Refresh Token
          </Button>
          ]}
        />
      </Content>
    </Layout>
  );
}
