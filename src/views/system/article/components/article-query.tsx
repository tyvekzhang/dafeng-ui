import { Input } from 'antd';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import {
  AutoComplete,
  Button,
  Cascader,
  ColorPicker,
  Form,
  InputNumber, Mentions,
  Modal, Rate,
  Slider, Switch, TimePicker, Transfer, TreeSelect, Upload, Space
} from 'antd';
import { useAppSelector } from '@/stores';
import { FormInstance } from 'antd/es/form';
import React from 'react';

interface ArticleQueryProps {
  onArticleQueryFinish: () => void;
  onArticleQueryReset: () => void;
  articleQueryForm: FormInstance;
}

const articleQueryFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const ArticleQueryComponent: React.FC<ArticleQueryProps> = ({
  onArticleQueryFinish,
  onArticleQueryReset,
  articleQueryForm,
}) => {
  const handleArticleQueryReset = () => {
    onArticleQueryReset();
    onArticleQueryFinish();
  };
  const { dictData } = useAppSelector((state: Record<string, any>) => state.dict);

  return (
    <Form
      {...articleQueryFormItemLayout}
      form={ articleQueryForm}
      name="articleQuery"
      onFinish={onArticleQueryFinish}
      layout="horizontal"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-0 gap-x-4 pt-4 px-2 border-b"
    >
      <Form.Item name="title" label="标题" >
        <Input placeholder="请输入标题" allowClear />
      </Form.Item>
      <Form.Item name="doi" label="doi地址" >
        <Input placeholder="请输入doi地址" allowClear />
      </Form.Item>
      <Form.Item name="publication" label="期刊名称" >
        <Input placeholder="请输入期刊名称" allowClear />
      </Form.Item>
      <Form.Item name="query" label="问题" >
        <Input placeholder="请输入问题" allowClear />
      </Form.Item>
      <Form.Item name="query_vector" label="问题嵌入向量" >
        <Input placeholder="请输入问题嵌入向量" allowClear />
      </Form.Item>
      <Form.Item name="methods" label="方法" >
        <Input placeholder="请输入方法" allowClear />
      </Form.Item>
      <Form.Item name="create_time" label="创建时间" >
        <DatePicker
          allowClear
          format="YYYY-MM-DD"
          placeholder="请选择创建时间"
          presets={[
            { label: '昨天', value: dayjs().add(-1, 'd') },
            { label: '上周', value: dayjs().add(-7, 'd') },
            { label: '上月', value: dayjs().add(-1, 'month') },
          ]}
        />
      </Form.Item>
      <Form.Item className="flex justify-end">
        <Space className="inline-flex">
          <Button onClick={handleArticleQueryReset}>重置</Button>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ArticleQueryComponent;