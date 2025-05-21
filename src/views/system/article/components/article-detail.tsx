
import dayjs from 'dayjs';
import {
  Descriptions,
  Drawer,
  Button,
  Space,
} from 'antd';
import { useAppSelector } from '@/stores';
import { ArticleDetail } from '@/types/article';
import React, { useMemo } from 'react';

interface ArticleDetailDrawerProps {
  isArticleDetailDrawerVisible: boolean;
  onArticleDetailClose: () => void;
  articleDetail: ArticleDetail | null;
}

const ArticleDetailComponent: React.FC<ArticleDetailDrawerProps> = ({
  isArticleDetailDrawerVisible,
  onArticleDetailClose,
  articleDetail,
}) => {
  const { dictData } = useAppSelector((state: Record<string, any>) => state.dict);

  return (
    <Drawer
      title="文章信息详情"
      open={isArticleDetailDrawerVisible}
      onClose={onArticleDetailClose}
      destroyOnClose
      width={600}
    >
      { articleDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="标题">
              { articleDetail.title}
          </Descriptions.Item>
          <Descriptions.Item label="doi地址">
              { articleDetail.doi}
          </Descriptions.Item>
          <Descriptions.Item label="期刊名称">
              { articleDetail.publication}
          </Descriptions.Item>
          <Descriptions.Item label="问题">
              { articleDetail.query}
          </Descriptions.Item>
          <Descriptions.Item label="问题嵌入向量">
              { articleDetail.query_vector}
          </Descriptions.Item>
          <Descriptions.Item label="方法">
              { articleDetail.methods}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
              {dayjs(articleDetail.create_time).format('YYYY-MM-DD')}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default ArticleDetailComponent;