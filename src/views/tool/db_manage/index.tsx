import EditableCell from '@/components/EditableCell';
import {
  fetchConnections,
  fetchDatabases,
  fetchIndexStructure,
  fetchTables,
  fetchTableStructure,
  tableGenerate,
  tableAdd,
} from '@/services/db_manage';
import {
  Database,
  DatabaseConnection,
  TableAdd,
  TableColumn,
  TableIndex,
  TableInfo,
  TableMetadata,
} from '@/types/db_manage';
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
import React, { useEffect, useState } from 'react';
import useStates from './style';
import { message } from '@/components/GlobalToast';

const { SubMenu } = Menu;
const { TabPane } = Tabs;

const formPropItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 12 },
};

const tableFormPropItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 7 },
};

const DatabaseExplorer: React.FC = () => {
  const { styles } = useStates();
  const [databaseType, setDatabaseType] = useState('');
  const [connections, setConnections] = useState<DatabaseConnection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fieldType, setFieldType] = useState<string>('varchar');
  const [activateKey, setActivateKey] = useState<string>("1");

  const handleTabChange = (key: string) => {
    setActivateKey(key);
  };

  const handleFieldTypeChange = (value: string) => {
    setFieldType(value);
  }
  const handleFieldChange = (newValue: Partial<TableColumn>, index: number) => {
    setFieldDataSource((prevState) =>
      prevState.map((item, i) =>
        i === index ? { ...item, ...newValue } : item
      ),
    );
  };
  const handleIndexChange = (newValue: Partial<TableIndex>, index: number, field: string) => {
    setIndexDataSource((prevState) =>
      prevState.map((item, i) => (i === index ? { ...item, [field]: newValue } : item)),
    );
  };
  const [databases, setDatabases] = useState<Database[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<Database | null>(null);
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
  const [indexForm] = Form.useForm();
  const [tableMetadataForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [editingIndexKey, setEditingIndexKey] = useState('');
  const isEditing = (record: TableColumn) => record.key === editingKey;
  const isIndexEditing = (record: TableIndex) => record.key === editingIndexKey;
  const edit = (record: Partial<TableColumn> & { key?: React.Key }) => {
    const key = record.key ? record.key : Date.now().toString();
    fieldForm.setFieldsValue({
      key: key,
      name: undefined,
      type: undefined,
      default: undefined,
      length: undefined,
      scale: undefined,
      nullable: false,
      primary_key: false,
      comment: '',
      ...record,
    });

    setEditingKey(key);
  };

  const editIndex = (record: Partial<TableIndex> & { key?: React.Key }) => {
    const key = record.key ? record.key : Date.now().toString();

    fieldForm.setFieldsValue({
      key: key,
      name: undefined,
      type: undefined,
      field: undefined,
      comment: undefined,
      ...record,
    });

    setEditingIndexKey(key);
  };

  const cancel = () => {
    setEditingKey('');
    fieldForm.resetFields()
  };

  const cancelIndex = () => {
    setEditingIndexKey('');
    indexForm.resetFields()
  };

  const tmpSaveFieldData = async (key: React.Key) => {
    try {
      // Validate and get the form values
      const editRow = await fieldForm.validateFields() as TableColumn;

      // Merge the form values with the field type
      const updatedRow = { ...editRow, type: fieldType };

      // Create a new array from the data source
      const newData = [...fieldDataSource];

      // Find the index of the item with the matching key
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        // If the item is found, replace it with the updated row
        newData.splice(index, 1, {
          ...newData[index],
          ...updatedRow,
        });
      } else {
        // If the item is not found, add the updated row to the array
        newData.push(updatedRow);
      }

      // Update the data source and reset the editing key
      setFieldDataSource(newData);
      setEditingKey('');
      fieldForm.resetFields()

    } catch (errInfo) {
      // Log validation errors
      console.log('Validate Failed:', errInfo);
    }
  };

  const tmpSaveIndexData = async (key: React.Key) => {
    try {
      // Validate and get the form values
      const editRow = await indexForm.validateFields() as TableIndex;

      // Merge the form values with the field type
      const updatedRow = { ...editRow, type: fieldType };

      // Create a new array from the data source
      const newData = [...indexDataSource];

      // Find the index of the item with the matching key
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        // If the item is found, replace it with the updated row
        newData.splice(index, 1, {
          ...newData[index],
          ...updatedRow,
        });
      } else {
        // If the item is not found, add the updated row to the array
        newData.push(updatedRow);
      }

      // Update the data source and reset the editing key
      setIndexDataSource(newData);
      setEditingIndexKey('');
      indexForm.resetFields()

    } catch (errInfo) {
      // Log validation errors
      console.log('Validate Failed:', errInfo);
    }
  };

  useEffect(() => {
    fetchConnections().then(setConnections);
  }, []);

  useEffect(() => {
    if(selectedDatabase !== null) {
      setIsEditable(true);
    }
  }, [selectedDatabase]);

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
    setSelectedDatabase(null)
    setSelectedTable(null)
    setFieldDataSource([])
    setIndexDataSource([])
  };

  const handleDatabaseClick = async (database: Database) => {
    fetchTables(database.id).then(setTables);
    setSelectedDatabase(database)
    setSelectedTable(null)
    setFieldDataSource([])
    setIndexDataSource([])
  };

  const handleTableClick = async (tableInfo: TableInfo) => {
    setIsEditable(false);
    setSelectedTable(tableInfo);
    fetchTableStructure(tableInfo.id).then(setFieldDataSource);
    fetchIndexStructure(tableInfo.id).then(setIndexDataSource);
  };

  const handleAddField = () => {
    const newField: TableColumn = {
      key: Date.now().toString(),
      name: '',
      type: undefined,
      default: '',
      length: undefined,
      scale: undefined,
      nullable: false,
      primary_key: false,
      comment: '',
      autoincrement: false,
      sort: 0,
    };
    setFieldDataSource([...fieldDataSource, newField]);
    setEditingKey(newField.key)
  };

  const handleAddIndex = () => {
    const newIndex: TableIndex = {
      key: Date.now().toString(),
      name: '',
      type: '',
      field: '',
      comment: undefined,
    };
    setIndexDataSource([...indexDataSource, newIndex]);
    setEditingIndexKey(newIndex.key)
  };

  const handleSaveIndex = async () => {
    setActivateKey("3")
  };

  const handleSave = async () => {
    if (selectedDatabase === null) {
      message.error('请先选择数据库再操作');
      return
    }
    const tableMetadata = await tableMetadataForm.validateFields() as TableMetadata
    await tableGenerate(selectedDatabase.id, tableMetadata, fieldDataSource, indexDataSource);
    setActivateKey("1");
  };

  const handleSaveField = async () => {
    if (fieldDataSource === null || fieldDataSource === undefined) {
      message.error("请先添加字段信息")
      return
    }
    setActivateKey("2")
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

  const handleClearTableMetadata = () => {
    tableMetadataForm.resetFields();
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < fieldDataSource.length - 1)) {
      const newFieldDataSource = [...fieldDataSource];
      const temp = newFieldDataSource[index];
      newFieldDataSource[index] = newFieldDataSource[index + (direction === 'up' ? -1 : 1)];
      newFieldDataSource[index + (direction === 'up' ? -1 : 1)] = temp;
      setFieldDataSource(newFieldDataSource);
    }
  };

  const handleMoveIndex = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < indexDataSource.length - 1)) {
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
      width: '15%',
      ellipsis: true,
      required: true
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: '13%',
      required: true,
      render: (text: string) => (
        <Select
          value={text}
          onChange={(value) => handleFieldTypeChange(value)}
          disabled={!isEditable}
          style={{ width: '96px' }}
          defaultValue={fieldType}
        >
          <Select.Option value="int">int</Select.Option>
          <Select.Option value="varchar">varchar</Select.Option>
          <Select.Option value="text">text</Select.Option>
        </Select>
      ),
    },
    {
      title: '总长度',
      dataIndex: 'length',
      key: 'length',
      editable: true,
      width: '10%',
    },
    {
      title: '分数位',
      dataIndex: 'scale',
      key: 'scale',
      editable: true,
      width: '10%',
    },
    {
      title: '默认值',
      dataIndex: 'default',
      key: 'default',
      editable: true,
      width: '10%',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
      editable: true,
      width: '10%',
      ellipsis: true,
    },
    {
      title: '可空',
      dataIndex: 'nullable',
      key: 'nullable',
      render: (value: boolean, record: TableColumn, index: number) => (
        <Checkbox
          checked={value}
          onChange={(e) => handleFieldChange({ nullable: e.target.checked }, index)}
          disabled={!isEditing(record)}
        />
      ),
      width: '8%',
    },
    {
      title: '主键',
      dataIndex: 'primary_key',
      key: 'primary_key',
      render: (value: boolean, record: TableColumn, index: number) => (
        <Checkbox
          checked={value}
          onChange={(e) => handleFieldChange({ primary_key: e.target.checked }, index)}
          disabled={!isEditing(record)}
        />
      ),
      width: '8%',
    },
    {
      title: '自增',
      dataIndex: 'autoincrement',
      key: 'autoincrement',
      render: (value: boolean, record: TableColumn, index: number) => (
        <Checkbox
          checked={value}
          onChange={(e) => handleFieldChange({ primary_key: e.target.checked }, index)}
          disabled={!isEditing(record)}
        />
      ),
      width: '8%',
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
              <div style={{ display: 'flex', gap: 8 }}>
                <Tooltip title="暂存">
                  <Button size={'small'} onClick={() => tmpSaveFieldData(record.key)} type="primary" icon={<SaveOutlined />} />
                </Tooltip>
                <Tooltip title="取消">
                  <Button size={'small'} onClick={()=> cancel()} icon={<CloseOutlined />} />
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
                    <Button size={'small'} icon={<DeleteOutlined />} disabled={!isEditable || !!editingKey} />
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
        inputType: col.dataIndex === 'length' || col.dataIndex === 'scale' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        required: col.required
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
      editable: true,
      required: true,
      width: "15%"
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
          style={{ width: '104px' }}
        >
          <Select.Option value="index">INDEX</Select.Option>
          <Select.Option value="unique">UNIQUE</Select.Option>
          <Select.Option value="fulltext">FULLTEXT</Select.Option>
        </Select>
      ),
      width: "15%"
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
      editable: true,
      required: true,
      width: "32%"
    },
    {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
      render: (text: string, record: TableIndex, index: number) => (
        <Input
          value={text}
          onChange={(e) => handleIndexChange({ comment: e.target.value }, index, 'comment')}
          disabled={!isEditable}
        />
      ),
      editable: true,
      width: "15%"
    },
    {
      title: '操作',
      key: 'action',
      width: '16%',
      render: (text: string, record: TableIndex, index: number) => {
        const isFirst = index === 0;
        const isLast = index === indexDataSource.length - 1;
        const editable = isIndexEditing(record);

        return (
          <Space>
            {editable ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <Tooltip title="暂存">
                  <Button size={'small'} onClick={() => tmpSaveIndexData(record.key)} type="primary" icon={<SaveOutlined />} />
                </Tooltip>
                <Tooltip title="取消">
                  <Button size={'small'} onClick={()=> cancelIndex()} icon={<CloseOutlined />} />
                </Tooltip>
              </div>
            ) : (
              <>
                <Tooltip title="上移">
                  <Button
                    size={'small'}
                    icon={<ArrowUpOutlined />}
                    onClick={() => handleMoveIndex(index, 'up')}
                    disabled={!isEditable || isFirst || !!editingIndexKey}
                  />
                </Tooltip>
                <Tooltip title="下移">
                  <Button
                    size={'small'}
                    icon={<ArrowDownOutlined />}
                    onClick={() => handleMoveIndex(index, 'down')}
                    disabled={!isEditable || isLast || !!editingIndexKey}
                  />
                </Tooltip>
                <Tooltip title="编辑">
                  <Button
                    size={'small'}
                    icon={<EditOutlined />}
                    type={'link'}
                    disabled={!isEditable || !!editingIndexKey}
                    onClick={() => {
                      editIndex(record);
                    }}
                  />
                </Tooltip>
                <Popconfirm
                  title="确定要删除这行吗？"
                  onConfirm={() => handleDeleteIndex(index)}
                  okText="是"
                  cancelText="否"
                  disabled={!!editingIndexKey}
                >
                  <Tooltip title="删除">
                    <Button size={'small'} icon={<DeleteOutlined />} disabled={!isEditable || !!editingIndexKey} />
                  </Tooltip>
                </Popconfirm>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  const mergedIndexColumns: TableProps<TableIndex>['columns'] = indexColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: TableIndex) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isIndexEditing(record),
        required: col.required
      }),
    };
  });

  const filteredFieldDataSource = fieldDataSource.filter(
    (field) =>
      field?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field?.comment?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.leftContent}>
          <div style={{ padding: '16px 24px 0' }}>
            <Input prefix={<SearchOutlined />} placeholder="Search..." />
          </div>
          <Button
            className={`btn-add`}
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
                    title={database.database_name}
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
          <Tabs activeKey={activateKey} onChange={handleTabChange} type="card">
            <TabPane tab="表结构" key="1">
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 12 }}>
                <Space style={{ padding: '8px 0', marginBottom: '16px' }}>
                  <Button className={`btn-add`} onClick={handleAddField} disabled={!isEditable}>
                    新增
                  </Button>
                  <Button type="primary" onClick={handleSaveField} disabled={!isEditable}>
                    保存
                  </Button>
                  <Popconfirm title="确定要清空所有字段吗？" onConfirm={handleClearFields} okText="是" cancelText="否">
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
                  dataSource={filteredFieldDataSource}
                  rowKey="name"
                  pagination={false}
                />
              </Form>
            </TabPane>

            <TabPane tab="索引" key="2">
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 12 }}>
                <Space style={{ padding: '8px 0', marginBottom: '16px' }}>
                  <Button className={`btn-add`} onClick={handleAddIndex} disabled={!isEditable}>
                    新增
                  </Button>
                  <Button type="primary" onClick={handleSaveIndex} disabled={!isEditable}>
                    保存
                  </Button>
                  <Popconfirm title="确定要清空所有索引吗？" onConfirm={handleClearIndexes} okText="是" cancelText="否">
                    <Button icon={<ClearOutlined />} disabled={!isClearAble}>
                      清空
                    </Button>
                  </Popconfirm>
                </Space>
                <Switch
                  checkedChildren="编辑"
                  unCheckedChildren="预览"
                  checked={isEditable}
                  onChange={handleEditableChange}
                  style={{ marginTop: '16px' }}
                />
              </div>
              <Form form={indexForm} component={false}>
                <Table<TableIndex>
                  components={{
                    body: { cell: EditableCell },
                  }}
                  columns={mergedIndexColumns}
                  dataSource={indexDataSource}
                  rowKey="name"
                  pagination={false}
                />
              </Form>
            </TabPane>
            <TabPane tab="表信息" key="3">
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 12 }}>
                <Space style={{ padding: '8px 0', marginBottom: '16px' }}>
                  <Button type="primary" onClick={handleSave} disabled={!isEditable}>
                    完成
                  </Button>
                  <Popconfirm title="确定要清空所有表数据吗？" onConfirm={handleClearTableMetadata} okText="是" cancelText="否">
                    <Button icon={<ClearOutlined />} disabled={!isClearAble}>
                      清空
                    </Button>
                  </Popconfirm>
                </Space>
                <Switch
                  checkedChildren="编辑"
                  unCheckedChildren="预览"
                  checked={isEditable}
                  onChange={handleEditableChange}
                  style={{ marginTop: '16px' }}
                />
              </div>
              <Form {...tableFormPropItemLayout}>
                <Form.Item label="数据库">
                  <Input placeholder={"请选择数据库"} value={selectedDatabase?.database_name} disabled={true}/>
                </Form.Item>
              </Form>
              <Form form={tableMetadataForm} {...tableFormPropItemLayout}>
                <Form.Item name="table_name" label="名称" rules={[{ required: true, message: "必填项" }]}>
                  <Input disabled={!isEditable}/>
                </Form.Item>
                <Form.Item name="comment" label="备注">
                  <Input  disabled={!isEditable}/>
                </Form.Item>
              </Form>
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
        </Tabs>
      </Modal>
    </div>
  );
};

export default DatabaseExplorer;
