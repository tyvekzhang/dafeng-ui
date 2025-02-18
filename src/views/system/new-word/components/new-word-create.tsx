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
  Slider, Switch, TimePicker, Transfer, TreeSelect, Upload,
} from 'antd';
import { NewWordCreate } from '@/types/new-word';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

const newWordCreateFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

interface NewWordCreateProps {
  isNewWordCreateModalVisible: boolean;
  onNewWordCreateCancel: () => void;
  onNewWordCreateFinish: (newWordCreate: NewWordCreate) => void;
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
      <Modal
        title="阅读生词新增"
        open={isNewWordCreateModalVisible}
        onCancel={onNewWordCreateCancel}
        footer={footerButtons}
        width={'60%'}
      >
        <Form
          {...newWordCreateFormItemLayout}
          form={ newWordCreateForm}
          name="newWordCreate"
          onFinish={onNewWordCreateFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="word" label="姓名" rules={[{ required: false, message: '请输入姓名' }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="translation" label="国家" rules={[{ required: false, message: '请输入国家' }]}>
            <Select placeholder="请选择国家" />
          </Form.Item>
          <Form.Item name="next_review_date" label="爱好" rules={[{ required: false, message: '请输入爱好' }]}>
            <Checkbox >爱好</Checkbox>
          </Form.Item>
          <Form.Item name="tenant" label="性别" rules={[{ required: false, message: '请输入性别' }]}>
            <Radio>性别</Radio>
          </Form.Item>
          <Form.Item name="update_time" label="出生年月" rules={[{ required: false, message: '请输入出生年月' }]}>
            <DatePicker format="YYYY-MM-DD" placeholder="请选择出生年月" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewWordCreateComponent;