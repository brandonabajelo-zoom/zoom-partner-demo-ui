import React, { useState, useEffect } from 'react';
import { Table, Layout, Tag, Button } from 'antd';
import qs from 'query-string';
import { DateTime } from 'luxon';
import useAxios from 'axios-hooks';
import _ from 'lodash';
import { CheckOutlined, MinusOutlined, RightOutlined } from '@ant-design/icons';

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
    title: 'PSTN',
    dataIndex: 'has_pstn',
    key: 'has_pstn',
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
  {
    title: 'Zoom Room Participants',
    dataIndex: 'in_room_participants',
    key: 'in_room_participants',
    align: 'center',
    render: (text) => text || 0,
  }
]

export default function DashboardMeetings() {
  const [count, setCount] = useState(0);
  const [nextPageToken, setNextPageToken] = useState('');
  const [{ data = {}, loading, error }] = useAxios(`/api/dashboard/metrics/meetings?${qs.stringify({
    type: 'live', count,  next_page_token: nextPageToken
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
    <>
      <Table
        columns={columns}
        dataSource={data.meetings}
        loading={loading && _.isEmpty(data.meetings)}
        rowKey="uuid"
        pagination={false}
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
    </>
  );
}