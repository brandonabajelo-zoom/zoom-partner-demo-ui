import React from 'react';
import PropTypes from 'prop-types';
import useAxios from 'axios-hooks';
import axios from 'axios';
import {
  Card, Tag, Button, Tooltip, Popconfirm,
} from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { DateTime } from 'luxon';
import {
  QuestionCircleOutlined, ReloadOutlined, PlusOutlined,
  DeleteOutlined, SettingOutlined, VideoCameraOutlined,
} from '@ant-design/icons';

const renderId = (id) => (
  <p className="card-field">
    Meeting ID:
    <Tag color="purple">{id}</Tag>
  </p>
);

const renderStartTime = (time) => (
  <p className="card-field">
    Start Time:
    <Tag color="blue">{DateTime.fromISO(time).toLocaleString(DateTime.DATETIME_MED)}</Tag>
  </p>
);

export default function UserMeetings({ userId, websdkPath }) {
  const { push } = useHistory();
  const [{ data = {}, loading, error }, refetch] = useAxios(
    { url: `/api/users/${userId}/meetings` },
  );

  const confirmDelete = async (meetingId) => {
    await axios.delete(`/api/meetings/${meetingId}`).then(() => refetch());
  };

  return (
    <div className="component-container">
      <div className="flex-space-between">
        <div className="component-header">Meetings</div>
        <div>
          <Link to={`/users/${userId}/new_meeting`}>
            <Button className="add-event" icon={<PlusOutlined />} type="primary">
              Meeting
            </Button>
          </Link>
          <Tooltip title="Refresh Meetings">
            <Button loading={loading} icon={<ReloadOutlined />} type="default" onClick={refetch} />
          </Tooltip>
        </div>
      </div>
      {error && (
        <div style={{ textAlign: 'center' }}>
          <h1>Error fetching meetings</h1>
        </div>
      )}
      {!error && !loading && !(data.meetings || []).length && (
        <div style={{ textAlign: 'center' }}>
          <h1>No meetings found</h1>
        </div>
      )}
      {!error && (
        <div className="card-container">
          {(data.meetings || []).map(({
            uuid, topic, id, start_time,
          }) => (
            <Card
              style={{ width: '20%' }}
              key={uuid}
              loading={loading && !data}
              title={topic}
              hoverable
              actions={[
                <VideoCameraOutlined onClick={() => push(websdkPath)} />,
                <SettingOutlined onClick={() => push(`/users/${userId}/meetings/${id}`)} />,
                <Popconfirm
                  title="Are you sure you want to delete this meeting?"
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
      )}
    </div>
  );
}

UserMeetings.propTypes = {
  userId: PropTypes.string.isRequired,
  websdkPath: PropTypes.string.isRequired,
};
