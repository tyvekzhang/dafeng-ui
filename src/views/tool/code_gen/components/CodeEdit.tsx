import type { TabsProps } from 'antd';
import { Button, Form, Input, Modal, Select, Table, Tabs } from 'antd';
import React from 'react';

const { Option } = Select;

interface CodeEditProps {
  open: boolean;
  onClose: () => void;
}

const CodeEdit: React.FC<CodeEditProps> = ({ open, onClose }) => {
  // 表格数据
  const data = [
    {
      key: '1',
      index: 1,
      fieldName: 'oper_id',
      fieldDesc: '日志主键',
      physicalType: 'bigint(20)',
      javaType: 'Long',
      javaProperty: 'operId',
    },
    {
      key: '2',
      index: 2,
      fieldName: 'title',
      fieldDesc: '模块标题',
      physicalType: 'varchar(50)',
      javaType: 'String',
      javaProperty: 'title',
    },
    {
      key: '3',
      index: 3,
      fieldName: 'business_type',
      fieldDesc: '业务类型',
      physicalType: 'int(2)',
      javaType: 'Integer',
      javaProperty: 'business',
    },
    {
      key: '4',
      index: 4,
      fieldName: 'method',
      fieldDesc: '方法名称',
      physicalType: 'varchar(200)',
      javaType: 'String',
      javaProperty: 'method',
    },
    {
      key: '5',
      index: 5,
      fieldName: 'request_method',
      fieldDesc: '请求方式',
      physicalType: 'varchar(10)',
      javaType: 'String',
      javaProperty: 'requestMethod',
    },
    {
      key: '6',
      index: 6,
      fieldName: 'operator_type',
      fieldDesc: '操作类别',
      physicalType: 'int(1)',
      javaType: 'Integer',
      javaProperty: 'operator',
    },
    {
      key: '7',
      index: 7,
      fieldName: 'oper_name',
      fieldDesc: '操作人员',
      physicalType: 'varchar(50)',
      javaType: 'String',
      javaProperty: 'operName',
    },
  ];

  // 表格列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 60,
    },
    {
      title: '字段列名',
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: 120,
    },
    {
      title: '字段描述',
      dataIndex: 'fieldDesc',
      key: 'fieldDesc',
      width: 120,
    },
    {
      title: '物理类型',
      dataIndex: 'physicalType',
      key: 'physicalType',
      width: 100,
    },
    {
      title: 'Java类型',
      dataIndex: 'javaType',
      key: 'javaType',
      width: 100,
      render: () => (
        <Select defaultValue="String" style={{ width: '100%' }}>
          <Option value="String">String</Option>
          <Option value="Long">Long</Option>
          <Option value="Integer">Integer</Option>
        </Select>
      ),
    },
    {
      title: 'java属性',
      dataIndex: 'javaProperty',
      key: 'javaProperty',
      width: 100,
    },

    {
      title: '插入',
      dataIndex: 'insert',
      key: 'insert',
      width: 60,
      render: () => <input type="checkbox" defaultChecked />,
    },
    {
      title: '编辑',
      dataIndex: 'edit',
      key: 'edit',
      width: 60,
      render: () => <input type="checkbox" defaultChecked />,
    },
    {
      title: '列表',
      dataIndex: 'list',
      key: 'list',
      width: 60,
      render: () => <input type="checkbox" defaultChecked />,
    },
    {
      title: '查询',
      dataIndex: 'query',
      key: 'query',
      width: 60,
      render: () => <input type="checkbox" defaultChecked />,
    },
    {
      title: '查询方式',
      dataIndex: 'queryType',
      key: 'queryType',
      width: 100,
      render: () => (
        <Select defaultValue="=" style={{ width: '100%' }}>
          <Option value="=">=</Option>
          <Option value="LIKE">LIKE</Option>
        </Select>
      ),
    },
    {
      title: '必填',
      dataIndex: 'required',
      key: 'required',
      width: 60,
      render: () => <input type="checkbox" />,
    },
    {
      title: '显示类型',
      dataIndex: 'displayType',
      key: 'displayType',
      width: 120,
      render: () => (
        <Select defaultValue="text" style={{ width: '100%' }}>
          <Option value="text">文本值</Option>
          <Option value="file">文件上传</Option>
          <Option value="select">下拉值</Option>
        </Select>
      ),
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      key: 'dictType',
      width: 120,
      render: () => (
        <Select placeholder="请选择" style={{ width: '100%' }}>
          <Option value="1">请选择</Option>
        </Select>
      ),
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '基本信息',
      children: (
        <Form layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
          <Form.Item label="表名称" required>
            <Input disabled value="sys_oper_log" />
          </Form.Item>
          <Form.Item label="表描述" required>
            <Input value="操作日志记录" />
          </Form.Item>
          <Form.Item label="实体类名称" required>
            <Input value="SysOperLog" />
          </Form.Item>
          <Form.Item label="实体类描述" required>
            <Input value="操作日志记录" />
          </Form.Item>
          <Form.Item label="作者" required>
            <Input value="ruoyi" />
          </Form.Item>
          <Form.Item label="备注">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '2',
      label: '字段信息',
      children: (
        <>
          <Table columns={columns} dataSource={data} pagination={false} scroll={{ x: 1500 }} size="middle" />
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Button type="primary" style={{ marginRight: 8 }}>
              提交
            </Button>
            <Button onClick={onClose}>返回</Button>
          </div>
        </>
      ),
    },
    {
      key: '3',
      label: '生成信息',
      children: (
        <Form layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
          <Form.Item label="生成模板">
            <Select defaultValue="crud">
              <Option value="crud">单表（增删改查）</Option>
              <Option value="tree">树表（增删改查）</Option>
              <Option value="sub">主子表（增删改查）</Option>
            </Select>
          </Form.Item>
          <Form.Item label="生成包路径" required>
            <Input value="com.ruoyi.system" />
          </Form.Item>
          <Form.Item label="生成模块名" required>
            <Input value="system" />
          </Form.Item>
          <Form.Item label="生成业务名" required>
            <Input value="operlog" />
          </Form.Item>
          <Form.Item label="生成功能名" required>
            <Input value="日志" />
          </Form.Item>
          <Form.Item label="上级菜单">
            <Select defaultValue="系统管理">
              <Option value="系统管理">系统管理</Option>
            </Select>
          </Form.Item>
          <Form.Item label="生成方式">
            <Select defaultValue="zip">
              <Option value="zip">ZIP压缩包</Option>
              <Option value="custom">自定义路径</Option>
            </Select>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <Modal title="编辑表" open={open} onCancel={onClose} footer={null} width={1200} style={{ top: 20 }}>
      <div style={{ padding: '12px 0' }}>
        <Tabs defaultActiveKey="2" items={items} />
      </div>
    </Modal>
  );
};

export default CodeEdit;
