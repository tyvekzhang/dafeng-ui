import { Button, DatePicker, Form, Input, Space } from 'antd';
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
      form={newWordQueryForm}
      name="newWordQuery"
      onFinish={onNewWordQueryFinish}
      layout="horizontal"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-0 gap-x-4 pt-4 px-2"
    >
      <Form.Item name="articleId" label="文章ID" rules={[{ required: false, message: '请输入' }]}>
        <Input type="number" placeholder="请输入" />
      </Form.Item>
      <Form.Item name="wordId" label="词库表ID" rules={[{ required: false, message: '请输入' }]}>
        <Input type="number" placeholder="请输入" />
      </Form.Item>
      <Form.Item name="word" label="单词" rules={[{ required: false, message: '请输入' }]}>
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item name="reviewCount" label="复习次数" rules={[{ required: false, message: '请输入' }]}>
        <Input type="number" placeholder="请输入" />
      </Form.Item>
      <Form.Item name="nextReviewDate" label="复习时间" rules={[{ required: false, message: '请输入' }]}>
        <DatePicker.RangePicker />
      </Form.Item>
      <Form.Item name="createTime" label="创建时间" rules={[{ required: false, message: '请输入' }]}>
        <DatePicker.RangePicker />
      </Form.Item>
      <div></div>
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
