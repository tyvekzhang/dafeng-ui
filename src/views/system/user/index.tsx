import { message } from '@/components/GlobalToast';
import UndoComp from '@/components/Undo';
import { register, userDelete, userList, userRecover, userUpdate } from '@/services';
import { TableParams } from '@/types/common';
import { UserCreate, UserQuery } from '@/types/user';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Modal,
  Pagination,
  Select,
  Space,
  Switch,
  Table,
  theme,
} from 'antd';
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

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};

const UserPage: React.FC = () => {
  const { styles } = useStyles();
  const [userCreateForm] = Form.useForm();
  const [userUpdateForm] = Form.useForm();
  const [userSearchForm] = Form.useForm();
  const [isUserCreateModalVisible, setIsUserCreateModalVisible] = useState<boolean>(false);
  const [isUserUpdateModalVisible, setIsUpdateUserModalVisible] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const [isShowUndo, setIsShowUndo] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<UserQuery[] | undefined>([]);
  const [editingUser, setUpdatingUser] = useState<UserQuery | null>(null);
  const [recoverUser, setRecoverUser] = useState<UserQuery | null>(null);
  const [value, setValue] = useState<string>('');
  const [totalCount, setTotal] = useState<number | undefined>(0);
  const [tableParams, setTableParams] = useState<TableParams>({
    page: 1,
    size: 10,
  });

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

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onUpdate = (user: UserQuery) => {
    setUpdatingUser(user);
    userUpdateForm.setFieldsValue(user);
    setIsUpdateUserModalVisible(true);
  };

  const setUserTableData = async () => {
    const { records, total_count } = await userList(tableParams);
    setDataSource(records);
    setTotal(total_count);
  };

  const handleUndo = async () => {
    if (recoverUser) {
      await userRecover(recoverUser);
    }
    setIsShowUndo(false);
    await setUserTableData();
  };

  const handleShowModal = () => {
    setIsUserCreateModalVisible(true);
  };

  const handleCancel = () => {
    setIsUserCreateModalVisible(false);
    setIsUpdateUserModalVisible(false);
  };

  const handleHide = () => {
    setIsShowUndo(false);
  };

  const handleAddUser = async (values: UserCreate) => {
    setIsLoading(true);
    try {
      await register(values);
      userCreateForm.resetFields();
      handleCancel();
      message.success('新增成功');
      await setUserTableData();
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserDelete = async (user: UserQuery) => {
    setIsLoadingDelete(true);
    try {
      setRecoverUser(user);
      await userDelete(user);
      await setUserTableData();
      setIsShowUndo(true);
    } finally {
      setIsLoadingDelete(false);
    }
  };

  const handleStatusChange = async (user: UserQuery) => {
    const updatedStatus = user.status === 1 ? 0 : 1;
    await userUpdate({ ...user, status: updatedStatus });
    message.success('更新成功');
    await setUserTableData();
  };

  const handleUserUpdate = async (values: UserQuery) => {
    setIsLoading(true);
    try {
      if (editingUser === null) {
        return;
      }
      await userUpdate({ ...editingUser, ...values });
      handleCancel();
      userUpdateForm.resetFields();
      message.success('更新成功');
      await setUserTableData();
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSearch = (values: any) => {
    alert(JSON.stringify(values));
  };

  const handlePaginationSearch = async (current: number, size: number) => {
    setTableParams((prev) => ({
      ...prev,
      page: current,
      size: size,
    }));
    await setUserTableData();
  };

  useEffect(() => {
    const getUserData = async () => {
      await setUserTableData();
    };
    getUserData().catch((err) => console.log(err));
  }, [tableParams]);

  return (
    <div className={styles.container}>
      <Card bordered={false} className={styles.searchContainer}>
        <Form form={userSearchForm} name="user_search_rule" onFinish={handleUserSearch}>
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
                <Button onClick={() => userSearchForm.resetFields()}>重置</Button>
              </Form.Item>
            </div>
          </Space>
        </Form>
      </Card>
      <Space className={styles.resultSearch}>
        <Button onClick={handleShowModal} className={`${styles.button} btn-add`}>
          新增
        </Button>
        <Button className={`${styles.button} btn-import`}>导入</Button>
        <Button className={`${styles.button} btn-export`}>导出</Button>
        <Button className={`${styles.button} btn-delete`}>删除</Button>
      </Space>
      <Card bordered={false} className={styles.resultContainer}>
        <Modal
          title="用户新增:"
          open={isUserCreateModalVisible}
          onCancel={handleCancel}
          footer={
            <>
              <Button type={'primary'} htmlType="submit" onClick={() => userCreateForm.submit()} loading={isLoading}>
                确定
              </Button>
              <Button onClick={handleCancel}>取消</Button>
            </>
          }
        >
          <Form form={userCreateForm} name="user_add_rule" onFinish={handleAddUser}>
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
                visibilityToggle={{ visible: isPasswordVisible, onVisibleChange: setIsPasswordVisible }}
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
          open={isUserUpdateModalVisible}
          onCancel={handleCancel}
          footer={
            <>
              <Button type={'primary'} htmlType="submit" onClick={() => userUpdateForm.submit()} loading={isLoading}>
                确定
              </Button>
              <Button onClick={handleCancel}>取消</Button>
            </>
          }
        >
          <Form form={userUpdateForm} name="user_edit_rule" onFinish={handleUserUpdate}>
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
          columns={columns(onUpdate, handleUserDelete, isLoadingDelete, handleStatusChange)}
          rowKey={'username'}
          pagination={false}
          scroll={{ y: 50 * 6 }}
          rowSelection={{ type: 'checkbox' }}
        />
        <div style={{ margin: 8 }}>
          <Pagination
            defaultCurrent={tableParams?.page}
            pageSize={tableParams?.size}
            total={totalCount}
            align="end"
            showSizeChanger
            showQuickJumper
            onChange={handlePaginationSearch}
          />
        </div>
        {isShowUndo && <UndoComp duration={5} onUndo={handleUndo} onHide={handleHide} />}
      </Card>
    </div>
  );
};

export default UserPage;
