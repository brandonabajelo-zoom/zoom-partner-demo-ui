import React, { useState } from 'react';
import {
  Table, Tag, Layout, Button, Radio, Input, Divider, Tooltip,
  Popconfirm, Drawer,
} from 'antd';
import { Link, useHistory } from 'react-router-dom';
import _ from 'lodash';
import { DateTime } from 'luxon';
import qs from 'query-string';
import useAxios from 'axios-hooks';
import Error from './error';
import axios from 'axios';
import {
  ReloadOutlined, PlusOutlined, DeleteOutlined, MinusCircleOutlined,
  QuestionCircleOutlined, InfoCircleOutlined, RightOutlined,
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Group } = Radio;

const removeTooltip = (
  <Tooltip
    title="Removing a user from the account will give them their own basic,
    free Zoom account disassociated from this one."
  >
    <InfoCircleOutlined className="table-icon" />
  </Tooltip>
);

const deleteTooltip = (
  <Tooltip
    title="Deleting a user permanently removes them and their data from Zoom.
    They will need to create a new zoom account as a result."
  >
    <InfoCircleOutlined className="table-icon" />
  </Tooltip>
);

/**
 * View active and pending users on an account
 */
export default function UsersList() {
  const [status, setStatus] = useState('active');
  const [nextPageToken, setNextPageToken] = useState('');
  const [drawerVisible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const { push } = useHistory();
  const [
    { data = {}, loading, error }, refetchUsers,
  ] = useAxios(`/api/users?${qs.stringify({ status, next_page_token: nextPageToken })}`);

  const confirmDelete = async (deleteId) => {
    await axios.delete(`/api/users/${deleteId}?${qs.stringify({ action: 'delete' })}`)
      .then(() => refetchUsers());
  }

  const confirmRemove = async (removeId) => {
    await axios.delete(`/api/users/${removeId}?${qs.stringify({ action: 'disassociate' })}`)
      .then(() => refetchUsers());
  }

  const activeColumns = [
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
      render: (text, row) => (
        <Link to={`/users/${row.id}`}>
          {text}
        </Link>
      ),
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
      sorter: (a, b) => a.last_name.localeCompare(b.last_name),
      render: (text, row) => (
        <Link to={`/users/${row.id}`}>
          {text}
        </Link>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Timezone',
      dataIndex: 'timezone',
      key: 'timezone',
      sorter: (a, b) => a.timezone.localeCompare(b.timezone),
      render: (text) => (text ? <Tag color="blue">{text}</Tag> : ''),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      render: (text) => DateTime.fromISO(text).toLocaleString(DateTime.DATETIME_MED),
    },
    {
      title: removeTooltip,
      align: 'center',
      width: '5%',
      render: (text, row) => (
        <Popconfirm
          title="Are you sure you want to remove this user from the account?"
          onConfirm={() => confirmRemove(row.id)}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          okText="Remove"
          placement="left"
        >
          <MinusCircleOutlined className="table-icon" />
        </Popconfirm>
      ),
    },
    {
      title: deleteTooltip,
      align: 'center',
      width: '5%',
      render: (text, row) => (
        <Popconfirm
          title="Are you sure you want to permanently delete this user?"
          onConfirm={() => confirmDelete(row.id)}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          okText="Delete"
          placement="left"
        >
          <DeleteOutlined className="table-icon" />
        </Popconfirm>
      ),
    }
  ];
  
  const pendingColumns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      render: (text) => DateTime.fromISO(text).toLocaleString(DateTime.DATETIME_MED),
    },
    {
      title: removeTooltip,
      align: 'center',
      width: '5%',
      render: (text, row) => (
        <Popconfirm
          title="Are you sure you want to remove this user from the account?"
          onConfirm={() => confirmRemove(row.id)}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          okText="Remove"
          placement="left"
        >
          <MinusCircleOutlined className="table-icon" />
        </Popconfirm>
      ),
    },
  ];

  if (error) {
    return (
      <Layout className="layout-container">
        <Content className="align-center">
          <Error error={error} />
        </Content>
      </Layout>
    );
  }

  const filteredUsers = (data.users || [])
    .filter(({
      first_name, last_name, email,
    }) => `${first_name} ${last_name}`.toLowerCase().indexOf(query.toLowerCase()) > -1
      || email.toLowerCase().indexOf(query.toLowerCase()) > -1
    );

  return (
    <Layout className="layout-container">
      <Header className="flex-space-between">
        <div className="component-header">
          Users
          <div className="drawer-icon">
            <InfoCircleOutlined onClick={() => setVisible(true)} />
          </div>
        </div>
        <div>
          <Button
            className="add-event"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => push('/users/add')}
          >
            User
          </Button>
          <Tooltip title="Refresh Users">
            <Button
              loading={loading}
              icon={<ReloadOutlined />}
              type="default"
              onClick={refetchUsers}
            />
          </Tooltip>
        </div>
      </Header>
      <Content>
        <Group value={status} onChange={(e) => setStatus(e.target.value)}>
          <Radio value="active">Active</Radio>
          <Radio value="pending">Pending</Radio>
        </Group>
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search Users"
          style={{ marginTop: 20 }}
        />
        <Divider />
        <Table
          columns={status === 'active' ? activeColumns : pendingColumns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={false}
          loading={loading && _.isEmpty(data.users)}
          showSorterTooltip={false}
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
        <h3>Users</h3>
        <hr />
        <ul>
          <li><h4>GET /users</h4></li>
          <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/users/users" target="_blank" rel="noreferrer">
            https://marketplace.zoom.us/docs/api-reference/zoom-api/users/users
          </a>
        </ul>
      </Drawer>
    </Layout>
  );
}
