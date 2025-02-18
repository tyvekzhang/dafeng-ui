import { NewWordBatchModify } from '@/types/new-word';
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface NewWordBatchModifyProps {
  isNewWordBatchModifyModalVisible: boolean;
  onNewWordBatchModifyCancel: () => void;
  onNewWordBatchModifyFinish: () => void;
  isNewWordBatchModifyLoading: boolean;
  newWordBatchModifyForm: FormInstance<NewWordBatchModify>;
}

const newWordBatchModifyFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const NewWordBatchModifyComponent: React.FC<NewWordBatchModifyProps> = ({
  isNewWordBatchModifyModalVisible,
  onNewWordBatchModifyCancel,
  onNewWordBatchModifyFinish,
  isNewWordBatchModifyLoading,
  newWordBatchModifyForm,
}) => {
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onNewWordBatchModifyCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isNewWordBatchModifyLoading} onClick={onNewWordBatchModifyFinish}>
        确定
      </Button>,
    ],
    [isNewWordBatchModifyLoading, onNewWordBatchModifyCancel],
  );

  return (
    <Modal
      title="阅读生词编辑"
      open={isNewWordBatchModifyModalVisible}
      onCancel={onNewWordBatchModifyCancel}
      footer={footerButtons}
      destroyOnClose
    >
        <Form
          {... newWordBatchModifyFormItemLayout}
          form={ newWordBatchModifyForm}
          name="newWordBatchModify"
          onFinish={onNewWordBatchModifyFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="word" label="姓名" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="translation" label="国家" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
            
          </Form.Item>
          <Form.Item name="next_review_date" label="爱好" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
            
          </Form.Item>
          <Form.Item name="tenant" label="性别" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
            
          </Form.Item>
          <Form.Item name="update_time" label="出生年月" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
            
          </Form.Item>
        </Form>
    </Modal>
  );
};

export default NewWordBatchModifyComponent;