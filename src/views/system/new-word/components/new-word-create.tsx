import React, { useMemo } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { FormInstance } from 'antd/es/form';
import { NewWordCreate } from '@/types/new-word';

const newWordCreateFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

interface NewWordCreateProps {
  isNewWordCreateModalVisible: boolean;
  onNewWordCreateCancel: () => void;
  onNewWordCreateFinish: (NewWordCreate: NewWordCreate) => void;
  isNewWordCreateLoading: boolean;
  newWordCreateForm: FormInstance;
}

const NewWordCreateComponent: React.FC<NewWordCreateProps> = ({
                                                                isNewWordCreateModalVisible,
                                                                onNewWordCreateCancel,
                                                                onNewWordCreateFinish,
                                                                isNewWordCreateLoading,
                                                                newWordCreateForm,
                                                              }) => {

  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onNewWordCreateCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isNewWordCreateLoading} onClick={() => newWordCreateForm.submit()}>
        确定
      </Button>,
    ],
    [isNewWordCreateLoading, newWordCreateForm, onNewWordCreateCancel],
  );


  return (
    <div>
      <Modal title="阅读生词新增" open={isNewWordCreateModalVisible} onCancel={onNewWordCreateCancel} footer={footerButtons} width={"60%"}>
        <Form
          {...newWordCreateFormItemLayout}
          form={ newWordCreateForm}
          name="newWordCreate"
          onFinish={onNewWordCreateFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="userId" label="用户ID" rules={[{ required: true, message: '请输入' }]}>
            <Input type="number" placeholder="请输入" />
          </Form.Item>
          <Form.Item name="articleId" label="文章ID" rules={[{ required: true, message: '请输入' }]}>
            <Input type="number" placeholder="请输入" />
          </Form.Item>
          <Form.Item name="wordId" label="词库表ID" rules={[{ required: true, message: '请输入' }]}>
            <Input type="number" placeholder="请输入" />
          </Form.Item>
          <Form.Item name="word" label="单词" rules={[{ required: true, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="reviewCount" label="复习次数" rules={[{ required: true, message: '请输入' }]}>
            <Input type="number" placeholder="请输入" />
          </Form.Item>
          <Form.Item name="nextReviewDate" label="复习时间" rules={[{ required: true, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="tenantId" label="租户ID" rules={[{ required: true, message: '请输入' }]}>
            <Input type="number" placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewWordCreateComponent;
