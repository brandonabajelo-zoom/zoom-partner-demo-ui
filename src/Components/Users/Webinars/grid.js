import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, Tag, Popconfirm,
} from 'antd';
import { useHistory } from 'react-router-dom';
import { DateTime } from 'luxon';
import qs from 'query-string';
import {
  QuestionCircleOutlined, DeleteOutlined, SettingOutlined, VideoCameraOutlined,
} from '@ant-design/icons';

const renderId = (id) => (
  <p className="card-field">
    Webinar ID:
    <Tag color="purple">{id}</Tag>
  </p>
);

const renderStartTime = (time) => (
  <p className="card-field">
    Start Time:
    <Tag color="blue">{DateTime.fromISO(time).toLocaleString(DateTime.DATETIME_MED)}</Tag>
  </p>
);

export default function WebinarGrid({
  data, userId, loading, confirmDelete, userName, userEmail,
}) {
  const { push } = useHistory();
  return (
    <div className="card-container">
      {(data.webinars || []).map(({
        uuid, topic, id, start_time, duration,
      }) => (
        <Card
          style={{ width: '20%' }}
          key={uuid}
          loading={loading && !data}
          title={topic}
          hoverable
          actions={[
            DateTime.fromISO(start_time).plus({ minutes: duration }) > DateTime.now()
              ? <VideoCameraOutlined
                  onClick={() => push(`/websdk?${qs.stringify({ meetingNumber: id, userId, userName, userEmail })}`)}
                />
              : <Tag>Expired</Tag>,
            <SettingOutlined onClick={() => push(`/users/${userId}/webinars/${id}`)} />,
            <Popconfirm
              title="Are you sure you want to delete this webinar?"
              onConfirm={() => confirmDelete(id)}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              okText="Delete"
            >
              <DeleteOutlined />
            </Popconfirm>,
          ]}
        >
          {!!id && renderId(id)}
          {!!start_time && renderStartTime(start_time)}
        </Card>
      ))}
    </div>
  )
}

WebinarGrid.propTypes = {
  data: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  confirmDelete: PropTypes.func.isRequired,
}