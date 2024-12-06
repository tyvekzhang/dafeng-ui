import type { TableProps } from 'antd';
import { Button, Form, Input, Modal, Select, Space, Table, message } from 'antd';
import React, { useState } from 'react';

const { Option } = Select;

interface ImportTableProps {
  open: boolean;
  onClose: () => void;
  onImport: (tables: TableItem[]) => void;
}

interface TableItem {
  key: string;
  tableName: string;
  description: string;
  entity: string;
  createTime: string;
  updateTime?: string;
}

const ImportTable: React.FC<ImportTableProps> = ({ open, onClose, onImport }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [form] = Form.useForm();

  // 表格列定义
  const columns: TableProps<TableItem>['columns'] = [
    {
      title: '表名称',
      dataIndex: 'tableName',
      width: 200,
    },
    {
      title: '表描述',
      dataIndex: 'description',
      width: 200,
    },
    {
      title: '实体',
      dataIndex: 'entity',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
    },
  ];

  // 模拟数据
  const data: TableItem[] = [
    {
      key: '1',
      tableName: 'sys_user',
      description: '用户信息表',
      entity: 'SysUser',
      createTime: '2024-01-20 10:00:00',
    },
    {
      key: '2',
      tableName: 'sys_role',
      description: '角色信息表',
      entity: 'SysRole',
      createTime: '2024-01-20 10:00:00',
    },
    {
      key: '3',
      tableName: 'sys_menu',
      description: '菜单权限表',
      entity: 'SysMenu',
      createTime: '2024-01-20 10:00:00',
    },
  ];

  const handleSearch = (values: any) => {
    console.log('搜索条件：', values);
    // 这里添加搜索逻辑
  };

  const handleImport = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要导入的表');
      return;
    }
    const selectedTables = data.filter((item) => selectedRowKeys.includes(item.key));
    onImport(selectedTables);
    message.success('导入成功');
    setSelectedRowKeys([]);
    onClose();
  };

  return (
    <Modal
      title="导入表"
      open={open}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="import" type="primary" onClick={handleImport}>
          导入
        </Button>,
      ]}
    >
      <Form form={form} layout="inline" onFinish={handleSearch} style={{ marginBottom: 16 }}>
        <Form.Item name="dataSource" label="数据源">
          <Select style={{ width: 200 }} placeholder="请选择数据源">
            <Option value="mysql">MySQL</Option>
            <Option value="oracle">Oracle</Option>
            <Option value="postgresql">PostgreSQL</Option>
          </Select>
        </Form.Item>
        <Form.Item name="database" label="数据库">
          <Select style={{ width: 200 }} placeholder="请选择数据库">
            <Option value="db1">数据库1</Option>
            <Option value="db2">数据库2</Option>
            <Option value="db3">数据库3</Option>
          </Select>
        </Form.Item>
        <Form.Item name="tableName" label="表名称">
          <Input placeholder="请输入表名称" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="description" label="表描述">
          <Input placeholder="请输入表描述" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                handleSearch({});
              }}
            >
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>

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
          total: data.length,
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </Modal>
  );
};

export default ImportTable;
