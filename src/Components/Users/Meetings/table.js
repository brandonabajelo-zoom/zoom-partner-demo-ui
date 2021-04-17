import React from 'react';
import PropTypes from 'prop-types';
import { Table, Tag, Popconfirm } from 'antd';
import { useHistory } from 'react-router-dom';
import { DateTime } from 'luxon';
import _ from 'lodash';
import qs from 'query-string';
import {
  QuestionCircleOutlined, DeleteOutlined, SettingOutlined, VideoCameraOutlined,
} from '@ant-design/icons';

export default function MeetingTable({
  data, userId, loading, confirmDelete, userName,
}) {
  const { push } = useHistory();
  const columns = [
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
      sorter: (a, b) => a.topic.localeCompare(b.topic),
    },
    {
      title: 'Meeting ID',
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
          {DateTime.fromISO(row.start_time).toLocaleString(DateTime.DATETIME_MED)}
        </Tag>
      ),
    },
    {
      title: '',
      align: 'center',
      width: '5%',
      render: (text, row) => (
        <VideoCameraOutlined
          className="table-icon"
          onClick={() => push(`/websdk?${qs.stringify({ meetingNumber: row.id, userId, userName })}`)}
        />
      ),
    },
    {
      title: '',
      align: 'center',
      width: '5%',
      render: (text, row) => (
        <SettingOutlined
          className="table-icon"
          onClick={() => push(`/users/${userId}/meetings/${row.id}`)}
        />
      ),
    },
    {
      title: '',
      align: 'center',
      width: '5%',
      render: (text, row) => (
        <Popconfirm
          title="Are you sure you want to delete this meeting?"
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
    <Table
      columns={columns}
      dataSource={data.meetings}
      loading={loading && _.isEmpty(data.meetings)}
      rowKey="id"
      pagination={false}
    />
  )
}

MeetingTable.propTypes = {
  data: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  confirmDelete: PropTypes.func.isRequired,
}