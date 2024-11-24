import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Menu,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  type TableProps,
  Tabs,
  Tooltip,
} from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  ClearOutlined,
  CloseOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  SaveOutlined,
  SearchOutlined,
  TableOutlined,
} from '@ant-design/icons';
import useStates from './style';
import { Database, DatabaseConnection, TableAdd, TableColumn, TableIndex, TableInfo } from '@/types/db_manage';
import {
  fetchConnections,
  fetchDatabases,
  fetchIndexStructure,
  fetchTables,
  fetchTableStructure,
  fieldGenerate,
  tableAdd,
} from '@/services/db_manage';
import EditableCell from '@/components/EditableCell';

const { SubMenu } = Menu;
const { TabPane } = Tabs;

const formPropItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 12 },
};

const DatabaseExplorer: React.FC = () => {
  const { styles } = useStates();
  const [databaseType, setDatabaseType] = useState('');
  const [connections, setConnections] = useState<DatabaseConnection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const handleFieldChange = (newValue: Partial<TableColumn>, index: number, field: string) => {
    setFieldDataSource(prevState =>
      prevState.map((item, i) =>
        i === index ? { ...item, [field]: newValue } : item,
      ),
    );
  };
  const handleIndexChange = (newValue: Partial<TableIndex>, index: number, field: string) => {
    setIndexDataSource(prevState =>
      prevState.map((item, i) =>
        i === index ? { ...item, [field]: newValue } : item,
      ),
    );
  };
  const [databases, setDatabases] = useState<Database[]>([]);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null);
  const [fieldDataSource, setFieldDataSource] = useState<TableColumn[]>([]);
  const [indexDataSource, setIndexDataSource] = useState<TableIndex[]>([]);
  const [isEditable, setIsEditable] = useState(false);
  const [isClearAble, setIsClearAble] = useState(false);
  const [tableDatabases, setTableDatabases] = useState<Database[]>([]);

  const handleDatabaseTypeChange = (value: string) => {
    setDatabaseType(value);
    if (value === 'mysql') {
      dataSourceForm.setFieldsValue({ port: '3306' });
    } else if (value === 'postgresql') {
      dataSourceForm.setFieldsValue({ port: '5432' });
    }
  };

  const handleTableDatasourceTypeChange = (connection_id: number) => {
    fetchDatabases(connection_id).then(setTableDatabases);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSourceForm] = Form.useForm();
  const [databaseForm] = Form.useForm();
  const [tableForm] = Form.useForm();
  const [fieldForm] = Form.useForm();
  const [fieldData, setFieldData] = useState<TableColumn[]>([]);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record: TableColumn) => record.key === editingKey;
  const edit = (record: Partial<TableColumn> & { key: React.Key }) => {
    fieldForm.setFieldsValue({
      name: '',
      type: '',
      length: '',
      decimals: '',
      not_null: '',
      default: '',
      remark: '', ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    setEditingKey('');
  };

  useEffect(() => {
    fetchConnections().then(setConnections);
  }, []);


  const handleEditableChange = (checked: boolean) => {
    setIsEditable(checked);
    setIsClearAble(checked);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    dataSourceForm.resetFields();
  };

  const handleDatasourceSubmit = (values: any) => {
    console.log('Form values:', values);

    return;
    // Here you would typically send this data to your backend
    // and then update the state with the new connection/database/table
    setIsModalVisible(false);
    dataSourceForm.resetFields();
  };

  const handleTableSubmit = async (data: TableAdd) => {
    await tableAdd(data);
    setIsModalVisible(false);
    tableForm.resetFields();
  };

  const handleConnectionClick = async (connection: DatabaseConnection) => {
    fetchDatabases(connection.id).then(setDatabases);
  };

  const handleDatabaseClick = async (database: Database) => {
    fetchTables(database.id).then(setTables);
  };

  const handleTableClick = async (tableInfo: TableInfo) => {
    setIsEditable(false);
    setSelectedTable(tableInfo);
    fetchTableStructure(tableInfo.id).then(setFieldData);
    fetchIndexStructure(tableInfo.id).then(setIndexDataSource);
  };

  const handleAddField = () => {
    const newField: TableColumn = {
      name: '',
      type: '',
      length: undefined,
      decimals: undefined,
      not_null: false,
      default: '',
      remark: '',
    };
    setFieldDataSource([...fieldDataSource, newField]);
  };

  const handleAddIndex = () => {
    const newIndex: TableIndex = {
      name: '',
      type: '',
      field: '',
      remark: '',
    };
    setIndexDataSource([...indexDataSource, newIndex]);
  };

  const handleSave = async () => {

  };

  const handleSaveField = async () => {
    if (selectedTable) {
      await fieldGenerate(selectedTable, fieldDataSource, indexDataSource);
    }
  };

  const handleDeleteField = (index: number) => {
    const newFieldDataSource = [...fieldDataSource];
    newFieldDataSource.splice(index, 1);
    setFieldDataSource(newFieldDataSource);
  };

  const handleDeleteIndex = (index: number) => {
    const newIndexDataSource = [...indexDataSource];
    newIndexDataSource.splice(index, 1);
    setIndexDataSource(newIndexDataSource);
  };

  const handleClearFields = () => {
    setFieldDataSource([]);
  };

  const handleClearIndexes = () => {
    setIndexDataSource([]);
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < fieldDataSource.length - 1)
    ) {
      const newFieldDataSource = [...fieldDataSource];
      const temp = newFieldDataSource[index];
      newFieldDataSource[index] = newFieldDataSource[index + (direction === 'up' ? -1 : 1)];
      newFieldDataSource[index + (direction === 'up' ? -1 : 1)] = temp;
      setFieldDataSource(newFieldDataSource);
    }
  };

  const handleMoveIndex = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < indexDataSource.length - 1)
    ) {
      const newIndexDataSource = [...indexDataSource];
      const temp = newIndexDataSource[index];
      newIndexDataSource[index] = newIndexDataSource[index + (direction === 'up' ? -1 : 1)];
      newIndexDataSource[index + (direction === 'up' ? -1 : 1)] = temp;
      setIndexDataSource(newIndexDataSource);
    }
  };

  const columns = [
    {
      title: '主键',
      dataIndex: 'key',
      key: 'key',
      hidden: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      width: '14%',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: '14%',
      render: (text: string, record: TableColumn, index: number) => (
        <Select
          value={text}
          onChange={(value) => handleFieldChange(value, index, 'type')}
          disabled={!isEditable}
          style={{ width: '104px' }}
          defaultValue="varchar"
        >
          <Select.Option value="int">INT</Select.Option>
          <Select.Option value="varchar">VARCHAR</Select.Option>
          <Select.Option value="text">TEXT</Select.Option>
        </Select>
      ),
    },
    {
      title: '长度',
      dataIndex: 'length',
      key: 'length',
      editable: true,
      width: '10%',
    },
    {
      title: '分数位',
      dataIndex: 'decimals',
      key: 'decimals',
      editable: true,
      width: '10%',
    },
    {
      title: '非空',
      dataIndex: 'not_null',
      key: 'not_null',
      render: (value: boolean, record: TableColumn, index: number) => (
        <Checkbox
          checked={value}
          onChange={(e) => handleFieldChange({ not_null: e.target.checked }, index, 'not_null')}
          disabled={!isEditable}
        />
      ),
      width: '8%',
    },
    {
      title: '默认值',
      dataIndex: 'default',
      key: 'default',
      editable: true,
      width: '8%',
      ellipsis: true,
    },
    {
      title: '索引',
      dataIndex: 'index_col',
      key: 'index_col',
      render: (value: boolean, record: TableColumn, index: number) => (
        <Checkbox
          checked={value}
          onChange={(e) => handleFieldChange({ not_null: e.target.checked }, index, 'key')}
          disabled={!isEditable}
        />
      ),
      width: '8%',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      editable: true,
      width: '12%',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: '16%',
      render: (text: string, record: TableColumn, index: number) => {
        const isFirst = index === 0;
        const isLast = index === fieldDataSource.length - 1;
        const editable = isEditing(record);

        return (
          <Space>
            {editable ? (
              <div style={{display: 'flex', gap: 8, }}>
                <Tooltip title="暂存">
                  <Button
                    size={'small'}
                    onClick={() => save(record.key)}
                    type="primary"
                    icon={<SaveOutlined />}
                  />
                </Tooltip>
                <Tooltip title="取消">
                  <Button
                    size={'small'}
                    onClick={() => setEditingKey('')}
                    icon={<CloseOutlined />}
                  />
                </Tooltip>
              </div>
            ) : (
              <>
                <Tooltip title="上移">
                  <Button
                    size={'small'}
                    icon={<ArrowUpOutlined />}
                    onClick={() => handleMoveField(index, 'up')}
                    disabled={!isEditable || isFirst || !!editingKey}
                  />
                </Tooltip>
                <Tooltip title="下移">
                  <Button
                    size={'small'}
                    icon={<ArrowDownOutlined />}
                    onClick={() => handleMoveField(index, 'down')}
                    disabled={!isEditable || isLast || !!editingKey}
                  />
                </Tooltip>
                <Tooltip title="编辑">
                  <Button
                    size={'small'}
                    icon={<EditOutlined />}
                    type={'link'}
                    disabled={!isEditable || !!editingKey}
                    onClick={() => {
                      setEditingKey(record.key);
                      edit(record);
                    }}
                  />
                </Tooltip>
                <Popconfirm
                  title="确定要删除这行吗？"
                  onConfirm={() => handleDeleteField(index)}
                  okText="是"
                  cancelText="否"
                  disabled={!!editingKey}
                >
                  <Tooltip title="删除">
                    <Button
                      size={'small'}
                      icon={<DeleteOutlined />}
                      disabled={!isEditable || !!editingKey}
                    />
                  </Tooltip>
                </Popconfirm>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  const mergedColumns: TableProps<TableColumn>['columns'] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: TableColumn) => ({
        record,
        inputType: col.dataIndex === 'length' || col.dataIndex === 'decimals' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const indexColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: TableIndex, index: number) => (
        <Input
          value={text}
          onChange={(e) => handleIndexChange({ name: e.target.value }, index, 'name')}
          disabled={!isEditable}
        />
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: string, record: TableIndex, index: number) => (
        <Select
          value={text}
          onChange={(value) => handleIndexChange({ type: value }, index, 'type')}
          disabled={!isEditable}
        >
          <Select.Option value="index">INDEX</Select.Option>
          <Select.Option value="unique">UNIQUE</Select.Option>
          <Select.Option value="fulltext">FULLTEXT</Select.Option>
        </Select>
      ),
    },
    {
      title: '字段',
      dataIndex: 'field',
      key: 'field',
      render: (text: string, record: TableIndex, index: number) => (
        <Input
          value={text}
          onChange={(e) => handleIndexChange({ field: e.target.value }, index, 'field')}
          disabled={!isEditable}
        />
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (text: string, record: TableIndex, index: number) => (
        <Input
          value={text}
          onChange={(e) => handleIndexChange({ remark: e.target.value }, index, 'remark')}
          disabled={!isEditable}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: TableIndex, index: number) => (
        <Space>
          <Button
            icon={<ArrowUpOutlined />}
            onClick={() => handleMoveIndex(index, 'up')}
            disabled={!isEditable || index === 0}
          />
          <Button
            icon={<ArrowDownOutlined />}
            onClick={() => handleMoveIndex(index, 'down')}
            disabled={!isEditable || index === indexDataSource.length - 1}
          />
          <Popconfirm
            title="确定要删除这行吗？"
            onConfirm={() => handleDeleteIndex(index)}
            okText="是"
            cancelText="否"
          >
            <Button icon={<DeleteOutlined />} disabled={!isEditable} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredFieldDataSource = fieldDataSource.filter(field =>
    field?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field?.remark?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.leftContent}>
          <div style={{ padding: '16px 24px 0' }}>
            <Input prefix={<SearchOutlined />} placeholder="Search..." />
          </div>
          <Button
            className={`${styles.button} btn-add`}
            style={{ width: '25%', marginLeft: '24px', marginTop: '8px' }}
            onClick={showModal}
          >
            新增
          </Button>
          <Menu
            mode="inline"
            triggerSubMenuAction="click"
            style={{ height: 'calc(100vh - 196px)', borderRight: 0, overflow: 'scroll' }}
          >
            {connections.map((connection) => (
              <SubMenu
                key={connection.id}
                icon={<LinkOutlined />}
                title={connection.connection_name}
                onTitleClick={() => handleConnectionClick(connection)}
              >
                {databases?.map((database) => (
                  <SubMenu
                    key={database.id}
                    icon={<DatabaseOutlined />}
                    title
                      ={database.database_name}
                    onTitleClick={() => handleDatabaseClick(database)}
                  >
                    {tables?.map((table) => (
                      <Menu.Item key={table.id} icon={<TableOutlined />} onClick={() => handleTableClick(table)}>
                        {table.name}
                      </Menu.Item>
                    ))}
                  </SubMenu>
                ))}
              </SubMenu>
            ))}
          </Menu>
        </div>
        <div className={styles.rightContent}>
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="表结构" key="1">
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 12 }}>
                <Space style={{ padding: '8px 0', marginBottom: '16px' }}>
                  <Button className={`${styles.button} btn-add`} onClick={handleAddField} disabled={!isEditable}>
                    新增
                  </Button>
                  <Button type="primary" onClick={handleSaveField} disabled={!isEditable}>
                    保存
                  </Button>
                  <Popconfirm
                    title="确定要清空所有字段吗？"
                    onConfirm={handleClearFields}
                    okText="是"
                    cancelText="否"
                  >
                    <Button icon={<ClearOutlined />} disabled={!isClearAble}>
                      清空
                    </Button>
                  </Popconfirm>
                </Space>
                <Space>
                  <Input
                    allowClear
                    prefix={<SearchOutlined />}
                    placeholder="搜索字段或备注..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 200 }}
                  />
                  <Switch
                    checkedChildren="编辑"
                    unCheckedChildren="预览"
                    checked={isEditable}
                    onChange={handleEditableChange}
                  />
                </Space>
              </div>
              <Form form={fieldForm} component={false}>
                <Table<TableColumn>

                  components={{
                    body: { cell: EditableCell },
                  }}
                  columns={mergedColumns}
                  dataSource={fieldData}
                  rowKey="name"
                  pagination={{ onChange: cancel }}
                />
              </Form>
            </TabPane>

            <TabPane tab="索引" key="2">
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 12 }}>
                <Space style={{ padding: '8px 0', marginBottom: '16px' }}>
                  <Button className={`${styles.button} btn-add`} onClick={handleAddIndex} disabled={!isEditable}>
                    新增
                  </Button>
                  <Button type="primary" onClick={handleSave} disabled={!isEditable}>
                    保存
                  </Button>
                  <Popconfirm
                    title="确定要清空所有索引吗？"
                    onConfirm={handleClearIndexes}
                    okText="是"
                    cancelText="否"
                  >
                    <Button icon={<ClearOutlined />} disabled={!isClearAble}>
                      清空
                    </Button>
                  </Popconfirm>
                </Space>
                <Switch
                  checkedChildren="可编辑"
                  unCheckedChildren="只读"
                  checked={isEditable}
                  onChange={handleEditableChange}
                  style={{ marginTop: '16px' }}
                />
              </div>
              <Table columns={indexColumns} dataSource={indexDataSource} rowKey="name" />
            </TabPane>
          </Tabs>
        </div>
      </div>

      <Modal title="新增" open={isModalVisible} onCancel={handleCancel} footer={null} width={760}>
        <Tabs defaultActiveKey="3" type="card">
          <TabPane tab="数据源" key="1">
            <Form {...formPropItemLayout} form={dataSourceForm} onFinish={handleDatasourceSubmit}>
              <Form.Item name="databaseType" label="类型" rules={[{ required: true }]} initialValue={databaseType}>
                <Select onChange={handleDatabaseTypeChange}>
                  <Select.Option value="mysql">MySQL</Select.Option>
                  <Select.Option value="postgresql">PostgreSQL</Select.Option>
                  <Select.Option value="sqlite">Sqlite</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="connectionName" label="名称" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              {databaseType === 'mysql' && (
                <Form.Item name="port" wrapperCol={{ span: 4 }} label="端口号" rules={[{ required: true }]}>
                  <Input defaultValue={'3306'} />
                </Form.Item>
              )}
              {databaseType === 'postgresql' && (
                <Form.Item name="port" wrapperCol={{ span: 4 }} label="端口号" rules={[{ required: true }]}>
                  <Input defaultValue={'5432'} />
                </Form.Item>
              )}
              {databaseType === 'sqlite' && (
                <Form.Item name="dbName" label="库名" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              )}
              {(databaseType === 'mysql' || databaseType === 'postgresql') && (
                <>
                  <Form.Item name="username" label="用户" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="password" label="密码" rules={[{ required: true }]}>
                    <Input.Password />
                  </Form.Item>
                </>
              )}
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="数据库" key="2">
            <Form {...formPropItemLayout} form={databaseForm} onFinish={handleDatasourceSubmit}>
              <Form.Item name="databaseName" label="数据源" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="default">默认</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="databaseName" label="数据库" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="charset" label="字符集" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="utf8mb4">UTF-8 Unicode (utf8mb4)</Select.Option>
                  <Select.Option value="latin1">Latin1 (latin1)</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="collation" label="排序" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="utf8mb4_general_ci">utf8mb4_general_ci</Select.Option>
                  <Select.Option value="utf8mb4_unicode_ci">utf8mb4_unicode_ci</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="表名" key="3">
            <Form form={tableForm} onFinish={handleTableSubmit} {...formPropItemLayout}>
              <Form.Item name="datasourceId" label="数据源" rules={[{ required: true }]}>
                <Select onChange={handleTableDatasourceTypeChange} placeholder="请选择数据源">
                  {connections?.map(connection => (
                    <Select.Option key={connection.id} value={connection.id}>
                      {connection.connection_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="databaseId" label="数据库" rules={[{ required: true }]}>
                <Select placeholder="请选择数据库">
                  {tableDatabases?.map(tableDatabase => (
                    <Select.Option value={tableDatabase.id}>{tableDatabase.database_name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="tableName" label="表名" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default DatabaseExplorer;

