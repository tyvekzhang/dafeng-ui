import { Input } from 'antd';
import { Select } from 'antd';
import { Radio } from 'antd';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { Checkbox } from 'antd';
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
import { useAppSelector } from '@/stores';
import { FormInstance } from 'antd/es/form';
import React from 'react';

interface MemberQueryProps {
  onMemberQueryFinish: () => void;
  onMemberQueryReset: () => void;
  memberQueryForm: FormInstance;
}

const memberQueryFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const MemberQueryComponent: React.FC<MemberQueryProps> = ({
  onMemberQueryFinish,
  onMemberQueryReset,
  memberQueryForm,
}) => {
  const handleMemberQueryReset = () => {
    onMemberQueryReset();
    onMemberQueryFinish();
  };
  const { dictData } = useAppSelector((state) => state.dict);

  return (
    <Form
      {...memberQueryFormItemLayout}
      form={ memberQueryForm}
      name="memberQuery"
      onFinish={onMemberQueryFinish}
      layout="horizontal"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-0 gap-x-4 pt-4 px-2 border-b"
    >
      <Form.Item name="name" label="名称" >
        <Input placeholder="请输入名称" allowClear />
      </Form.Item>
      <Form.Item name="nation" label="国家" >
        <Select
            allowClear
            placeholder="请选择国家"
            options={ dictData["sys_user_country"] }
        />
      </Form.Item>
      <Form.Item name="gender" label="性别" >
        <Select
            allowClear
            placeholder="请选择性别"
            options={ dictData["sys_user_sex"] }
        />
      </Form.Item>
      <Form.Item name="birthday" label="生日" >
        <DatePicker
          allowClear
          format="YYYY-MM-DD"
          placeholder="请选择生日"
          presets={[
            { label: '昨天', value: dayjs().add(-1, 'd') },
            { label: '上周', value: dayjs().add(-7, 'd') },
            { label: '上月', value: dayjs().add(-1, 'month') },
          ]}
        />
      </Form.Item>
      <Form.Item name="hobby" label="爱好" >
        <Input placeholder="请输入爱好" allowClear />
      </Form.Item>
      <Form.Item className="flex justify-end">
        <Space className="inline-flex">
          <Button onClick={handleMemberQueryReset}>重置</Button>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default MemberQueryComponent;