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
          <Form.Item name="article_id" label="文章ID" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="word_id" label="词库表ID" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="word" label="单词" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="translation" label="翻译" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="review_count" label="复习次数" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="next_review_date" label="复习时间" rules={[{ required: false, message: '请输入' }]}>
            <DatePicker />
          </Form.Item>
        </Form>
    </Modal>
  );
};

export default NewWordBatchModifyComponent;