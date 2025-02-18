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
        <Button onClick={onNewWordDetailClose}>
          关闭
        </Button>
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
      { newWordDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="姓名">{ newWordDetail.word}</Descriptions.Item>
          <Descriptions.Item label="国家">{ newWordDetail.translation}</Descriptions.Item>
          <Descriptions.Item label="爱好">{ newWordDetail.next_review_date}</Descriptions.Item>
          <Descriptions.Item label="性别">{ newWordDetail.tenant}</Descriptions.Item>
          <Descriptions.Item label="出生年月">{ newWordDetail.update_time}</Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default NewWordDetailComponent;
