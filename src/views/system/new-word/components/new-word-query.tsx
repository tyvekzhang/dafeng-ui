import { Input } from 'antd';
import { Select } from 'antd';
import { DatePicker } from 'antd';
import { Checkbox } from 'antd';
import { Radio } from 'antd';
import {
  AutoComplete,
  Button,
  Cascader,
  ColorPicker,
  Form,
  InputNumber, Mentions,
  Modal, Rate,
  Slider, Switch, TimePicker, Transfer, TreeSelect, Upload, Space
} from 'antd';
import { FormInstance } from 'antd/es/form';
import React from 'react';

interface NewWordQueryProps {
  onNewWordQueryFinish: () => void;
  onNewWordQueryReset: () => void;
  newWordQueryForm: FormInstance;
}

const newWordQueryFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const NewWordQueryComponent: React.FC<NewWordQueryProps> = ({
  onNewWordQueryFinish,
  onNewWordQueryReset,
  newWordQueryForm,
}) => {
  const handleNewWordQueryReset = () => {
    onNewWordQueryReset();
    onNewWordQueryFinish();
  };

  return (
    <Form
      {...newWordQueryFormItemLayout}
      form={ newWordQueryForm}
      name="newWordQuery"
      onFinish={onNewWordQueryFinish}
      layout="horizontal"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-0 gap-x-4 pt-4 px-2"
    >
      <Form.Item name="word" label="姓名" >
        <Input placeholder="请输入姓名" />
      </Form.Item>
      <Form.Item name="translation" label="国家" >
        <Select placeholder="请选择国家" />
      </Form.Item>
      <Form.Item name="next_review_date" label="爱好" >
        <Checkbox >爱好</Checkbox>
      </Form.Item>
      <Form.Item name="tenant" label="性别" >
        <Radio>性别</Radio>
      </Form.Item>
      <Form.Item name="update_time" label="出生年月" >
        <DatePicker format="YYYY-MM-DD" placeholder="请选择出生年月" />
      </Form.Item>
      <Form.Item className="flex justify-end">
        <Space className="inline-flex">
          <Button onClick={handleNewWordQueryReset}>重置</Button>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default NewWordQueryComponent;