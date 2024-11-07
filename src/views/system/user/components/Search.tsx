import { UserQueryForm } from '@/types/user';
import { Button, DatePicker, Form, Input, Select, Space } from 'antd';
import { FormInstance } from 'antd/es/form';
import React from 'react';
import useStyles from './style';

interface SearchProps {
  form: FormInstance;
  handleUserQuery: (data: UserQueryForm) => void;
  handleChangeState: (data: string) => void;
  handleQueryReset: () => void;
}

const Search: React.FC<SearchProps> = ({ form, handleUserQuery, handleChangeState, handleQueryReset }) => {
  const { styles } = useStyles();
  return (
    <div>
      <Form form={form} name="user_search_rule" onFinish={handleUserQuery}>
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
              onChange={handleChangeState}
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
              <Button onClick={handleQueryReset}>重置</Button>
            </Form.Item>
          </div>
        </Space>
      </Form>
    </div>
  );
};

export default Search;
