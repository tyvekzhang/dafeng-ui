import type { DatePickerProps } from 'antd';
import { Button, Card, DatePicker, Form, Input, Modal, Select, Space, Switch, Table, theme } from 'antd';
import type { Dayjs } from 'dayjs';
import React, { useState } from 'react';

const User: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [value, setValue] = useState('');

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  // 日期选择
  const { token } = theme.useToken();
  const style: React.CSSProperties = {
    border: `1px solid ${token.colorPrimary}`,
    borderRadius: '50%',
  };
  const cellRender: DatePickerProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type !== 'date') {
      return info.originNode;
    }
    if (typeof current === 'number' || typeof current === 'string') {
      return <div className="ant-picker-cell-inner">{current}</div>;
    }
    return (
      <div className="ant-picker-cell-inner" style={current.date() === 1 ? style : {}}>
        {current.date()}
      </div>
    );
  };
  // 表格展示
  const dataSource = [
    {
      no: '1',
      username: 'Dill',
      nickname: '迪丽热巴',
      state: 1,
      createDate: '2024-10-18',
    },
    {
      no: '2',
      username: 'Gull',
      nickname: '古力娜扎',
      state: 0,
      createDate: '2024-10-18',
    },
  ];

  const columns = [
    {
      title: '序号',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: (text: any, record: { state: boolean | undefined }) => <Switch checked={record.state} />,
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      key: 'createDate',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle" style={{ color: '#189DFE' }}>
          <a>删除</a>
          <a>编辑</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card style={{ marginBottom: 1, boxShadow: '0 3px 0 -4px rgba(0, 0, 0, 0.12)' }} bordered={false}>
        <Form>
          <Space wrap>
            <Form.Item name="username" label="用户名">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="nickname" label="用户昵称">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="state" label="状态">
              <Select
                allowClear
                placeholder="请选择"
                optionFilterProp="label"
                onChange={onChange}
                style={{ width: 100 }}
                options={[
                  {
                    value: '1',
                    label: '正常',
                  },
                  {
                    value: '0',
                    label: '停用',
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name="createDate" label="创建日期">
              <DatePicker.RangePicker cellRender={cellRender} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </Card>
      <Card bordered={false}>
        <Space style={{ margin: '0 0 12px 0' }}>
          <Button onClick={showModal} type="primary">
            新建
          </Button>
          <Button>导入</Button>
        </Space>
        <Modal title="用户新增:" open={isModalVisible} onCancel={handleCancel}>
          <Form form={form} name="user_add_rule">
            <Form.Item
              {...formItemLayout}
              name="username"
              label="用户名"
              rules={[{ required: true, message: '必填项' }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item {...formItemLayout} name="password" label="密码" rules={[{ required: true, message: '必填项' }]}>
              <Input.Password
                placeholder="请输入"
                defaultValue={123456}
                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
              />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              name="nickname"
              label="用户昵称"
              rules={[{ required: true, message: '必填项' }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item {...formItemLayout} name="remark" label="备注">
              <Input.TextArea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="请输入"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
          </Form>
        </Modal>
        <Table dataSource={dataSource} columns={columns} />
      </Card>
    </>
  );
};

export default User;
