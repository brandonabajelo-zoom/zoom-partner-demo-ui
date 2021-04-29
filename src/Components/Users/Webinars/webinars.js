import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useAxios from 'axios-hooks';
import axios from 'axios';
import { Button, Tooltip, Divider, Input, Drawer } from 'antd';
import _ from 'lodash';
import qs from 'query-string';
import { Link, useParams } from 'react-router-dom';
import { ReloadOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';

import Table from './table';
import Error from '../error';

export default function UserWebinars({ userName, userEmail }) {
  const { userId } = useParams();
  const [nextPageToken, setNextPageToken] = useState('');
  const [query, setQuery] = useState('');
  const [drawerVisible, setVisible] = useState(false);

  const [
    { data = {}, loading, error }, refetchWebinars,
  ] = useAxios(`/api/users/${userId}/webinars?${qs.stringify(_.pickBy({ next_page_token: nextPageToken }))}`);

  const confirmDelete = async (webinarId) => {
    await axios.delete(`/api/webinars/${webinarId}`).then(() => refetchWebinars());
  };

  const filteredData = (() => {
    const { webinars = [], ...rest } = data || {};
    return {
      webinars: webinars.filter(({ topic }) => topic.toLowerCase().indexOf(query.toLowerCase()) > -1),
      ...rest,
    }
  })();

  const componentProps = {
    data: filteredData,
    userName,
    confirmDelete,
    loading,
    userId,
    userEmail,
    setNextPageToken,
    showPagination: data.page_size < data.total_records,
  }

  return (
    <div className="component-container">
      <div className="flex-space-between">
        <div className="component-header">
          Webinars
          <span className="drawer-icon">
            <InfoCircleOutlined onClick={() => setVisible(true)} />
          </span>
        </div>
        <div>
          <Link to={`/users/${userId}/new_webinar`}>
            <Button
              className="add-event"
              icon={<PlusOutlined />}
              type="primary"
            >
              Webinar
            </Button>
          </Link>
          <Tooltip title="Refresh Webinars">
            <Button
              loading={loading}
              icon={<ReloadOutlined />}
              type="default"
              onClick={refetchWebinars}
            />
          </Tooltip>
        </div>
      </div>
      {error && <Error error={error} />}
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
      {!error && <Table {...componentProps} />}
      <Drawer
        title="Zoom APIs -- https://api.zoom.us/v2"
        closable={false}
        onClose={() => setVisible(false)}
        visible={drawerVisible}
        width={400}
      >
        <h3>Webinars</h3>
        <hr />
        <ul>
          <li><h4>GET /users/:userId/webinars</h4></li>
          <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinars" target="_blank" rel="noreferrer">
            https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinars
          </a>
        </ul>
      </Drawer>
    </div>
  );
}

UserWebinars.propTypes = {
  userName: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
};
