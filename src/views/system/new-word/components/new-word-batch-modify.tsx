import React, { useMemo } from 'react';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { NewWordBatchModify } from '@/types/new-word';
import { FormInstance } from 'antd/es/form';

interface NewWordModifyProps {
  isNewWordBatchModifyModalVisible: boolean;
  onNewWordBatchModifyCancel: () => void;
  onNewWordBatchModifyFinish: () => void;
  isNewWordBatchModifyLoading: boolean;
  newWordBatchModifyForm: FormInstance<NewWordBatchModify>;
}

const NewWordBatchModifyComponent: React.FC<NewWordModifyProps> = ({
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
        form={newWordBatchModifyForm}
        name="newWordBatchModify"
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="userId" label="用户ID" rules={[{ required: true, message: '请输入用户ID' }]}>
              <Input type="number" placeholder="请输入用户ID" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="articleId" label="文章ID" rules={[{ required: true, message: '请输入文章ID' }]}>
              <Input type="number" placeholder="请输入文章ID" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="wordId" label="词库表ID" rules={[{ required: true, message: '请输入词库表ID' }]}>
              <Input type="number" placeholder="请输入词库表ID" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="word" label="单词" rules={[{ required: true, message: '请输入单词' }]}>
              <Input placeholder="请输入单词" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="reviewCount" label="复习次数" rules={[{ required: true, message: '请输入复习次数' }]}>
              <Input type="number" placeholder="请输入复习次数" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="nextReviewDate" label="复习时间"
                       rules={[{ required: true, message: '请输入复习时间' }]}>
              <Input placeholder="请输入复习时间" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="tenantId" label="租户ID" rules={[{ required: true, message: '请输入租户ID' }]}>
          <Input type="number" placeholder="请输入租户ID" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewWordBatchModifyComponent;

