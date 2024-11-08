import { message } from '@/components/GlobalToast';
import UndoComp from '@/components/Undo';
import {
  userAdd,
  userBatchUpdate,
  userDelete,
  userExport,
  userImport,
  userList,
  userRecover,
  userRemove,
  userUpdate,
} from '@/services';
import { UserAdd, UserBatchUpdate, UserEdit, UserQuery, UserQueryForm, UserSearch } from '@/types/user';
import Add from '@/views/system/user/components/Add';
import BatchUpdate from '@/views/system/user/components/BatchUpdate';
import Edit from '@/views/system/user/components/Edit';
import Import from '@/views/system/user/components/Import';
import Search from '@/views/system/user/components/Search';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Pagination,
  Popconfirm,
  PopconfirmProps,
  RadioChangeEvent,
  Space,
  Switch,
  Table,
} from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import type { RcFile } from 'rc-upload/lib/interface';
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

const UserPage: React.FC = () => {
  const { styles } = useStyles();

  const [userAddForm] = Form.useForm();
  const [isUserAddModalVisible, setIsUserAddModalVisible] = useState<boolean>(false);
  const [isUserAddLoading, setIsUserAddLoading] = useState<boolean>(false);
  const handleUserAddCancel = () => {
    setIsUserAddModalVisible(false);
    userAddForm.resetFields();
  };

  const [isUserEditModalVisible, setIsUpdateUserModalVisible] = useState<boolean>(false);
  const [isUserEditLoading, setIsUserEditLoading] = useState<boolean>(false);
  const [userEditForm] = Form.useForm();
  const [editUser, setEditUser] = useState<UserEdit | null>(null);
  const onUserEdit = (user: UserEdit) => {
    setEditUser(user);
    userEditForm.setFieldsValue(user);
    setIsUpdateUserModalVisible(true);
  };
  const handleUserEditCancel = () => {
    setIsUpdateUserModalVisible(false);
    userEditForm.resetFields();
  };
  const handleUserEdit = async (data: UserQuery) => {
    setIsUserEditLoading(true);
    try {
      if (editUser === null) {
        return;
      }
      await userUpdate({ ...editUser, ...data });
      handleUserEditCancel();
      message.success('更新成功');
      await setUserTableData();
    } finally {
      setIsUserEditLoading(false);
    }
  };

  const [isUserImportModalVisible, setIsUserImportModalVisible] = useState<boolean>(false);
  const [isUserImportLoading, setIsUserImportLoading] = useState<boolean>(false);
  const [userImportFile, setUserImportFile] = useState<RcFile | null>(null);
  const handleFileUpload = (uploadFile: RcFile | null) => {
    setUserImportFile(uploadFile);
  };

  const handleUserImportCancel = () => {
    handleFileUpload(null);
    setIsUserImportModalVisible(false);
  };

  const handleUserImport = async () => {
    try {
      setIsUserImportLoading(true);
      if (!userImportFile) {
        message.warning('请先选择上传文件');
        return;
      }
      await userImport(userImportFile);
      message.success('导入成功');
      handleFileUpload(null);
      setIsUserImportModalVisible(false);
    } finally {
      setIsUserImportLoading(false);
    }
  };

  const [userBatchUpdateForm] = Form.useForm();
  const [userQueryForm] = Form.useForm();
  const [isUserBatchUpdateModalVisible, setIsUserBatchUpdateModalVisible] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isUserBatchUpdateLoading, setIsUserBatchUpdateLoading] = useState<boolean>(false);
  const [userBatchUpdateEnable, setUserBatchUpdateEnable] = useState<boolean>(true);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const [isShowUndo, setIsShowUndo] = useState<boolean>(false);
  const [deleteEnabled, setDeleteEnabled] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<UserQuery[] | undefined>([]);
  const [recoverUser, setRecoverUser] = useState<UserQuery | null>(null);
  const [batchStatusValue, setBatchStatusValue] = useState<number>(1);
  const [totalCount, setTotal] = useState<number | undefined>(0);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [userSearch, setUserSearch] = useState<UserSearch>({
    username: undefined,
    nickname: undefined,
    status: undefined,
    create_time: undefined,
  });
  const [userResearchForm, setUserQueryForm] = useState<UserQueryForm>({
    page: 1,
    size: 10,
    ...userSearch,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    if (newSelectedRowKeys.length > 0) {
      setDeleteEnabled(false);
      setUserBatchUpdateEnable(false);
    }
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const confirmDelete: PopconfirmProps['onConfirm'] = async () => {
    const ids = selectedRowKeys.map((key) => Number(key));
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

  const handleChangeState = (value: string) => {
    const status = value ? Number(value) : undefined;
    setUserSearch((prev) => ({
      ...prev,
      status: status,
    }));
  };

  const onBatchStatusChange = (e: RadioChangeEvent) => {
    setBatchStatusValue(e.target.value);
  };
  const onUserImport = () => {
    setIsUserImportModalVisible(true);
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

  const onUserBatchUpdate = () => {
    setIsUserBatchUpdateModalVisible(true);
  };

  const handleShowModal = () => {
    setIsUserAddModalVisible(true);
  };

  const handleUserBatchUpdateCancel = () => {
    setIsUpdateUserModalVisible(false);
    userBatchUpdateForm.resetFields();
  };

  const handleHide = () => {
    setIsShowUndo(false);
  };

  const handleUserAdd = async (data: UserAdd) => {
    setIsUserAddLoading(true);
    try {
      await userAdd(data);
      handleUserAddCancel();
      message.success('新增成功');
      await setUserTableData();
    } finally {
      setIsUserAddLoading(false);
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

  const handleUserBatchUpdate = async (data: UserBatchUpdate) => {
    const ids = selectedRowKeys.map((key) => Number(key));
    if (ids.length === 0) {
      message.warning('请先选择要更新的条目');
      return;
    }
    if (JSON.stringify(data) === '{}') {
      message.warning('请填写更新的信息');
      return;
    }
    try {
      await userBatchUpdate(ids, data);
      setIsUserBatchUpdateLoading(true);
      userBatchUpdateForm.resetFields();
      message.success('更新成功');
      userList(userResearchForm).then(async () => {
        await setUserTableData();
      });
    } finally {
      setIsUserBatchUpdateLoading(false);
      setIsUserBatchUpdateModalVisible(false);
      setSelectedRowKeys([]);
    }
  };

  const handleUserQuery = async (data: UserQueryForm) => {
    const { create_time } = data;
    let timeRange: string | undefined;
    if (create_time && create_time.length === 2) {
      const startDate = create_time[0].startOf('day').unix();
      const endDate = create_time[1].endOf('day').unix();
      timeRange = startDate + ',' + endDate;
    }
    setUserSearch((prev) => ({
      ...prev,
      username: data.username?.trim(),
      nickname: data.nickname?.trim(),
      status: data.status,
      create_time: timeRange,
    }));
    setPage(1);
    setSize(10);
    setUserQueryForm((prev) => ({
      ...prev,
      ...userSearch,
      page: page,
      size: size,
    }));
  };

  const handlePaginationSearch = async (current: number, size: number) => {
    setPage(current);
    setSize(size);
    setUserQueryForm((prev) => ({
      ...prev,
      page: page,
      size: size,
    }));
  };

  const handleQueryReset = () => {
    userQueryForm.resetFields();
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
    setUserQueryForm((prev) => ({
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
    setUserQueryForm((prev) => ({
      ...prev,
      ...userSearch,
      page: page,
      size: size,
    }));
  }, [userSearch, page, size]);

  return (
    <div className={styles.container}>
      <Card bordered={false} className={styles.searchContainer}>
        <Search
          form={userQueryForm}
          handleUserQuery={handleUserQuery}
          handleChangeState={handleChangeState}
          handleQueryReset={handleQueryReset}
        />
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
        <Button
          disabled={userBatchUpdateEnable}
          onClick={onUserBatchUpdate}
          className={`${styles.button} btn-batch-update`}
        >
          修改
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
        <Add
          isModalVisible={isUserAddModalVisible}
          handleCancel={handleUserAddCancel}
          handleUserAdd={handleUserAdd}
          isLoading={isUserAddLoading}
          formProp={userAddForm}
        />
        <Edit
          isModalVisible={isUserEditModalVisible}
          handleCancel={handleUserEditCancel}
          handleUserEdit={handleUserEdit}
          isLoading={isUserEditLoading}
          form={userEditForm}
        />
        <Import
          isModalVisible={isUserImportModalVisible}
          isLoading={isUserImportLoading}
          handleCancel={handleUserImportCancel}
          handleUserImport={handleUserImport}
          handleFileUpload={handleFileUpload}
        />
        <BatchUpdate
          isModalVisible={isUserBatchUpdateModalVisible}
          handleCancel={handleUserBatchUpdateCancel}
          setIsPasswordVisible={setIsPasswordVisible}
          userBatchUpdateForm={userBatchUpdateForm}
          isUserBatchUpdateLoading={isUserBatchUpdateLoading}
          handleUserBatchUpdate={handleUserBatchUpdate}
          onBatchStatusChange={onBatchStatusChange}
          batchStatusValue={batchStatusValue}
          isPasswordVisible={isPasswordVisible}
        />
        <Table
          dataSource={dataSource}
          columns={columns(onUserEdit, handleUserDelete, isLoadingDelete, handleStatusChange)}
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
