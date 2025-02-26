import { Input } from 'antd';
import { Select } from 'antd';
import { DatePicker } from 'antd';
import { Checkbox } from 'antd';
import { Radio } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { TreeSelect } from 'antd';
import { TreeSelectUtil } from '@/utils/select-util';
import { MemberPage } from '@/types/member';
import {
  AutoComplete,
  Button,
  Cascader,
  ColorPicker,
  Form,
  InputNumber, Mentions,
  Modal, Rate,
  Slider, Switch, TimePicker, Transfer, Upload,
} from 'antd';
import { useAppSelector } from '@/stores';
import { MemberCreate } from '@/types/member';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

const memberCreateFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

interface MemberCreateProps {
  isMemberCreateModalVisible: boolean;
  onMemberCreateCancel: () => void;
  onMemberCreateFinish: (memberCreate: MemberCreate) => void;
  isMemberCreateLoading: boolean;
  memberCreateForm: FormInstance;
  treeSelectDataSource?: MemberPage[];
}

const MemberCreateComponent: React.FC<MemberCreateProps> = ({
  isMemberCreateModalVisible,
  onMemberCreateCancel,
  onMemberCreateFinish,
  isMemberCreateLoading,
  memberCreateForm,
  treeSelectDataSource,
}) => {
  const treeSelectDataTransform = [{ name: '根目录', id: 0, children: treeSelectDataSource }];
  const treeSelectData = TreeSelectUtil.transform(treeSelectDataTransform as any);
  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onMemberCreateCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isMemberCreateLoading} onClick={() => memberCreateForm.submit()}>
        确定
      </Button>,
    ],
    [isMemberCreateLoading, memberCreateForm, onMemberCreateCancel],
  );
  const { dictData } = useAppSelector((state) => state.dict);

  return (
    <div>
      <Modal
        title="会员管理新增"
        open={isMemberCreateModalVisible}
        onCancel={onMemberCreateCancel}
        footer={footerButtons}
        width={'60%'}
      >
        <Form
          {...memberCreateFormItemLayout}
          form={ memberCreateForm}
          name="memberCreate"
          onFinish={onMemberCreateFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="name" label="名称" rules={[{ required: false, message: '请输入名称' }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item name="nation" label="国家" rules={[{ required: false, message: '请输入国家' }]}>
            <Select
                placeholder="请选择国家"
                options={ dictData["sys_user_country"] }
            />
          </Form.Item>
          <Form.Item name="gender" label="性别" rules={[{ required: false, message: '请输入性别' }]}>
            <Radio.Group options={ dictData["sys_user_sex"] } />
          </Form.Item>
          <Form.Item name="birthday" label="生日" rules={[{ required: false, message: '请输入生日' }]}>
            <DatePicker format="YYYY-MM-DD" placeholder="请选择生日" />
          </Form.Item>
          <Form.Item name="hobby" label="爱好" rules={[{ required: false, message: '请输入爱好' }]}>
            <Checkbox.Group options={ dictData["sys_user_hobby"] } />
          </Form.Item>
          <Form.Item name="parent_id" label="父Id" rules={[{ required: false, message: '请输入父Id' }]}>
            <TreeSelect
              placeholder="请选择父Id"
              allowClear
              multiple
              maxCount={1}
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              treeData={treeSelectData}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MemberCreateComponent;