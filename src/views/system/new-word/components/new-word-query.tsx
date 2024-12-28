import React from 'react';
import { Button, Form, Input, DatePicker, Space } from 'antd';
import { FormInstance } from 'antd/es/form';

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
      <Form.Item name="userId" label="用户ID">
        <Input placeholder="请输入用户ID" />
      </Form.Item>
      <Form.Item name="articleId" label="文章ID">
        <Input placeholder="请输入文章ID" />
      </Form.Item>
      <Form.Item name="wordId" label="词库表ID">
        <Input placeholder="请输入词库表ID" />
      </Form.Item>
      <Form.Item name="word" label="单词">
        <Input placeholder="请输入单词" />
      </Form.Item>
      <Form.Item name="reviewCount" label="复习次数">
        <Input placeholder="请输入复习次数" />
      </Form.Item>
      <Form.Item name="nextReviewDate" label="复习时间">
        <DatePicker className="w-full" />
      </Form.Item>
      <Form.Item name="tenantId" label="租户ID">
        <Input placeholder="请输入租户ID" />
      </Form.Item>
      <Form.Item className="flex justify-end">
        <Space className="inline-flex">
          <Button onClick={handleNewWordQueryReset}>
            重置
          </Button>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default NewWordQueryComponent;
