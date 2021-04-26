import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import {
  Table, Tag, Divider, Input, DatePicker,
} from 'antd';
import { DateTime } from 'luxon';
import moment from 'moment'
import _ from 'lodash';
import qs from 'query-string';
import { useParams } from 'react-router-dom';
import { PlayCircleOutlined } from '@ant-design/icons';

import Error from '../error';

const { RangePicker } = DatePicker;

const apiDateFormat = 'YYYY-MM-DD';

export default function Recordings() {
  const { userId } = useParams();
  const [query, setQuery] = useState('');
  const [dateRange, setDateRange] = useState([moment().subtract(7, 'd'), moment()]);
  const [{ data = {}, loading, error }] = useAxios(`/api/users/${userId}/recordings?${qs.stringify({
    from: dateRange[0].format(apiDateFormat),
    to: dateRange[1].format(apiDateFormat),
  })}`);

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
    return <Error error={error} />
  }

  return (
    <div className="component-container">
      <div className="component-header">
        Cloud Recordings
      </div>
      <div className="flex-space-between">
        <RangePicker
          value={dateRange}
          format={apiDateFormat}
          onChange={dates => setDateRange(dates)}
          style={{ marginRight: 10, width: '30%' }}
        />
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search Recordings"
        />
      </div>
      <Divider />
      <Table
        columns={columns}
        dataSource={(data.meetings || [])
          .filter(({ topic }) => topic.toLowerCase().indexOf(query.toLowerCase()) > -1)}
        rowKey="uuid"
        pagination={false}
        loading={loading && _.isEmpty(data.meetings)}
        showSorterTooltip={false}
      />
    </div>
  );
}