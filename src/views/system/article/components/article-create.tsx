import { Input } from 'antd';
import { DatePicker } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { TreeSelect } from 'antd';
import { TreeSelectUtil } from '@/utils/select-util';
import { ArticlePage } from '@/types/article';
import {
  AutoComplete,
  Button,
  Cascader,
  ColorPicker,
  Form,
  InputNumber, Mentions,
  Modal, Rate,
  Slider, Switch, TimePicker, Transfer, Upload,
} from 'antd';
import { useAppSelector } from '@/stores';
import { ArticleCreate } from '@/types/article';
import { FormInstance } from 'antd/es/form';
import React, { useMemo } from 'react';

const articleCreateFormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

interface ArticleCreateProps {
  isArticleCreateModalVisible: boolean;
  onArticleCreateCancel: () => void;
  onArticleCreateFinish: (articleCreate: ArticleCreate) => void;
  isArticleCreateLoading: boolean;
  articleCreateForm: FormInstance;
  treeSelectDataSource?: ArticlePage[];
}

const ArticleCreateComponent: React.FC<ArticleCreateProps> = ({
  isArticleCreateModalVisible,
  onArticleCreateCancel,
  onArticleCreateFinish,
  isArticleCreateLoading,
  articleCreateForm,
  treeSelectDataSource,
}) => {
  const treeSelectDataTransform = [{ name: '根目录', id: 0, children: treeSelectDataSource }];
  const treeSelectData = TreeSelectUtil.transform(treeSelectDataTransform as any);
  const footerButtons = useMemo(
    () => [
      <Button key="back" onClick={onArticleCreateCancel}>
        取消
      </Button>,
      <Button key="submit" type="primary" loading={isArticleCreateLoading} onClick={() => articleCreateForm.submit()}>
        确定
      </Button>,
    ],
    [isArticleCreateLoading, articleCreateForm, onArticleCreateCancel],
  );
  const { dictData } = useAppSelector((state: Record<string, any>) => state.dict);

  return (
    <div>
      <Modal
        title="文章信息新增"
        open={isArticleCreateModalVisible}
        onCancel={onArticleCreateCancel}
        footer={footerButtons}
        width={'60%'}
      >
        <Form
          {...articleCreateFormItemLayout}
          form={ articleCreateForm}
          name="articleCreate"
          onFinish={onArticleCreateFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 gap-x-2 pt-4"
        >
          <Form.Item name="title" label="标题" rules={[{ required: false, message: '请输入标题' }]}>
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item name="doi" label="doi地址" rules={[{ required: false, message: '请输入doi地址' }]}>
            <Input placeholder="请输入doi地址" />
          </Form.Item>
          <Form.Item name="publication" label="期刊名称" rules={[{ required: false, message: '请输入期刊名称' }]}>
            <Input placeholder="请输入期刊名称" />
          </Form.Item>
          <Form.Item name="query" label="问题" rules={[{ required: false, message: '请输入问题' }]}>
            <Input placeholder="请输入问题" />
          </Form.Item>
          <Form.Item name="query_vector" label="问题嵌入向量" rules={[{ required: false, message: '请输入问题嵌入向量' }]}>
            <Input placeholder="请输入问题嵌入向量" />
          </Form.Item>
          <Form.Item name="methods" label="方法" rules={[{ required: false, message: '请输入方法' }]}>
            <Input placeholder="请输入方法" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ArticleCreateComponent;