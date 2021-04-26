import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import _ from 'lodash';
import {
  List, Layout, Tooltip, Button, Input, Divider, Tag,
} from 'antd';
import { UserOutlined, ReloadOutlined, FieldTimeOutlined } from '@ant-design/icons';

import Error from '../error';

const { Header, Content } = Layout;
const { Item } = List;

export default function Participants() {
  const { webinarId } = useParams();
  const [query, setQuery] = useState('')

  const [{ data = {}, loading, error }, refetch] = useAxios(`/api/webinars/report/${webinarId}/participants`);

  if (error ) {
    return (
      <Layout className="layout-container">
        <Content className="align-center">
          <Error error={error} />
        </Content>
      </Layout>
    );
  }

  const uniqueParticipants = (_.uniqBy(data.participants, 'id') || [])
    .filter(({ name }) => name.toLowerCase().indexOf(query.toLowerCase()) > -1);

  return (
    <Layout className="layout-container edit">
      <Header className="header-flex">
        <div>{`Participants (${uniqueParticipants.length})`}</div>
        <Tooltip title="Refresh Participants">
          <Button
            loading={loading}
            icon={<ReloadOutlined />}
            type="default"
            onClick={refetch}
          />
        </Tooltip>
      </Header>
      <Content>
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search Participants"
        />
        <Divider />
        <List
          itemLayout="horizontal"
          className="participant-list"
          loading={(loading && _.isEmpty(uniqueParticipants))}
          dataSource={uniqueParticipants}
          rowKey="id"
          header={(
            <div className="flex-end">
              <Tag icon={<FieldTimeOutlined />} color="blue">
                Time Spent (hh:mm:ss)
              </Tag>
            </div>
          )}
          renderItem={({ name, user_email, join_time, leave_time, duration }) => (
            <Item>
              <Item.Meta
                avatar={<UserOutlined />}
                title={name}
                description={user_email || 'n/a'}
              />
              <div style={{ marginRight: 20 }}>
                {`
                ${DateTime.fromISO(join_time).toLocaleString(DateTime.DATETIME_MED)}
                -
                ${DateTime.fromISO(leave_time).toLocaleString(DateTime.DATETIME_MED)}
                `}
              </div>
              <div>
                <Tag style={{ fontSize: 14 }} color="blue">
                  {new Date(duration * 1000).toISOString().substr(11, 8)}
                </Tag>
              </div>
            </Item>
          )}
        />
      </Content>
    </Layout>
  );
}
