import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Layout, Input, Form, Button, Radio, Select, Checkbox, Row, Col,
} from 'antd';
import { useParams } from 'react-router-dom';
import { CheckOutlined } from '@ant-design/icons';
import useAxios from 'axios-hooks';
import timezones from '../../timezones';
import Error from './error';

const { Content } = Layout;
const { Option } = Select;
const { Item } = Form;
const { Group } = Radio;

export default function EditUser({ initialValues, refetch }) {
  const { userId } = useParams();
  const [formError, setFormError] = useState();
  const [form] = Form.useForm();

  useEffect(() => form.resetFields(), [initialValues, form]);

  const [{ loading }, executePatch] = useAxios(
    { url: `/api/users/${userId}`, method: 'PATCH' },
    { manual: true },
  );

  const handleEdit = async (data) => {
    setFormError();
    const { pmi, ...rest } = data;

    await executePatch({ data: { pmi: parseInt(pmi, 10), ...rest }})
      .then(() => !!refetch && refetch())
      .catch((err) => setFormError(err))
  }

  return (
    <Layout className="layout-container edit">
      <Content>
        {formError && <Error error={formError} />}
        <Form
          form={form}
          name="userForm"
          colon={false}
          requiredMark={false}
          initialValues={initialValues}
          labelAlign="left"
          onFinish={handleEdit}
          labelCol={{ span: 10 }}
        >
          <Row span={24} gutter={24}>
            <Col span={12}>
              <Item label="Type" name="type">
                <Group>
                  <Radio value={1}>Basic</Radio>
                  <Radio value={2}>Licensed</Radio>
                </Group>
              </Item>
            </Col> 
          </Row>
          <Row span={24} gutter={24}>
            <Col span={12}>
              <Item
                label="First Name"
                name="first_name"
                rules={[
                  { required: true, message: 'Required' },
                  { max: 64, type: 'string', message: 'Max length: 64 characters' },
                ]}
              >
                <Input />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                name="timezone"
                label="Timezone"
              >
                <Select showSearch>
                  {timezones.map((x) => <Option key={x} value={x}>{x}</Option>)}
                </Select>
              </Item>
            </Col>
          </Row>
          <Row span={24} gutter={24}>
            <Col span={12}>
              <Item
                label="Last Name"
                name="last_name"
                rules={[
                  { required: true, message: 'Required' },
                  { max: 64, type: 'string', message: 'Max length: 64 characters' },
                ]}
              >
                <Input />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                label="Job Title"
                name="job_title"
              >
                <Input />
              </Item>
            </Col>
          </Row>
          <Row span={24} gutter={24}>
            <Col span={12}>
              <Item
                label="Personal Meeting ID (PMI)"
                name="pmi"
              >
                <Input type="number" disabled />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                label="Company"
                name="company"
              >
                <Input />
              </Item>
            </Col>
          </Row>
          <Row span={24} gutter={24}>
            <Col span={12}>
              <Item
                label="Use PMI for Instant Meetings"
                name="use_pmi"
                valuePropName="checked"
              >
                <Checkbox />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                label="Department"
                name="dept"
              >
                <Input />
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
              Save
            </Button>
          </div>
        </Form>
      </Content>
    </Layout>
  );
}

EditUser.propTypes = {
  initialValues: PropTypes.object,
  refetch: PropTypes.func.isRequired,
}
