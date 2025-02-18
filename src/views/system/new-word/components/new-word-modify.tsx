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
import { NewWordModify } from '@/types/new-word';
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
          <Form.Item name="word" label="姓名" rules={[{ required: false, message: '请输入' }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="translation" label="国家" rules={[{ required: false, message: '请输入' }]}>
            <Select placeholder="请选择国家" />
          </Form.Item>
          <Form.Item name="next_review_date" label="爱好" rules={[{ required: false, message: '请输入' }]}>
            <Checkbox >爱好</Checkbox>
          </Form.Item>
          <Form.Item name="tenant" label="性别" rules={[{ required: false, message: '请输入' }]}>
            <Radio>性别</Radio>
          </Form.Item>
          <Form.Item name="update_time" label="出生年月" rules={[{ required: false, message: '请输入' }]}>
            <DatePicker format="YYYY-MM-DD" placeholder="请选择出生年月" />
          </Form.Item>
        </Form>
    </Modal>
  );
};

export default NewWordModifyComponent;