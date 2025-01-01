import { NewWordDetail } from '@/types/new-word';
import { Button, Descriptions, Drawer, Space } from 'antd';
import React, { useMemo } from 'react';

interface NewWordDetailDrawerProps {
  isNewWordDetailDrawerVisible: boolean;
  onNewWordDetailClose: () => void;
  newWordDetail: NewWordDetail | null;
}

const NewWordDetailComponent: React.FC<NewWordDetailDrawerProps> = ({
  isNewWordDetailDrawerVisible,
  onNewWordDetailClose,
  newWordDetail,
}) => {
  const footerButtons = useMemo(
    () => (
      <Space>
        <Button onClick={onNewWordDetailClose}>关闭</Button>
      </Space>
    ),
    [onNewWordDetailClose],
  );

  return (
    <Drawer
      title="阅读生词详情"
      open={isNewWordDetailDrawerVisible}
      onClose={onNewWordDetailClose}
      extra={footerButtons}
      destroyOnClose
      width={600}
    >
      {newWordDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="用户ID">{newWordDetail.userId}</Descriptions.Item>
          <Descriptions.Item label="文章ID">{newWordDetail.articleId}</Descriptions.Item>
          <Descriptions.Item label="词库表ID">{newWordDetail.wordId}</Descriptions.Item>
          <Descriptions.Item label="单词">{newWordDetail.word}</Descriptions.Item>
          <Descriptions.Item label="复习次数">{newWordDetail.reviewCount}</Descriptions.Item>
          <Descriptions.Item label="复习时间">{newWordDetail.nextReviewDate}</Descriptions.Item>
          <Descriptions.Item label="租户ID">{newWordDetail.tenantId}</Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default NewWordDetailComponent;
