import { NewWordModify } from '@/types/new-word';
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
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
          form={ newWordModifyForm}
          name="newWordModify"
          onFinish={onNewWordModifyFinish}
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

export default NewWordModifyComponent;