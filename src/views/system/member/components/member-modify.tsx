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
import { MemberModify } from '@/types/member';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

interface MemberModifyProps {
  isMemberModifyModalVisible: boolean;
  onMemberModifyCancel: () => void;
  onMemberModifyFinish: () => void;
  isMemberModifyLoading: boolean;
  memberModifyForm: FormInstance<MemberModify>;
}

const memberModifyFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const MemberModifyComponent: React.FC<MemberModifyProps> = ({
  isMemberModifyModalVisible,
  onMemberModifyCancel,
  onMemberModifyFinish,
  isMemberModifyLoading,
  memberModifyForm,
}) => {
  const footerButtons = useMemo(
    () => [
      <Button key="cancel" onClick={onMemberModifyCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isMemberModifyLoading} onClick={onMemberModifyFinish}>
        确定
      </Button>,
    ],
    [isMemberModifyLoading, onMemberModifyCancel],
  );

  return (
    <Modal
      title="会员管理编辑"
      open={isMemberModifyModalVisible}
      onCancel={onMemberModifyCancel}
      footer={footerButtons}
      destroyOnClose
    >
        <Form
          {...memberModifyFormItemLayout}
          form={ memberModifyForm}
          name="memberModify"
          onFinish={onMemberModifyFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="name" label="名称" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item name="nation" label="国家" rules={[{ required: false, message: '请输入' }]}>
            <Select placeholder="请选择国家" />
          </Form.Item>
          <Form.Item name="gender" label="性别" rules={[{ required: false, message: '请输入' }]}>
            <Radio>性别</Radio>
          </Form.Item>
          <Form.Item name="birthday" label="生日" rules={[{ required: false, message: '请输入' }]}>
            <DatePicker format="YYYY-MM-DD" placeholder="请选择生日" />
          </Form.Item>
          <Form.Item name="hobby" label="爱好" rules={[{ required: false, message: '请输入' }]}>
            <Checkbox >爱好</Checkbox>
          </Form.Item>
        </Form>
    </Modal>
  );
};

export default MemberModifyComponent;