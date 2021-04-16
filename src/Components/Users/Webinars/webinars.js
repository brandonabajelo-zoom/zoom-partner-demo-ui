import React from 'react';
import PropTypes from 'prop-types';
import useAxios from 'axios-hooks';
import axios from 'axios';
import {
  Card, Tag, Button, Tooltip, Popconfirm,
} from 'antd';
import { DateTime } from 'luxon';
import { Link, useHistory } from 'react-router-dom';
import {
  QuestionCircleOutlined, ReloadOutlined, PlusOutlined,
  DeleteOutlined, SettingOutlined, VideoCameraOutlined,
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

export default function UserWebinars({ userId, websdkPath }) {
  const { push } = useHistory();
  const [{ data = {}, loading, error }, refetchWebinars] = useAxios({ url: `/api/users/${userId}/webinars` });

  const confirmDelete = async (webinarId) => {
    await axios.delete(`/api/webinars/${webinarId}`).then(() => refetchWebinars());
  };

  return (
    <div className="component-container">
      <div className="flex-space-between">
        <div className="component-header">Webinars</div>
        <div>
          <Link to={`/users/${userId}/new_webinar`}>
            <Button className="add-event" icon={<PlusOutlined />} type="primary">
              Webinar
            </Button>
          </Link>
          <Tooltip title="Refresh Webinars">
            <Button loading={loading} icon={<ReloadOutlined />} type="default" onClick={refetchWebinars} />
          </Tooltip>
        </div>
      </div>
      {error && !loading && (
        <div style={{ textAlign: 'center' }}>
          <h1>Error fetching webinars</h1>
        </div>
      )}
      {!error && !loading && !(data.webinars || []).length && (
        <div style={{ textAlign: 'center' }}>
          <h1>No webinars found</h1>
        </div>
      )}
      {!error && (
        <div className="card-container">
          {(data.webinars || []).map(({
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
      )}
    </div>
  );
}

UserWebinars.propTypes = {
  userId: PropTypes.string.isRequired,
};
