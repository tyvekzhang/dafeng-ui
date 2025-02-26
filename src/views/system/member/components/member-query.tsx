import { Button, DatePicker, Form, Input, Select, Space } from 'antd';
import dayjs from 'dayjs';
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
        <DatePicker.RangePicker
          allowClear
          format="YYYY-MM-DD"
          placeholder={["请选择开始时间", "请选择结束时间"]}
          presets={[
            { label: '最近7天', value: [dayjs().add(-7, 'd'), dayjs()] },
            { label: '最近14天', value: [dayjs().add(-14, 'd'), dayjs()] },
            { label: '最近30天', value: [dayjs().add(-30, 'd'), dayjs()] },
            { label: '最近90天', value: [dayjs().add(-90, 'd'), dayjs()] },
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
