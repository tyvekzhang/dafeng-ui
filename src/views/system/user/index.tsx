import { message } from '@/components/GlobalToast';
import { register } from '@/services';
import { UserCreate } from '@/types/user';
import type { DatePickerProps } from 'antd';
import { Button, Card, DatePicker, Form, Input, Modal, Select, Space, Switch, Table, theme } from 'antd';
import type { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import useStyles from './style';

const User: React.FC = () => {
  const { styles } = useStyles();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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
  const dataSource: readonly { state: boolean | undefined }[] | undefined = [];

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

  const handleAddUser = async (values: UserCreate) => {
    setLoading(true);
    try {
      await register(values);
      form.resetFields();
      handleCancel();
      message.success('用户新增成功');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card bordered={false} className={styles.searchContainer}>
        <Form>
          <Space wrap className={styles.searchContent}>
            <Form.Item name="username" label="用户名">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="nickname" label="用户昵称">
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item name="createDate" label="创建日期">
              <DatePicker.RangePicker cellRender={cellRender} />
            </Form.Item>
            <Form.Item name="state" label="状态">
              <Select
                allowClear
                placeholder="请选择"
                optionFilterProp="label"
                onChange={onChange}
                style={{ width: 112 }}
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
            <div className={styles.searchOperation}>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ margin: '0 8px 0 0' }}>
                  搜索
                </Button>
                <Button>重置</Button>
              </Form.Item>
            </div>
          </Space>
        </Form>
      </Card>
      <Card bordered={false} className={styles.resultContainer}>
        <Space className={styles.resultSearch}>
          <Button onClick={showModal} className={`${styles.button} btn-add`}>
            新增
          </Button>
          <Button className={`${styles.button} btn-import`}>导入</Button>
          <Button className={`${styles.button} btn-delete`}>删除</Button>
        </Space>
        <Modal
          title="用户新增:"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={
            <>
              <Button type={'primary'} htmlType="submit" onClick={() => form.submit()} loading={loading}>
                确定
              </Button>
              <Button onClick={handleCancel}>取消</Button>
            </>
          }
        >
          <Form form={form} name="user_add_rule" onFinish={handleAddUser}>
            <Form.Item
              {...formItemLayout}
              name="username"
              label="用户名"
              rules={[{ required: true, message: '必填项' }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              name="password"
              label="密码"
              rules={[
                { required: true, message: '必填项' },
                {
                  min: 6,
                  message: '请设置密码不少于6位',
                },
                {
                  pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
                  message: '需要有数字和字母',
                },
              ]}
              validateTrigger="onBlur"
            >
              <Input.Password
                placeholder="请输入"
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
    </div>
  );
};

export default User;
