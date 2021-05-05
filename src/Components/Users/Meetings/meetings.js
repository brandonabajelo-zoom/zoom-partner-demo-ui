import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useAxios from 'axios-hooks';
import axios from 'axios';
import qs from 'query-string';
import _ from 'lodash';
import { Button, Tooltip, Divider, Input, Drawer } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { ReloadOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';

import Table from './table';
import Error from '../error';

export default function UserMeetings({ userName }) {
  const { userId } = useParams();
  const [nextPageToken, setNextPageToken] = useState('');
  const [drawerVisible, setVisible] = useState(false);
  const [query, setQuery] = useState('');

  const [{ data = {}, loading, error }, refetch] = useAxios(
    { url: `/api/users/${userId}/meetings?${qs.stringify(_.pickBy({ next_page_token: nextPageToken }))}` },
  );

  const confirmDelete = async (meetingId) => {
    await axios.delete(`/api/meetings/${meetingId}`).then(() => refetch());
  };

  /**
   * For the purposes of this demo, only type: 2 scheduled meetings will be shown
   */
  const filteredData = (() => {
    const { meetings = [], ...rest } = data || {};
    return {
      meetings: meetings.filter(({ topic, type }) => topic.toLowerCase().indexOf(query.toLowerCase()) > -1 && type === 2),
      ...rest,
    }
  })();

  const tableProps = {
    data: filteredData,
    userName,
    confirmDelete,
    loading,
    userId,
    setNextPageToken,
    showPagination: data.page_size < data.total_records,
  };

  return (
    <div className="component-container">
      <div className="flex-space-between">
        <div className="component-header">
          Meetings
          <span className="drawer-icon">
            <InfoCircleOutlined onClick={() => setVisible(true)} />
          </span>
        </div>
        <div>
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
          <Table {...tableProps} />
        </>
      )}
      <Drawer
        title="Zoom APIs -- https://api.zoom.us/v2"
        closable={false}
        onClose={() => setVisible(false)}
        visible={drawerVisible}
        width={400}
      >
        <h3>Meetings</h3>
        <hr />
        <ul>
          <li><h4>GET /users/:userId/meetings</h4></li>
          <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetings" target="_blank" rel="noreferrer">
            https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetings
          </a>
          <hr />
          <div>
            <small>*For the purposes of this demo, only <b>type: 2</b> scheduled meeetings will be shown</small>
          </div>
        </ul>
      </Drawer>
    </div>
  );
}

UserMeetings.propTypes = {
  userName: PropTypes.string.isRequired,
};
