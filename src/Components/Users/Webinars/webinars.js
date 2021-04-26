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

export default function UserWebinars({ userName, userEmail }) {
  const { userId } = useParams();
  const [gridView, toggleGridView] = useState(false);
  const [query, setQuery] = useState('');

  const [{ data = {}, loading, error }, refetchWebinars] = useAxios(`/api/users/${userId}/webinars`);

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
  }

  return (
    <div className="component-container">
      <div className="flex-space-between">
        <div className="component-header">Webinars</div>
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
      {!error && gridView && <Grid {...componentProps} />}
      {!error && !gridView && <Table {...componentProps} />}
    </div>
  );
}

UserWebinars.propTypes = {
  userName: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
};
