import React, { useState, useEffect } from 'react';
import { Table, Layout, Tag } from 'antd';
import qs from 'query-string';
import { DateTime } from 'luxon';
import useAxios from 'axios-hooks';
import _ from 'lodash';
import { CheckOutlined, MinusOutlined } from '@ant-design/icons';

import Error from '../Users/error';

const { Content } = Layout;

const renderField = (text) => (text
  ? <CheckOutlined style={{ color: '#2D8CFF' }} />
  : <MinusOutlined />
);

const columns = [
  {
    title: 'Topic',
    dataIndex: 'topic',
    key: 'topic',
  },
  {
    title: 'Host',
    dataIndex: 'host',
    key: 'host',
  },
  {
    title: 'Start Time',
    dataIndex: 'start_time',
    key: 'start_time',
    render: (text, row) => (
      <Tag color="blue">
        {DateTime.fromISO(row.start_time).toLocaleString(DateTime.DATETIME_MED)}
      </Tag>
    ),
  },
  {
    title: 'Participants',
    dataIndex: 'participants',
    key: 'participants',
    align: 'center',
  },
  {
    title: 'Video',
    dataIndex: 'has_video',
    key: 'has_video',
    align: 'center',
    render: renderField,
  },
  {
    title: 'Screenshare',
    dataIndex: 'has_screen_share',
    key: 'has_screen_share',
    align: 'center',
    render: renderField,
  },
  {
    title: 'Recording',
    dataIndex: 'has_recording',
    key: 'has_recording',
    align: 'center',
    render: renderField,
  },
  {
    title: 'VoIP',
    dataIndex: 'has_voip',
    key: 'has_voip',
    align: 'center',
    render: renderField,
  },
  {
    title: 'PSTN',
    dataIndex: 'has_pstn',
    key: 'has_pstn',
    align: 'center',
    render: renderField,
  },
  {
    title: 'SIP',
    dataIndex: 'has_sip',
    key: 'has_sip',
    align: 'center',
    render: renderField,
  },
  {
    title: '3rd Party Audio',
    dataIndex: 'has_3rd_party_audio',
    key: 'has_3rd_party_audio',
    align: 'center',
    render: renderField,
  },
]

export default function DashboardMeetings() {
  const [count, setCount] = useState(0);
  const [{ data = {}, loading, error }] = useAxios(`/api/dashboard/metrics/webinars?${qs.stringify({
    type: 'live', count,
  })}`)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 20000);
    return () => clearInterval(interval);
  }, [count]);

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
    <Table
      columns={columns}
      dataSource={data.webinars}
      loading={loading && _.isEmpty(data.webinars)}
      rowKey="uuid"
      pagination={false}
      showSorterTooltip={false}
    />
  );
}