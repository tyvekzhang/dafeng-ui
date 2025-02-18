import { MemberBatchModify } from '@/types/member';
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface MemberBatchModifyProps {
  isMemberBatchModifyModalVisible: boolean;
  onMemberBatchModifyCancel: () => void;
  onMemberBatchModifyFinish: () => void;
  isMemberBatchModifyLoading: boolean;
  memberBatchModifyForm: FormInstance<MemberBatchModify>;
}

const memberBatchModifyFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const MemberBatchModifyComponent: React.FC<MemberBatchModifyProps> = ({
  isMemberBatchModifyModalVisible,
  onMemberBatchModifyCancel,
  onMemberBatchModifyFinish,
  isMemberBatchModifyLoading,
  memberBatchModifyForm,
}) => {
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onMemberBatchModifyCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isMemberBatchModifyLoading} onClick={onMemberBatchModifyFinish}>
        确定
      </Button>,
    ],
    [isMemberBatchModifyLoading, onMemberBatchModifyCancel],
  );

  return (
    <Modal
      title="会员管理编辑"
      open={isMemberBatchModifyModalVisible}
      onCancel={onMemberBatchModifyCancel}
      footer={footerButtons}
      destroyOnClose
    >
        <Form
          {... memberBatchModifyFormItemLayout}
          form={ memberBatchModifyForm}
          name="memberBatchModify"
          onFinish={onMemberBatchModifyFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="name" label="名称" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="nation" label="国家" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
            
          </Form.Item>
          <Form.Item name="gender" label="性别" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
            
          </Form.Item>
          <Form.Item name="birthday" label="生日" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
            
          </Form.Item>
          <Form.Item name="hobby" label="爱好" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入" />
            
          </Form.Item>
        </Form>
    </Modal>
  );
};

export default MemberBatchModifyComponent;