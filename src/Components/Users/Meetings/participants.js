import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import { DateTime } from 'luxon';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import qs from 'query-string';
import {
  List, Layout, Tooltip, Button, Input, Divider, Tag, Drawer,
} from 'antd';
import {
  UserOutlined, ReloadOutlined, FieldTimeOutlined, RightOutlined,
  InfoCircleOutlined, ExperimentOutlined,
} from '@ant-design/icons';

import QoS from './qos';
import Error from '../error';

const { Header, Content } = Layout;
const { Item } = List;

/**
 * View participants for past meeting
 */
export default function Participants() {
  const { meetingId } = useParams();
  const [nextPageToken, setNextPageToken] = useState('');
  const [qosId, setQosId] = useState('');
  const [drawerVisible, setVisible] = useState(false);
  const [query, setQuery] = useState('')

  const [
    { data = {}, loading, error }, refetch,
  ] = useAxios(`/api/meetings/report/${meetingId}/participants?${qs.stringify(_.pickBy({ next_page_token: nextPageToken }))}`);

  if (error) {
    return (
      <Layout className="layout-container">
        <Content className="align-center">
          <Error error={error} />
        </Content>
      </Layout>
    );
  }

  const uniqueParticipants = (_.uniqBy(data.participants, 'user_id') || [])
    .filter(({ name }) => name.toLowerCase().indexOf(query.toLowerCase()) > -1);

  return (
    <Layout className="layout-container edit">
      <Header className="header-flex">
        <div>
          {`Participants (${_.uniqBy(data.participants, 'id').length})`}
          <span className="drawer-icon">
            <InfoCircleOutlined onClick={() => setVisible(true)} />
          </span>
        </div>
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
          rowKey="user_id"
          header={(
            <div className="flex-end">
              <Tag icon={<FieldTimeOutlined />} color="blue">
                Time Spent (hh:mm:ss)
              </Tag>
            </div>
          )}
          renderItem={({ name, user_email, join_time, leave_time, duration, user_id }) => (
            <>
              <Item>
                <Item.Meta
                  avatar={<UserOutlined />}
                  title={(
                    <div className="qos-flex">
                      <div>{name}</div>
                      <Tooltip title="Metrics">
                        <ExperimentOutlined
                          className={qosId === user_id && 'selected'}
                          onClick={() => setQosId(qosId === user_id ? '' : user_id)}
                        />
                      </Tooltip>
                    </div>
                  )}
                  description={user_email || 'n/a'}
                />
                <Tag style={{ marginRight: 20 }}>
                  {`
                  ${DateTime.fromISO(join_time).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}
                  -
                  ${DateTime.fromISO(leave_time).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}
                  `}
                </Tag>
                <div>
                  <Tag style={{ fontSize: 14 }} color="blue">
                    {new Date(duration * 1000).toISOString().substr(11, 8)}
                  </Tag>
                </div>
              </Item>
              {qosId === user_id && <QoS meetingId={meetingId} participantId={user_id} />}
            </>
          )}
        />
        {data.page_size < data.total_records && (
          <div className="pagination-btn">
            <Button
              onClick={() => setNextPageToken(data.next_page_token)}
              size="small" icon={<RightOutlined />}
            />
          </div> 
        )}
      </Content>
      <Drawer
        title="Zoom APIs -- https://api.zoom.us/v2"
        closable={false}
        onClose={() => setVisible(false)}
        visible={drawerVisible}
        width={400}
      >
        <h3>Reports</h3>
        <hr />
        <ul>
          <li><h4>GET /report/meetings/:meetingId/participants</h4></li>
          <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/pastmeetingparticipants" target="_blank" rel="noreferrer">
            https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/pastmeetingparticipants
          </a>
        </ul>
        <h3>Metrics</h3>
        <hr />
        <ul>
          <li><h4>GET /metrics/meetings/:meetingId/participants/:participantId/qos</h4></li>
          <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/dashboards/dashboardmeetingparticipantqos" target="_blank" rel="noreferrer">
            https://marketplace.zoom.us/docs/api-reference/zoom-api/dashboards/dashboardmeetingparticipantqos
          </a>
        </ul>
      </Drawer>
    </Layout>
  );
}
