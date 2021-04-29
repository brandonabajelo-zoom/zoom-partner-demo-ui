import React, { useState } from 'react';
import {
  Layout, Radio, List, Button, Tooltip, Drawer,
} from 'antd';
import _ from 'lodash';
import useAxios from 'axios-hooks';
import axios from 'axios';
import qs from 'query-string';
import { useParams } from 'react-router-dom';
import {
  UserOutlined, ReloadOutlined, CheckOutlined, CloseOutlined, RightOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

import Error from '../error';

const { Header, Content } = Layout;
const { Group } = Radio;
const { Item } = List;

export default function Registrants() {
  const { webinarId } = useParams();
  const [status, setStatus] = useState('pending')
  const [nextPageToken, setNextPageToken] = useState('');
  const [drawerVisible, setVisible] = useState(false);

  const [
    { data = {}, loading, error }, refetch,
  ] = useAxios(`/api/webinars/${webinarId}/registrants?${qs.stringify(_.pickBy({ status, next_page_token: nextPageToken }))}`);

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
        <div>
          Registrants
          <span className="drawer-icon">
            <InfoCircleOutlined onClick={() => setVisible(true)} />
          </span>
        </div>
        <Tooltip title="Refresh Registrants">
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
        {data.page_size < data.total_records && (
          <div className="pagination-btn">
            <Button
              onClick={() => setNextPageToken(data.next_page_token)}
              size="small" icon={<RightOutlined />}
            />
          </div> 
        )}
      </Content>
      <Drawer
        title="Zoom APIs -- https://api.zoom.us/v2"
        closable={false}
        onClose={() => setVisible(false)}
        visible={drawerVisible}
        width={400}
      >
        <h3>Webinar Registrants</h3>
        <hr />
        <ul>
          <li><h4>GET /webinars/:webinarId/registrants</h4></li>
          <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarregistrants" target="_blank" rel="noreferrer">
            https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarregistrants
          </a>
          <hr />
          <li><h4>PUT /webinars/:webinarId/registrants/status</h4></li>
          <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarregistrantstatus" target="_blank" rel="noreferrer">
            https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarregistrantstatus
          </a>
        </ul>
      </Drawer>
    </Layout>  
  )
}