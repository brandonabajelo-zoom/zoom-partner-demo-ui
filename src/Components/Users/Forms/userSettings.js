import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useAxios from 'axios-hooks';
import {
  Layout, Form, Button, Checkbox, Drawer, Row, Col,
} from 'antd';
import { CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';

import Error from '../error';

const { Header, Content } = Layout;
const { Item } = Form;

export default function SettingsForm({ userId, initialValues, refetch }) {
  const [formError, setFormError] = useState();
  const [drawerVisible, setVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => form.resetFields(), [initialValues, form]);

  const [{ loading }, executePatch] = useAxios(
    { url: `/api/users/${userId}/settings`, method: 'PATCH' },
    { manual: true },
  );

  const handleEdit = async (data) => {
    setFormError();

    const submitData = {
      feature: { webinar: data.webinar },
      recording: { cloud_recording: data.cloud_recording },
    }
  
    await executePatch({ data: submitData })
      .then(() => !!refetch && refetch())
      .catch((err) => setFormError(err));
  }

  return (
    <Layout className="layout-container edit">
      <Header>
        <div>
          Features
          <div className="drawer-icon">
            <InfoCircleOutlined onClick={() => setVisible(true)} />
          </div>
        </div>
      </Header>
      <Content className="form-content">
        {formError && <Error error={formError} />}
        <Form
          form={form}
          name="userSettingsForm"
          colon={false}
          requiredMark={false}
          initialValues={initialValues}
          labelAlign="left"
          onFinish={handleEdit}
          labelCol={{ span: 10 }}
        >
          <Row span={24} gutter={12}>
            <Col span={12}>
              <Item label="Webinar" valuePropName="checked" name="webinar">
                <Checkbox />
              </Item>
              <Item label="Cloud Recording" valuePropName="checked" name="cloud_recording">
                <Checkbox />
              </Item>
            </Col>
            <Col span={12}>
              <div className="flex-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<CheckOutlined />}
                  loading={loading}
                >
                  Save
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Content>
      <Drawer
        title="Zoom APIs -- https://api.zoom.us/v2"
        closable={false}
        onClose={() => setVisible(false)}
        visible={drawerVisible}
        width={400}
      >
        <h3>User Settings</h3>
        <hr />
        <ul>
          <li><h4>GET /users/:userId/settings</h4></li>
          <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/users/usersettings" target="_blank" rel="noreferrer">
            https://marketplace.zoom.us/docs/api-reference/zoom-api/users/usersettings
          </a>
          <hr />
          <li><h4>PATCH /users/:userId/settings</h4></li>
          <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/users/usersettingsupdate" target="_blank" rel="noreferrer">
            https://marketplace.zoom.us/docs/api-reference/zoom-api/users/usersettingsupdate
          </a>
        </ul>
      </Drawer>
    </Layout>
  );
}

SettingsForm.propTypes = {
  userId: PropTypes.string.isRequired,
  initialValues: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};