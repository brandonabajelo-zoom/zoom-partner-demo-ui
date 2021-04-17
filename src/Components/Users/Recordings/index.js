import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import { Table, Tag, Divider, Input } from 'antd';
import { DateTime } from 'luxon';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { PlayCircleOutlined } from '@ant-design/icons';

import Error from '../error';

export default function Recordings() {
  const { userId } = useParams();
  const [query, setQuery] = useState('');
  const [{ data = {}, loading, error }, refetch] = useAxios(`/api/users/${userId}/recordings`);

  const columns = [
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
      sorter: (a, b) => a.topic.localeCompare(b.topic),
    },
    {
      title: 'Start Time',
      dataIndex: 'start_time',
      key: 'start_time',
      sorter: (a, b) => a.start_time.localeCompare(b.start_time),
      render: (text, row) => (
        <Tag color="blue">
          {DateTime.fromISO(row.start_time).toLocaleString(DateTime.DATETIME_MED)}
        </Tag>
      ),
    },
    {
      title: '',
      dataIndex: 'share_url',
      key: 'share_url',
      render: (text, row) => (
        <a href={row.share_url} target="_blank" rel="noreferrer">
          <PlayCircleOutlined className="table-icon" />
        </a>
      ),
    }
  ]

  if (error) {
    return <Error error={error} refetch={refetch} />
  }

  return (
    <div className="component-container">
      <div className="component-header">
        Cloud Recordings
      </div>
      <Input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search Recordings"
      />
      <Divider />
      <Table
        columns={columns}
        dataSource={(data.meetings || []).filter(({ topic }) => topic.toLowerCase().indexOf(query.toLowerCase()) > -1)}
        rowKey="id"
        pagination={false}
        loading={loading && _.isEmpty(data.meetings)}
      />
    </div>
  );
}