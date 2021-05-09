import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Layout, Input, Form, Button, DatePicker, Select, Checkbox, Drawer,
} from 'antd';
import { useParams, useHistory, Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import moment from 'moment';
import _ from 'lodash';
import useAxios from 'axios-hooks';
import { CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';

import timezones from '../../../timezones';
import Error from '../error';

const { Header, Content } = Layout;
const { TextArea, Group } = Input;
const { Option } = Select;
const { Item } = Form;

const DEFAULT_INITIAL_VALUES = {
  hour: 1,
  min: 0,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  start_time: moment(),
};

export default function MeetingForm({ initialValues, refetch }) {
  const { userId, meetingId } = useParams();
  const [formError, setFormError] = useState();
  const [drawerVisible, setVisible] = useState(false);

  const [form] = Form.useForm();
  const { push } = useHistory();

  useEffect(() => form.resetFields(), [initialValues, form]);

  const [{ loading }, executePost] = useAxios(
    { url: `/api/meetings/${userId}`, method: 'POST' },
    { manual: true },
  );

  const [{ loading: patchLoading }, executePatch] = useAxios(
    { url: `/api/meetings/${meetingId}`, method: 'PATCH' },
    { manual: true },
  );

  const formatData = (data) => {
    setFormError();

    const {
      hour,
      min,
      start_time: moment_start_time,
      auto_recording,
      ...rest
    } = data;

    const submitData = {
      duration: (parseInt(hour, 10) * 60) + parseInt(min, 10),
      start_time: DateTime.fromISO(moment_start_time.format('YYYY-MM-DDTHH:mm:ss')).toISO(),
      settings: {
        auto_recording: auto_recording ? 'cloud' : 'none',
      },
      ...rest,
    };

    return submitData;
  }

  const handleSave = async (data) => {
    const postData = formatData(data);
  
    await executePost({ data: postData })
      .then(() => push(`/users/${userId}/meetings`))
      .catch(err => setFormError(err));
  };

  const handleEdit = async (data) => {
    const editData = formatData(data);
    
    await executePatch({ data: editData })
      .then(() => !!refetch && refetch())
      .catch(err => setFormError(err))
  }

  const formInitialValues = (() => {
    if (!_.isEmpty(initialValues)) {
      const {
        duration,
        start_time,
        settings: { auto_recording },
        ...rest
      } = initialValues;
      const hour = duration / 60;
      const min = (hour - Math.floor(hour)) * 60;
      return {
        hour,
        min,
        start_time: moment(start_time),
        auto_recording: auto_recording === 'cloud',
        ...rest,
      }
    }
    return DEFAULT_INITIAL_VALUES;
  })();

  return (
    <Layout className={meetingId ? 'layout-container edit' : 'layout-container'}>
      <Header className="header-flex">
        <div>
          {meetingId ? 'Manage Meeting' : 'Schedule Meeting'}
          <div className="drawer-icon">
            <InfoCircleOutlined onClick={() => setVisible(true)} />
          </div>
        </div>
      </Header>
      <Content className="form-content">
        {formError && <Error error={formError} />}
        <Form
          form={form}
          name="meetingForm"
          onFinish={meetingId ? handleEdit : handleSave}
          labelCol={{ span: 5 }}
          labelAlign="left"
          colon={false}
          requiredMark={false}
          initialValues={formInitialValues}
        >
          <Item
            label="Topic"
            name="topic"
            rules={[{ required: true, message: 'Topic is required' }]}
          >
            <Input placeholder="Meeting topic" />
          </Item>
          <Item
            label="Description"
            name="agenda"
            rules={[{
              max: 2000, message: 'Maximum length exceeded', type: 'string',
            }]}
          >
            <TextArea
              placeholder="Add a meeting description"
              showCount
              maxLength={2000}
            />
          </Item>
          <Item
            label="When"
            name="start_time"
          >
            <DatePicker showTime />
          </Item>
          <Item label="Duration">
            <Group compact>
              <Item name="hour">
                <Input
                  type="number"
                  addonAfter="hr"
                  min="0"
                />
              </Item>
              <Item name="min">
                <Input
                  type="number"
                  addonAfter="min"
                  min="0"
                />
              </Item>
            </Group>
          </Item>
          <Item
            name="timezone"
            label="Timezone"
          >
            <Select style={{ width: 300 }} showSearch>
              {timezones.map((x) => <Option key={x} value={x}>{x}</Option>)}
            </Select>
          </Item>
          <Item
            name="password"
            label="Passcode"
            rules={[{
              max: 10,
              type: 'string',
              pattern: '^[a-zA-Z 0-9!@+-_*]*$',
              message: 'Passcode can contain at most 10 characters [a-z A-Z 0-9 @ - _ * !]',
            }]}
          >
            <Input style={{ width: 300 }} placeholder="(optional)" />
          </Item>
          <Item
            name="auto_recording"
            label="Record Meeting"
            valuePropName="checked"
          >
            <Checkbox>Cloud Recording</Checkbox>
          </Item>
          <Item>
            <div className="flex-end">
              <Link to={`/users/${userId}/meetings`}>
                <Button>Cancel</Button>
              </Link>
              <Button
                className="submit-btn"
                icon={<CheckOutlined />}
                type="primary"
                htmlType="submit"
                loading={loading || patchLoading}
              >
                Save
              </Button>
            </div>
          </Item>
        </Form>
      </Content>
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
          {!meetingId && (
            <>
              <li><h4>POST /users/:userId/meetings</h4></li>
              <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingcreate" target="_blank" rel="noreferrer">
                https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingcreate
              </a>
            </>
          )}
          {meetingId && (
            <>
              <li><h4>PATCH /users/:userId/meetings</h4></li>
              <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingupdate" target="_blank" rel="noreferrer">
                https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingupdate
              </a>
            </>
          )}
        </ul>
      </Drawer>
    </Layout>
  );
}

MeetingForm.propTypes = {
  initialValues: PropTypes.object,
  refetch: PropTypes.func,
};