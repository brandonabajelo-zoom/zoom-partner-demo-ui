import React from 'react';
import PropTypes from 'prop-types';
import { Table, Tag, Popconfirm, Button } from 'antd';
import { useHistory, Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import _ from 'lodash';
import qs from 'query-string';
import {
  QuestionCircleOutlined, DeleteOutlined, SettingOutlined, VideoCameraOutlined,
  RightOutlined,
} from '@ant-design/icons';

export default function WebinarTable({
  data, userId, userName, loading, confirmDelete, userEmail,
  showPagination, setNextPageToken,
}) {
  const { push } = useHistory();

  const columns = [
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
      sorter: (a, b) => a.topic.localeCompare(b.topic),
      render: (text, row) => (
        <Link to={`/users/${userId}/webinars/${row.id}`}>
          {text}
        </Link>
      ),
    },
    {
      title: 'Webinar ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      render: (text, row) => <Tag color="purple">{row.id}</Tag>,
    },
    {
      title: 'Start Time',
      dataIndex: 'start_time',
      key: 'start_time',
      sorter: (a, b) => a.start_time.localeCompare(b.start_time),
      render: (text, row) => (
        <Tag color="blue">
          {DateTime.fromISO(row.start_time, { zone: row.timezone }).toLocaleString(DateTime.DATETIME_MED)}
        </Tag>
      ),
    },
    {
      title: 'Timezone',
      dataIndex: 'timezone',
      key: 'timezone',
      sorter: (a, b) => a.timezone.localeCompare(b.timezone),
      render: (text) => (text ? <Tag color="blue">{text}</Tag> : ''),
    },
    {
      title: '',
      align: 'center',
      width: '5%',
      render: (text, row) => DateTime.fromISO(row.start_time, { zone: row.timezone }).plus({ minutes: row.duration }) > DateTime.now({ zone: row.timezone })
        ? (
          <VideoCameraOutlined
            className="table-icon"
            // To initiate the Web SDK, we pass the required data as URL parameters
            onClick={() => push(`/websdk?${qs.stringify({ meetingNumber: row.id, userId, userName, userEmail })}`)}
          />
      ) : <Tag>Expired</Tag>,
    },
    {
      title: '',
      align: 'center',
      width: '5%',
      render: (text, row) => (
        <SettingOutlined
          className="table-icon"
          onClick={() => push(`/users/${userId}/webinars/${row.id}`)}
        />
      ),
    },
    {
      title: '',
      align: 'center',
      width: '5%',
      render: (text, row) => (
        <Popconfirm
          title="Are you sure you want to delete this webinar?"
          onConfirm={() => confirmDelete(row.id)}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          okText="Delete"
          placement="left"
        >
          <DeleteOutlined className="table-icon" />
        </Popconfirm>
      )
    }
  ]

  return (
    <>
      <Table
        columns={columns}
        dataSource={data.webinars}
        loading={loading && _.isEmpty(data.webinars)}
        rowKey="id"
        pagination={false}
        showSorterTooltip={false}
      />
      {showPagination && (
        <div className="pagination-btn">
          <Button
            onClick={() => setNextPageToken(data.next_page_token)}
            size="small" icon={<RightOutlined />}
          />
        </div>
      )}
    </>
  )
}

WebinarTable.propTypes = {
  data: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  confirmDelete: PropTypes.func.isRequired,
}