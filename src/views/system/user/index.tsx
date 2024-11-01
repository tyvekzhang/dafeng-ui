import { message } from '@/components/GlobalToast';
import UndoComp from '@/components/Undo';
import { register, userDelete, userList, userRecover, userUpdate } from '@/services';
import { UserCreate, UserQuery } from '@/types/user';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { DatePickerProps } from 'antd';
import { Button, Card, DatePicker, Form, Input, Modal, Select, Space, Switch, Table, theme } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import useStyles from './style';

const columns = (
  onUpdate: (user: UserQuery) => void,
  onDelete: (user: UserQuery) => void,
  loadingDelete: boolean,
  handleStatusChange: (user: UserQuery) => void,
) => [
  {
    title: '序号',
    dataIndex: 'No',
    key: 'No',
    render: (_: number, _record: UserQuery, rowIndex: number) => rowIndex + 1,
    width: '8%',
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
    dataIndex: 'status',
    key: 'status',
    render: (status: number, record: UserQuery) => {
      if (status === 1) {
        return (
          <Switch style={{ backgroundColor: '#4096ff' }} checked={true} onChange={() => handleStatusChange(record)} />
        );
      }
      return <Switch onChange={() => handleStatusChange(record)} />;
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    render: (remark: string) => {
      if (remark.length > 0) {
        return remark;
      }
      return '-';
    },
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    render: (text: number) => {
      const formattedDate = dayjs(text * 1000).format('YYYY-MM-DD HH:mm:ss');
      return <span>{formattedDate}</span>;
    },
  },
  {
    title: '操作',
    key: 'action',
    render: (_: string, record: UserQuery) => (
      <Space>
        <Button
          style={{ fontSize: 12, color: '#4096ff' }}
          size={'small'}
          icon={<EditOutlined style={{ marginRight: '-4px' }} />}
          type={'link'}
          onClick={() => onUpdate(record)}
        >
          修改
        </Button>
        <Button
          style={{ marginLeft: '-8px', fontSize: 12, color: '#4096ff' }}
          size={'small'}
          icon={<DeleteOutlined style={{ marginRight: '-4px' }} />}
          type={'link'}
          onClick={() => onDelete(record)}
          loading={loadingDelete}
        >
          删除
        </Button>
      </Space>
    ),
  },
];

const UserPage: React.FC = () => {
  const { styles } = useStyles();
  const [addUserForm] = Form.useForm();
  const [updateUserForm] = Form.useForm();
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState<boolean>(false);
  const [isEditUserModalVisible, setIsUpdateUserModalVisible] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<UserQuery[] | undefined>([]);
  const [value, setValue] = useState('');
  const [editingUser, setUpdatingUser] = useState<UserQuery | null>(null);
  const [recoverUser, setRecoverUser] = useState<UserQuery | null>(null);
  const [showUndo, setShowUndo] = useState(false);

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
  };

  const showModal = () => {
    setIsAddUserModalVisible(true);
  };

  const handleCancel = () => {
    setIsAddUserModalVisible(false);
    setIsUpdateUserModalVisible(false);
  };

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

  const handleAddUser = async (values: UserCreate) => {
    setLoading(true);
    try {
      await register(values);
      addUserForm.resetFields();
      handleCancel();
      message.success('新增成功');
      setDataSource(await userList());
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (user: UserQuery) => {
    const updatedStatus = user.status === 1 ? 0 : 1;
    await userUpdate({ ...user, status: updatedStatus });
    message.success('更新成功');
    setDataSource(await userList());
  };

  const handleUserUpdate = async (values: UserQuery) => {
    setLoading(true);
    try {
      if (editingUser === null) {
        return;
      }
      await userUpdate({ ...editingUser, ...values });
      handleCancel();
      updateUserForm.resetFields();
      message.success('更新成功');
      setDataSource(await userList());
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = (user: UserQuery) => {
    setUpdatingUser(user);
    updateUserForm.setFieldsValue(user);
    setIsUpdateUserModalVisible(true);
  };

  const handleHide = () => {
    setShowUndo(false);
  };

  const handleUserDelete = async (user: UserQuery) => {
    setLoadingDelete(true);
    try {
      setRecoverUser(user);
      await userDelete(user);
      setDataSource(await userList());
      setShowUndo(true);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleUndo = async () => {
    if (recoverUser) {
      await userRecover(recoverUser);
      setDataSource(await userList());
    }
    setShowUndo(false);
  };

  useEffect(() => {
    userList().then((res) => {
      setDataSource(res);
    });
    return () => {
      setDataSource([]);
    };
  }, []);

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
                style={{ width: 114 }}
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
      <Space className={styles.resultSearch}>
        <Button onClick={showModal} className={`${styles.button} btn-add`}>
          新增
        </Button>
        <Button className={`${styles.button} btn-import`}>导入</Button>
        <Button className={`${styles.button} btn-export`}>导出</Button>
        <Button className={`${styles.button} btn-delete`}>删除</Button>
      </Space>
      <Card bordered={false} className={styles.resultContainer}>
        <Modal
          title="用户新增:"
          open={isAddUserModalVisible}
          onCancel={handleCancel}
          footer={
            <>
              <Button type={'primary'} htmlType="submit" onClick={() => addUserForm.submit()} loading={loading}>
                确定
              </Button>
              <Button onClick={handleCancel}>取消</Button>
            </>
          }
        >
          <Form form={addUserForm} name="user_add_rule" onFinish={handleAddUser}>
            <Form.Item
              {...formItemLayout}
              name="username"
              label="用户名"
              rules={[
                { required: true, message: '必填项' },
                { min: 2, message: '至少2位' },
              ]}
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
        <Modal
          title="用户修改:"
          open={isEditUserModalVisible}
          onCancel={handleCancel}
          footer={
            <>
              <Button type={'primary'} htmlType="submit" onClick={() => updateUserForm.submit()} loading={loading}>
                确定
              </Button>
              <Button onClick={handleCancel}>取消</Button>
            </>
          }
        >
          <Form form={updateUserForm} name="user_edit_rule" onFinish={handleUserUpdate}>
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
        <Table
          dataSource={dataSource}
          columns={columns(onUpdate, handleUserDelete, loadingDelete, handleStatusChange)}
          rowKey={'username'}
          pagination={{ pageSize: 5 }}
          scroll={{ y: 50 * 6 }}
          rowSelection={{ type: 'checkbox' }}
        />
        {showUndo && <UndoComp duration={5} onUndo={handleUndo} onHide={handleHide} />}
      </Card>
    </div>
  );
};

export default UserPage;
