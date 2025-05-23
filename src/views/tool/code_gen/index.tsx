import { CodeOutlined, DeleteOutlined, EditOutlined, EyeOutlined, SyncOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Button, Card, Form, Input, Popconfirm, Space, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import CodeModify from './components/CodeModify';
import CodePreview from './components/CodePreview';
import ImportTable from './components/ImportTable';

import { message } from '@/components/GlobalToast';
import { codeList, deleteTable, downloadCode, syncTable } from '@/service/code_gen';
import { GenTableQueryResponse } from '@/types/code_gen';
import dayjs from 'dayjs';

export default function CodeGen() {
  const searchForm = Form.useForm();
  const [editOpen, setEditOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentTableId, setCurrentTableId] = useState<number>(0);

  const handlePreview = (record: GenTableQueryResponse) => {
    setPreviewOpen(true);
    setCurrentTableId(record.id);
  };

  const onCodeModify = (record: GenTableQueryResponse) => {
    setEditOpen(true)
    setCurrentTableId(record.id);
  };

  const handleDelete = async (record: GenTableQueryResponse) => {
    await deleteTable(record.id);
    message.success('删除成功');
    fetchCodeList();
  };

  const handleSync = async (record: GenTableQueryResponse) => {
    await syncTable(record.id);
    message.success('同步成功');
    fetchCodeList();
  };

  const handleCodeGenerate = async (record: GenTableQueryResponse) => {
    setCurrentTableId(record.id);
    await downloadCode(record.id);
  };

  const [tableData, setTableData] = useState<GenTableQueryResponse[]>([]);

  const fetchCodeList = () => {
    codeList().then((res) => {
      setTableData(res.records);
    });
  };
  useEffect(() => {
    fetchCodeList();
  }, [importOpen]);

  const columns: TableProps<GenTableQueryResponse>['columns'] = [
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
      render: (_: number, _record: GenTableQueryResponse, rowIndex: number) => rowIndex + 1,
      width: '5%',
    },
    {
      title: '连接',
      dataIndex: 'connectionName',
      width: '10%',
    },
    {
      title: '数据库',
      dataIndex: 'databaseName',
      width: '14%',
    },
    {
      title: '表名',
      dataIndex: 'tableName',
      width: '10%',
    },
    {
      title: '备注',
      dataIndex: 'tableComment',
      width: '15%',
    },
    {
      title: '数据模型',
      dataIndex: 'entity',
      width: '15%',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '15%',
      render: (text: string) => (
        <span>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (record: GenTableQueryResponse) => (
        <Space size="small">
          <Tooltip title="预览">
            <Button type="link" size={'small'} icon={<EyeOutlined />} onClick={() => handlePreview(record)}></Button>
          </Tooltip>
          <Tooltip title="编辑">
            <Button type="link" size={'small'} icon={<EditOutlined />} onClick={() => onCodeModify(record)}></Button>
          </Tooltip>
          <Tooltip title="删除">
            <Button size={'small'} type="link" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}></Button>
          </Tooltip>
          <Tooltip title="同步">
            <Button size={'small'} type="link" icon={<SyncOutlined />} onClick={() => handleSync(record)}></Button>
          </Tooltip>
          <Tooltip title="生成代码">
            <Button
              size={'small'}
              type="link"
              onClick={() => handleCodeGenerate(record)}
              icon={<CodeOutlined />}
            ></Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const formPropItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  return (
    <>
      <Card bordered={false}>
        <Form {...formPropItemLayout} onFinish={() => {}}>
          <Space wrap>
            <Form.Item name="connection" label="连接名">
              <Input placeholder="请输入连接名" />
            </Form.Item>
            <Form.Item name="db_name" label="数据库名">
              <Input placeholder="请输入数据库名" />
            </Form.Item>
            <Form.Item name="table_name" label="表名">
              <Input placeholder="请输入表名" />
            </Form.Item>
            <Form.Item name="table_remark" label="表描述">
              <Input placeholder="请输入表描述" />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button type="primary" style={{ marginRight: 8 }}>
                搜索
              </Button>
              <Button>重置</Button>
            </Form.Item>
          </Space>
        </Form>

        <Space wrap style={{ marginBottom: 16 }}>
          <Button className={`btn-add`}>生成</Button>
          <Button onClick={() => setImportOpen(true)} className={`btn-import`}>
            导入
          </Button>
          <Popconfirm
            title="删除所选的内容"
            description="你确定删除吗? 删除后将无法找回"
            onConfirm={() => {}}
            onCancel={() => {}}
            okText="是"
            cancelText="否"
          >
            <Button className={`btn-delete`}>删除</Button>
          </Popconfirm>
        </Space>

        <Table
          columns={columns}
          dataSource={tableData}
          rowSelection={{
            selectedRowKeys,
            onChange: (newSelectedRowKeys) => {
              setSelectedRowKeys(newSelectedRowKeys as string[]);
            },
          }}
          pagination={{
            total: 14,
            pageSize: 10,
            current: 1,
            showTotal: (total) => `共 ${total} 条`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <CodePreview open={previewOpen} onClose={() => setPreviewOpen(false)} tableId={currentTableId} />
      {editOpen && <CodeModify open={editOpen} onClose={() => setEditOpen(false)} tableId={currentTableId}/>}
      <ImportTable open={importOpen} onClose={() => setImportOpen(false)} />
    </>
  );
}
