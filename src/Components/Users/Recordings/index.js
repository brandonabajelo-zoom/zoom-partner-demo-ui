import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import {
  Table, Tag, Divider, Input, DatePicker, Button,
  Tooltip, Drawer, Popconfirm,
} from 'antd';
import { DateTime } from 'luxon';
import moment from 'moment'
import axios from 'axios';
import _ from 'lodash';
import qs from 'query-string';
import { useParams } from 'react-router-dom';
import {
  PlayCircleOutlined, RightOutlined, ReloadOutlined, InfoCircleOutlined,
  DeleteOutlined, QuestionCircleOutlined,
} from '@ant-design/icons';

import Error from '../error';

const { RangePicker } = DatePicker;

const apiDateFormat = 'YYYY-MM-DD';

/**
 * View cloud recordings of meetings and webinars
 */
export default function Recordings() {
  const { userId } = useParams();
  const [nextPageToken, setNextPageToken] = useState('');
  const [query, setQuery] = useState('');
  const [drawerVisible, setVisible] = useState(false);
  const [dateRange, setDateRange] = useState([moment().subtract(7, 'd'), moment()]);

  const [{ data = {}, loading, error }, refetch] = useAxios(`/api/users/${userId}/recordings?${qs.stringify(_.pickBy({
    from: dateRange[0].format(apiDateFormat),
    to: dateRange[1].format(apiDateFormat),
    next_page_token: nextPageToken
  }))}`);

  const confirmDelete = async (deleteId) => {
    await axios.delete(`/api/meetings/${encodeURIComponent(encodeURIComponent(deleteId))}/recordings?${qs.stringify({
      action: 'delete',
    })}`)
    .then(() => refetch());
  }

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
    },
    {
      title: '',
      align: 'center',
      width: '5%',
      render: (text, row) => (
        <Popconfirm
          title="Are you sure you want to permanently delete this recording?"
          onConfirm={() => confirmDelete(row.uuid)}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          okText="Delete"
          placement="left"
        >
          <DeleteOutlined className="table-icon" />
        </Popconfirm>
      ),
    }
  ];

  return (
    <div className="component-container">
      <div className="flex-space-between">
        <div className="component-header">
          Cloud Recordings
          <span className="drawer-icon">
            <InfoCircleOutlined onClick={() => setVisible(true)} />
          </span>
        </div>
        <Tooltip title="Refresh Recordings">
          <Button
            loading={loading}
            icon={<ReloadOutlined />}
            type="default"
            onClick={refetch}
          />
        </Tooltip>
      </div>
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
      <Drawer
        title="Zoom APIs -- https://api.zoom.us/v2"
        closable={false}
        onClose={() => setVisible(false)}
        visible={drawerVisible}
        width={400}
      >
        <h3>Cloud Recordings</h3>
        <hr />
        <ul>
          <li><h4>GET /users/:userId/recordings</h4></li>
          <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/cloud-recording/recordingslist" target="_blank" rel="noreferrer">
            https://marketplace.zoom.us/docs/api-reference/zoom-api/cloud-recording/recordingslist
          </a>
          <hr />
          <li><h4>DELETE /meetings/:meetingId/recordings</h4></li>
          <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/cloud-recording/recordingdelete" target="_blank" rel="noreferrer">
            https://marketplace.zoom.us/docs/api-reference/zoom-api/cloud-recording/recordingdelete
          </a>
        </ul>
      </Drawer>
    </div>
  );
}