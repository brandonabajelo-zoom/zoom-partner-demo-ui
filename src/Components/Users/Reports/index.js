import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import {
  Table, Tag, Divider, Input, Layout, Tooltip, Button, DatePicker,
} from 'antd';
import { DateTime } from 'luxon';
import moment from 'moment'
import qs from 'query-string';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons';

import Error from '../error';

const { Header, Content } = Layout;
const { RangePicker } = DatePicker;

const apiDateFormat = 'YYYY-MM-DD';

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
    title: 'End Time',
    dataIndex: 'end_time',
    key: 'end_time',
    sorter: (a, b) => a.end_time.localeCompare(b.end_time),
    render: (text, row) => (
      <Tag color="blue">
        {DateTime.fromISO(row.end_time).toLocaleString(DateTime.DATETIME_MED)}
      </Tag>
    ),
  },
  {
    title: 'Participants',
    dataIndex: 'participants_count',
    key: 'participants_count',
    align: 'center',
    sorter: (a, b) => a.participants_count - b.participants_count,
  },
  {
    title: (
      <div>
        Total Time (min)
        <span>
          <Tooltip title="Sum of meeting minutes from all participants in the meeting">
            <InfoCircleOutlined className="table-info" />
          </Tooltip>
        </span>
      </div>
    ),
    dataIndex: 'total_minutes',
    keyIndex: 'total_minutes',
    align: 'center',
    sorter: (a, b) => a.total_minutes - b.total_minutes,
  }
]

export default function Reports() {
  const { userId } = useParams();
  const [query, setQuery] = useState('');
  const [dateRange, setDateRange] = useState([moment().subtract(7, 'd'), moment()]);
  const [{ data = {}, loading, error }, refetch] = useAxios(`/api/users/${userId}/meetings/report?${qs.stringify({
    from: dateRange[0].format(apiDateFormat),
    to: dateRange[1].format(apiDateFormat),
  })}`);

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
        <div>Meeting Reports</div>
        <Tooltip title="Refresh Reports">
          <Button
            loading={loading}
            icon={<ReloadOutlined />}
            type="default"
            onClick={refetch}
          />
        </Tooltip>
      </Header>
      <Content>
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
            placeholder="Search Reports"
          />
        </div>
        <Divider /> 
        <Table
          columns={columns}
          loading={loading && _.isEmpty(data.meetings)}
          dataSource={data.meetings}
          rowKey="uuid"
          pagination={false}
          showSorterTooltip={false}
        />
      </Content>
    </Layout>
  )
}