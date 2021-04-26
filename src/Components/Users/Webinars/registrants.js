import React, { useState } from 'react';
import {
  Layout, Radio, List, Button, Tooltip,
} from 'antd';
import _ from 'lodash';
import useAxios from 'axios-hooks';
import axios from 'axios';
import qs from 'query-string';
import { useParams } from 'react-router-dom';
import {
  UserOutlined, ReloadOutlined, CheckOutlined, CloseOutlined,
} from '@ant-design/icons';

import Error from '../error';

const { Header, Content } = Layout;
const { Group } = Radio;
const { Item } = List;

export default function Registrants() {
  const { webinarId } = useParams();
  const [status, setStatus] = useState('pending')

  const [{ data = {}, loading, error }, refetch] = useAxios(`/api/webinars/${webinarId}/registrants?${qs.stringify({ status })}`);

  const approveRegistrant = async (id, email) => {
    await axios.put(`/api/webinars/${webinarId}/registrants/status`, {
      action: 'approve',
      registrants: [{ id, email }],
    }).then(() => refetch());
  }

  const denyRegistrant = async (id, email) => {
    await axios.put(`/api/webinars/${webinarId}/registrants/status`, {
      action: 'deny',
      registrants: [{ id, email }],
    }).then(() => refetch());
  }

  const renderActions = (id, email) => {
    const approveButton = (
      <Button
        onClick={() => approveRegistrant(id, email)}
        className="approve-btn"
        icon={<CheckOutlined />}
        size="small"
        type="text"
      >
        Approve
      </Button>
    );

    const denyButton = (
      <Button
        onClick={() => denyRegistrant(id, email)}
        className="deny-btn"
        icon={<CloseOutlined />}
        size="small"
        type="text"
      >
        Deny
      </Button>
    );

    if (status === 'pending') return [approveButton, denyButton];
    if (status === 'approved') return [denyButton];
    return [approveButton];
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
    <Layout className="layout-container edit">
      <Header className="header-flex">
        <div>Registrants</div>
        <Tooltip title="Refresh Webinars">
          <Button
            loading={loading}
            icon={<ReloadOutlined />}
            type="default"
            onClick={refetch}
          />
        </Tooltip>
      </Header>
      <Content>
        <Group onChange={(e) => setStatus(e.target.value)} value={status}>
          <Radio value="pending">Pending</Radio>
          <Radio value="approved">Approved</Radio>
          <Radio value="denied">Denied</Radio>
        </Group>
        <List
          itemLayout="horizontal"
          className="registrant-list"
          loading={loading && _.isEmpty(data)}
          rowKey="id"
          dataSource={_.uniqBy(data.registrants, 'id') || []}
          renderItem={({ first_name, last_name, email, id }) => (
            <Item actions={renderActions(id, email)}>
              <Item.Meta
                avatar={<UserOutlined />}
                title={`${first_name} ${last_name}`}
                description={email || ''}
              />
            </Item>
          )}
        />
      </Content>
    </Layout>  
  )
}