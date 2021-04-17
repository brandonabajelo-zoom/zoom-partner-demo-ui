import React from 'react';
import {
  Table, Badge, Tag, Layout, Button,
} from 'antd';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import useAxios from 'axios-hooks';
import { ReloadOutlined } from '@ant-design/icons';
import Error from './error';

const { Header, Content } = Layout;

const columns = [
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
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: (a, b) => a.status.localeCompare(b.status),
    render: (text) => <Badge status={text === 'active' ? 'success' : 'danger'} text={_.upperFirst(text)} />,
  },
];

export default function UsersList() {
  const [{ data = {}, loading, error }, refetchUsers] = useAxios('/api/users');

  if (error) {
    return (
      <Layout className="layout-container">
        <Content className="align-center">
          <Error error={error} refetch={refetchUsers} />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="layout-container">
      <Header className="header-flex">
        <div>Users</div>
        <Button loading={loading} icon={<ReloadOutlined />} type="default" onClick={refetchUsers} />
      </Header>
      <Content>
        <Table
          columns={columns}
          dataSource={data.users}
          rowKey="id"
          pagination={false}
          loading={loading && !data.users}
        />
      </Content>
    </Layout>
  );
}
