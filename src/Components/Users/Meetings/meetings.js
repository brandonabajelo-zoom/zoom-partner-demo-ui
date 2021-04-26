import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useAxios from 'axios-hooks';
import axios from 'axios';
import { Button, Tooltip, Divider, Input } from 'antd';
import { Link, useParams } from 'react-router-dom';
import {
  ReloadOutlined, PlusOutlined, AppstoreOutlined, BarsOutlined,
} from '@ant-design/icons';

import Grid from './grid';
import Table from './table';
import Error from '../error';

export default function UserMeetings({ userName }) {
  const { userId } = useParams();
  const [gridView, toggleGridView] = useState(false);
  const [query, setQuery] = useState('');

  const [{ data = {}, loading, error }, refetch] = useAxios(
    { url: `/api/users/${userId}/meetings` },
  );

  const confirmDelete = async (meetingId) => {
    await axios.delete(`/api/meetings/${meetingId}`).then(() => refetch());
  };

  const filteredData = (() => {
    const { meetings = [], ...rest } = data || {};
    return {
      meetings: meetings.filter(({ topic }) => topic.toLowerCase().indexOf(query.toLowerCase()) > -1),
      ...rest,
    }
  })();

  const componentProps = {
    data: filteredData,
    userName,
    confirmDelete,
    loading,
    userId,
  };

  return (
    <div className="component-container">
      <div className="flex-space-between">
        <div className="component-header">
          Meetings
        </div>
        <div>
          <Tooltip title="Table View">
            <Button
              icon={<BarsOutlined />}
              type={!gridView ? 'primary' : 'default'}
              onClick={() => toggleGridView(false)}
            />
          </Tooltip>
          <Tooltip title="Grid View">
            <Button
              className="add-event"
              icon={<AppstoreOutlined />}
              type={gridView ? 'primary' : 'default'}
              onClick={() => toggleGridView(true)}
            />
          </Tooltip>
          <Link to={`/users/${userId}/new_meeting`}>
            <Button
              className="add-event"
              icon={<PlusOutlined />}
              type="primary"
            >
              Meeting
            </Button>
          </Link>
          <Tooltip title="Refresh Meetings">
            <Button
              loading={loading}
              icon={<ReloadOutlined />}
              type="default"
              onClick={refetch}
            />
          </Tooltip>
        </div>
      </div>
      {error &&  <Error error={error} />}
      {!error && (
        <>
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Topics"
          />
          <Divider />
        </>
      )}
      {!error && gridView && <Grid {...componentProps} />}
      {!error && !gridView && <Table {...componentProps} />}
    </div>
  );
}

UserMeetings.propTypes = {
  userName: PropTypes.string.isRequired,
};
