import React, { useState } from 'react';
import {
  Layout, Input, Form, Button, Drawer, Row, Col, notification,
} from 'antd';
import { useParams } from 'react-router-dom';
import useAxios from 'axios-hooks';
import { CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';

import Error from '../error';

const { Header, Content } = Layout;
const { Item } = Form;

export default function WebinarRegister() {
  const { webinarId } = useParams();
  const [formError, setFormError] = useState();
  const [drawerVisible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const [{ loading }, executePost] = useAxios(
    { url: `/api/webinars/${webinarId}/registrants`, method: 'POST'},
    { manual: true },
  );

  const handlePost = async (data) => {
    setFormError();
    
    const { first_name, last_name, email } = data;
    const submitData = { first_name, last_name, email };

    await executePost({ data: submitData })
      .then(() => {
        notification.success({ message: 'Webinar Registration Successful' });
        form.resetFields();
      }).catch(err => setFormError(err));

  }

  return (
    <Layout className="layout-container edit">
      <Header>
        <div className="component-header">
          Register
          <div className="drawer-icon">
            <InfoCircleOutlined onClick={() => setVisible(true)} />
          </div>
        </div>
      </Header>
      <Content>
        {formError && <Error error={formError} />}
        <Form
          form={form}
          name="registerForm"
          colon={false}
          requiredMark={false}
          labelAlign="left"
          onFinish={handlePost}
          labelCol={{ span: 10 }}
        >
          <Row span={24} gutter={24}>
            <Col span={12}>
              <Item
                name="first_name"
                label="First Name"
                rules={[
                  { required: true, message: 'Required' },
                  { max: 64, type: 'string', message: 'Maximum length exceeded' },
                ]}
              >
                <Input placeholder="First Name" />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                name="last_name"
                label="Last Name"
                rules={[
                  { max: 64, type: 'string', message: 'Maximum length exceeded' },
                ]}
              >
                <Input placeholder="Last Name" />
              </Item>
            </Col>
          </Row>
          <Row span={24} gutter={24}>
            <Col span={12}>
              <Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Required' },
                  { max: 128, type: 'string', message: 'Maximum length exceeded' },
                ]}
              >
                <Input placeholder="Email" />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                name="confirm_email"
                label="Confirm Email"
                dependencies={['email']}
                hasFeedback
                rules={[
                  { required: true, message: 'Required' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('email') === value) {
                        return Promise.resolve();
                      }
        
                      return Promise.reject('Email does not match');
                    },
                  }),
                ]}
              >
                <Input placeholder="Confirm Email" />
              </Item>
            </Col>
          </Row>
          <div className="flex-end">
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckOutlined />}
              loading={loading}
            >
              Register
            </Button>
          </div>
        </Form>
        <Drawer
          title="Zoom APIs -- https://api.zoom.us/v2"
          closable={false}
          onClose={() => setVisible(false)}
          visible={drawerVisible}
          width={400}
        >
          <h3>Webinar Registration</h3>
          <hr />
          <ul>
            <li><h4>POST /webinars/:webinarId/registrants</h4></li>
            <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarregistrantcreate" target="_blank" rel="noreferrer">
              https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinarregistrantcreate
            </a>
          </ul>
        </Drawer>
      </Content>
    </Layout>
  );
}