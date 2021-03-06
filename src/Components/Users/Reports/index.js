import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import {
  Table, Tag, Divider, Input, Layout, Tooltip, Button, DatePicker, Drawer,
} from 'antd';
import { DateTime } from 'luxon';
import moment from 'moment'
import qs from 'query-string';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { ReloadOutlined, InfoCircleOutlined, RightOutlined } from '@ant-design/icons';

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
];

/**
 * View meeting reports for a specific user id
 */
export default function Reports() {
  const { userId } = useParams();
  const [nextPageToken, setNextPageToken] = useState('');
  const [query, setQuery] = useState('');
  const [drawerVisible, setVisible] = useState(false);
  const [dateRange, setDateRange] = useState([moment().subtract(7, 'd'), moment()]);

  const [{ data = {}, loading, error }, refetch] = useAxios(`/api/users/${userId}/meetings/report?${qs.stringify(_.pickBy({
    from: dateRange[0].format(apiDateFormat),
    to: dateRange[1].format(apiDateFormat),
    next_page_token: nextPageToken
  }))}`);

  return (
    <Layout className="layout-container edit">
      <Header className="header-flex">
        <div>
          Reports
          <span className="drawer-icon">
            <InfoCircleOutlined onClick={() => setVisible(true)} />
          </span>
        </div>
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
        {error && <Error error={error} />}
        {!error && (
          <>
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
              dataSource={(data.meetings || [])
                .filter(({ topic }) => topic.toLowerCase().indexOf(query.toLowerCase()) > -1)}
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
        )}
      </Content>
      <Drawer
        title="Zoom APIs -- https://api.zoom.us/v2"
        closable={false}
        onClose={() => setVisible(false)}
        visible={drawerVisible}
        width={400}
      >
        <h3>Reports</h3>
        <hr />
        <ul>
          <li><h4>GET /report/users/:userId/meetings</h4></li>
          <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/reports/reportmeetings" target="_blank" rel="noreferrer">
            https://marketplace.zoom.us/docs/api-reference/zoom-api/reports/reportmeetings
          </a>
        </ul>
      </Drawer>
    </Layout>
  );
}