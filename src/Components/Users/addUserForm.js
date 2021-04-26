import React, { useState } from 'react';
import {
  Layout, Input, Form, Button, Radio,
} from 'antd';
import { useHistory, Link } from 'react-router-dom';
import { CheckOutlined } from '@ant-design/icons';
import useAxios from 'axios-hooks';
import Error from './error';

const { Header, Content } = Layout;
const { Item } = Form;
const { Group } = Radio;

export default function AddUser() {
  const [formError, setFormError] = useState();
  const [form] = Form.useForm();
  const { push } = useHistory();

  const [{ loading }, executePost] = useAxios(
    { url: '/api/users/add', method: 'POST'},
    { manual: true },
  )

  const handleSave = async (formData) => {
    setFormError();
    const userData = { action: 'create', user_info: formData };

    await executePost({ data: userData })
      .then(() => push('/users'))
      .catch(err => setFormError(err));
  }

  return (
    <Layout className="layout-container">
      <Header className="header-flex">
        <div>Add User</div>
      </Header>
      <Content className="form-content">
        {formError && <Error error={formError} />}
        <Form
          form={form}
          name="addUserForm"
          labelAlign="left"
          colon={false}
          requiredMark={false}
          onFinish={handleSave}
        >
          <Item
            label="Type"
            name="type"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Group>
              <Radio value={1}>Basic</Radio>
              <Radio value={2}>Licensed</Radio>
            </Group>
          </Item>
          <Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input />
          </Item>
          <Item
            label="First Name"
            name="first_name"
          >
            <Input />
          </Item>
          <Item
            label="Last Name"
            name="last_name"
          >
            <Input />
          </Item>
          <div className="flex-end">
            <Link to='/users'>
              <Button className="add-event">
                Cancel
              </Button>
            </Link>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckOutlined />}
              loading={loading}
            >
              Save
            </Button>
          </div>
        </Form>
      </Content>
    </Layout>
  );
}