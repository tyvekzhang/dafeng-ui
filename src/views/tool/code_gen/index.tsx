import React, { useState } from 'react';
import type { TableProps } from 'antd';
import { Button, Card, DatePicker, Form, Input, Popconfirm, Space, Table, Tooltip } from 'antd';
import { CodeOutlined, DeleteOutlined, EditOutlined, EyeOutlined, SyncOutlined } from '@ant-design/icons';
import CodePreview from './components/CodePreview';
import CodeEdit from './components/CodeEdit';
import ImportTable from './components/ImportTable';

const { RangePicker } = DatePicker;

interface TableItem {
  key: string;
  id: number;
  tableName: string;
  description: string;
  entity: string;
  createTime: string;
  updateTime?: string;
}

export default function CodeGen() {
  const searchForm = Form.useForm();
  const [editOpen, setEditOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [tableData, setTableData] = useState<TableItem[]>([
    {
      key: '1',
      id: 1,
      tableName: 'sys_oper_log',
      description: '操作日志记录',
      entity: 'SysOperLog',
      createTime: '2024-11-26 15:29:18',
      updateTime: '2024-11-27 11:22:29',
    },
    {
      key: '2',
      id: 2,
      tableName: 'sys_config',
      description: '参数配置表',
      entity: 'SysConfig',
      createTime: '2024-11-26 16:34:35',
    },
  ]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleImportTables = (importedTables: TableItem[]) => {
    // 为导入的表生成新的 id
    const lastId = Math.max(...tableData.map(item => item.id));
    const newTables = importedTables.map((table, index) => ({
      ...table,
      id: lastId + index + 1,
      key: (lastId + index + 1).toString(),
      createTime: new Date().toLocaleString(),
    }));

    setTableData([...tableData, ...newTables]);
  };

  const columns: TableProps<TableItem>['columns'] = [
    {
      title: '序号',
      dataIndex: 'id',
      width: '6%',
    },
    {
      title: '连接名',
      dataIndex: 'connection_name',
      width: '10%',
    },
    {
      title: '数据库名',
      dataIndex: 'db_name',
      width: '10%',
    },
    {
      title: '表名称',
      dataIndex: 'tableName',
      width: '10%',
    },
    {
      title: '表描述',
      dataIndex: 'description',
      width: '15%',
    },
    {
      title: '模型',
      dataIndex: 'entity',
      width: '15%',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '15%',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="small">
          <Tooltip title="预览">
            <Button
              type="link"
              size={'small'}
              icon={<EyeOutlined />}
              onClick={() => setPreviewOpen(true)}
            >
            </Button>
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="link"
              size={'small'}
              icon={<EditOutlined />}
              onClick={() => setEditOpen(true)}
            >
            </Button>
          </Tooltip>
          <Tooltip title="删除">
            <Button size={'small'} type="link" icon={<DeleteOutlined />}></Button>
          </Tooltip>
          <Tooltip title="同步">
            <Button size={'small'} type="link" icon={<SyncOutlined />}></Button>
          </Tooltip>
          <Tooltip title="生成代码">
            <Button size={'small'} type="link" icon={<CodeOutlined />}></Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const formPropItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const data: TableItem[] = [
    {
      key: '1',
      id: 1,
      tableName: 'sys_oper_log',
      description: '操作日志记录',
      entity: 'SysOperLog',
      createTime: '2024-11-26 15:29:18',
      updateTime: '2024-11-27 11:22:29',
    },
    {
      key: '2',
      id: 2,
      tableName: 'sys_config',
      description: '参数配置表',
      entity: 'SysConfig',
      createTime: '2024-11-26 16:34:35',
    },
    // Add more sample data as needed
  ];

  return (
    <>
      <Card bordered={false}>

        <Form {...formPropItemLayout} onFinish={() => {
        }}>
          <Space wrap>
            <Form.Item name="connection" label="连接名">
              <Input
                placeholder="请输入连接名"
              />
            </Form.Item>
            <Form.Item name="db_name" label="数据库名">
              <Input
                placeholder="请输入数据库名"
              />
            </Form.Item>
            <Form.Item name="table_name" label="表名">
              <Input
                placeholder="请输入表名"
              />
            </Form.Item>
            <Form.Item name="table_remark" label="表描述">
              <Input
                placeholder="请输入表描述"
              />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button type="primary" style={{ marginRight: 8 }}>搜索</Button>
              <Button>重置</Button>
            </Form.Item>
          </Space>
        </Form>

        <Space wrap style={{ marginBottom: 16 }}>
          <Button className={`btn-add`}>
            生成
          </Button>
          <Button onClick={() => setImportOpen(true)} className={`btn-import`}>
            导入
          </Button>
          <Popconfirm
            title="删除所选的内容"
            description="你确定删除吗? 删除后将无法找回"
            onConfirm={() => {
            }}
            onCancel={() => {
            }}
            okText="是"
            cancelText="否"
          >
            <Button className={`btn-delete`}>
              删除
            </Button>
          </Popconfirm>
        </Space>

        <Table
          columns={columns}
          dataSource={data}
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

      <CodePreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
      <CodeEdit
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
      <ImportTable
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={() => {
        }}
      />
    </>
  );
}

