import { message } from '@/components/GlobalToast';
import UndoComp from '@/components/Undo';
import {
  register,
  userDelete,
  userExport,
  userExportTemplate,
  userImport,
  userList,
  userRecover,
  userRemove,
  userUpdate,
} from '@/services';
import { UserCreate, UserQuery, UserResearchForm, UserSearch } from '@/types/user';
import { DeleteOutlined, EditOutlined, InboxOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  PopconfirmProps,
  Select,
  Space,
  Switch,
  Table,
  Upload,
} from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import type { RcFile, UploadRequestOption } from 'rc-upload/lib/interface';
import React, { useEffect, useState } from 'react';
import useStyles from './style';

const columns = (
  onUpdate: (user: UserQuery) => void,
  onDelete: (user: UserQuery) => void,
  loadingDelete: boolean,
  handleStatusChange: (user: UserQuery) => void,
) => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    hidden: true,
  },
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
      if (remark && remark.length > 0) {
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
  const [userImportModalVisible, setUserImportModalVisible] = useState<boolean>(false);
  const [userImportLoading, setUserImportLoading] = useState<boolean>(false);
  const [deleteEnabled, setDeleteEnabled] = useState<boolean>(true);
  const [userImportFile, setUserImportFile] = useState<RcFile | null>(null);
  const [dataSource, setDataSource] = useState<UserQuery[] | undefined>([]);
  const [editingUser, setUpdatingUser] = useState<UserQuery | null>(null);
  const [recoverUser, setRecoverUser] = useState<UserQuery | null>(null);
  const [value, setValue] = useState<string>('');
  const [totalCount, setTotal] = useState<number | undefined>(0);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [userSearch, setUserSearch] = useState<UserSearch>({
    username: undefined,
    nickname: undefined,
    status: undefined,
    create_time: undefined,
  });
  const [userResearchForm, setUserResearchForm] = useState<UserResearchForm>({
    page: 1,
    size: 10,
    ...userSearch,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    if (newSelectedRowKeys.length > 0) {
      setDeleteEnabled(false);
    }
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const confirmDelete: PopconfirmProps['onConfirm'] = async () => {
    const ids = selectedRowKeys.map((key) => Number(key));
    console.log(ids);
    await userRemove(ids);
    await setUserTableData();
    message.success('删除成功');
  };

  const confirmCancel: PopconfirmProps['onCancel'] = async () => {
    setSelectedRowKeys([]);
    message.success('删除撤销');
  };

  const rowSelection: TableRowSelection<UserQuery> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onChange = (value: string) => {
    const status = value ? Number(value) : undefined;
    setUserSearch((prev) => ({
      ...prev,
      status: status,
    }));
  };

  const onUpdate = (user: UserQuery) => {
    setUpdatingUser(user);
    userUpdateForm.setFieldsValue(user);
    setIsUpdateUserModalVisible(true);
  };

  const onUserImport = () => {
    setUserImportModalVisible(true);
  };

  const onUserImportCancel = () => {
    setUserImportModalVisible(false);
  };

  const onUserExportTemplate = async () => {
    await userExportTemplate();
  };

  const customUploadRequest = (options: UploadRequestOption): void | undefined => {
    const { onSuccess, onError } = options;
    const file = options.file as RcFile;
    if (!file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) {
      message.error('仅支持xls、xlsx格式文件');
      onError?.(new Error('仅支持xls、xlsx格式文件'));
      setUserImportFile(null);
      return;
    }
    setUserImportFile(file);
    setTimeout(() => {
      onSuccess?.(file);
    }, 300);
  };

  const handleUserImport = async () => {
    try {
      setUserImportLoading(true);
      if (userImportFile) {
        await userImport(userImportFile);
        setUserImportModalVisible(false);
      }
    } finally {
      setUserImportLoading(false);
      setUserImportFile(null);
    }
  };

  const setUserTableData = async () => {
    const { records, total_count } = await userList(userResearchForm);
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

  const handleExport = async () => {
    await userExport(userResearchForm);
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

  const handleUserSearch = async (values: UserResearchForm) => {
    const { create_time } = values;
    let timeRange: string | undefined;
    if (create_time && create_time.length === 2) {
      const startDate = create_time[0].startOf('day').unix();
      const endDate = create_time[1].endOf('day').unix();
      timeRange = startDate + ',' + endDate;
    }
    setUserSearch((prev) => ({
      ...prev,
      username: values.username?.trim(),
      nickname: values.nickname?.trim(),
      status: values.status,
      create_time: timeRange,
    }));
    setPage(1);
    setSize(10);
    setUserResearchForm((prev) => ({
      ...prev,
      ...userSearch,
      page: page,
      size: size,
    }));
  };

  const handlePaginationSearch = async (current: number, size: number) => {
    setPage(current);
    setSize(size);
    setUserResearchForm((prev) => ({
      ...prev,
      page: page,
      size: size,
    }));
  };

  const handleSearchReset = () => {
    userSearchForm.resetFields();
    setPage(1);
    setSize(10);
    setUserSearch((prev) => ({
      ...prev,
      page: page,
      size: size,
      username: undefined,
      nickname: undefined,
      status: undefined,
      create_time: undefined,
    }));
    setUserResearchForm((prev) => ({
      ...prev,
      ...userSearch,
    }));
  };

  useEffect(() => {
    userList(userResearchForm).then(async () => {
      await setUserTableData();
    });
    return () => {
      setDataSource([]);
    };
  }, [userResearchForm]);

  useEffect(() => {
    setUserResearchForm((prev) => ({
      ...prev,
      ...userSearch,
      page: page,
      size: size,
    }));
  }, [userSearch, page, size]);

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
            <Form.Item name="create_time" label="创建日期">
              <DatePicker.RangePicker />
            </Form.Item>
            <Form.Item name="status" label="状态">
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
                <Button onClick={handleSearchReset}>重置</Button>
              </Form.Item>
            </div>
          </Space>
        </Form>
      </Card>
      <Space className={styles.resultSearch}>
        <Button onClick={handleShowModal} className={`${styles.button} btn-add`}>
          新增
        </Button>
        <Button onClick={onUserImport} className={`${styles.button} btn-import`}>
          导入
        </Button>
        <Button onClick={handleExport} className={`${styles.button} btn-export`}>
          导出
        </Button>
        <Popconfirm
          title="删除所选的内容"
          description="你确定删除吗? 删除后将无法找回"
          onConfirm={confirmDelete}
          onCancel={confirmCancel}
          okText="是"
          cancelText="否"
        >
          <Button disabled={deleteEnabled} className={`${styles.button} btn-delete`}>
            删除
          </Button>
        </Popconfirm>
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
        <Modal
          title="用户导入:"
          open={userImportModalVisible}
          onCancel={onUserImportCancel}
          onOk={handleUserImport}
          loading={userImportLoading}
        >
          <div>
            <Upload.Dragger name="file" maxCount={1} accept=".xlsx" customRequest={customUploadRequest as any}>
              <p className="sc-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="sc-upload-text">{'点击或拖拽到此上传'}</p>
              <p className="sc-upload-hint">仅支持上传xls、xlsx格式文件</p>
            </Upload.Dragger>
          </div>
          <div>
            <Button type={'link'} onClick={onUserExportTemplate}>
              下载模板
            </Button>
          </div>
        </Modal>
        <Table
          dataSource={dataSource}
          columns={columns(onUpdate, handleUserDelete, isLoadingDelete, handleStatusChange)}
          rowKey={'id'}
          pagination={false}
          rowSelection={rowSelection}
          style={{ minHeight: 640 }}
        />
        <div style={{ margin: 8 }}>
          <Pagination
            current={page}
            pageSize={size}
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
