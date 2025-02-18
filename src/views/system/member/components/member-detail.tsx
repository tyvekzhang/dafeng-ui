import { MemberDetail } from '@/types/member';
import { Button, Descriptions, Drawer, Space } from 'antd';
import React, { useMemo } from 'react';

interface MemberDetailDrawerProps {
  isMemberDetailDrawerVisible: boolean;
  onMemberDetailClose: () => void;
  memberDetail: MemberDetail | null;
}

const MemberDetailComponent: React.FC<MemberDetailDrawerProps> = ({
                                                                     isMemberDetailDrawerVisible,
                                                                     onMemberDetailClose,
                                                                     memberDetail,
                                                                   }) => {
  const footerButtons = useMemo(
    () => (
      <Space>
        <Button onClick={onMemberDetailClose}>
          关闭
        </Button>
      </Space>
    ),
    [onMemberDetailClose],
  );

  return (
    <Drawer
      title="会员管理详情"
      open={isMemberDetailDrawerVisible}
      onClose={onMemberDetailClose}
      extra={footerButtons}
      destroyOnClose
      width={600}
    >
      { memberDetail && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="名称">{ memberDetail.name}</Descriptions.Item>
          <Descriptions.Item label="国家">{ memberDetail.nation}</Descriptions.Item>
          <Descriptions.Item label="性别">{ memberDetail.gender}</Descriptions.Item>
          <Descriptions.Item label="生日">{ memberDetail.birthday}</Descriptions.Item>
          <Descriptions.Item label="爱好">{ memberDetail.hobby}</Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default MemberDetailComponent;
