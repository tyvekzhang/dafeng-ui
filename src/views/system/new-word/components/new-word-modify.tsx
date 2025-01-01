import { NewWordModify } from '@/types/new-word';
import { Button, Form, Input, Modal } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface NewWordModifyProps {
  isNewWordModifyModalVisible: boolean;
  onNewWordModifyCancel: () => void;
  onNewWordModifyFinish: () => void;
  isNewWordModifyLoading: boolean;
  newWordModifyForm: FormInstance<NewWordModify>;
}

const newWordModifyFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const NewWordModifyComponent: React.FC<NewWordModifyProps> = ({
  isNewWordModifyModalVisible,
  onNewWordModifyCancel,
  onNewWordModifyFinish,
  isNewWordModifyLoading,
  newWordModifyForm,
}) => {
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onNewWordModifyCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isNewWordModifyLoading} onClick={onNewWordModifyFinish}>
        确定
      </Button>,
    ],
    [isNewWordModifyLoading, onNewWordModifyCancel],
  );

  return (
    <Modal
      title="阅读生词编辑"
      open={isNewWordModifyModalVisible}
      onCancel={onNewWordModifyCancel}
      footer={footerButtons}
      destroyOnClose
    >
      <Form
        {...newWordModifyFormItemLayout}
        form={newWordModifyForm}
        name="newWordModify"
        onFinish={onNewWordModifyFinish}
        className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
      >
        <Form.Item name="userId" label="用户ID" rules={[{ required: false, message: '请输入' }]}>
          <Input type="number" placeholder="请输入" />
        </Form.Item>
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
        <Form.Item name="nextReviewDate" label="下次复习时间" rules={[{ required: false, message: '请输入' }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item name="tenantId" label="租户ID" rules={[{ required: false, message: '请输入' }]}>
          <Input type="number" placeholder="请输入" />
        </Form.Item>
        <Form.Item name="updateTime" label="更新时间" rules={[{ required: false, message: '请输入' }]}>
          <Input placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewWordModifyComponent;
