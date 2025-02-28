
import dayjs from 'dayjs';
import {
  Descriptions,
  Drawer,
  Button,
  Space,
} from 'antd';
import { useAppSelector } from '@/stores';
import { MemberDetail } from '@/types/member';
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
  const { dictData } = useAppSelector((state) => state.dict);

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
          <Descriptions.Item label="名称">
              { memberDetail.name}
          </Descriptions.Item>
          <Descriptions.Item label="国家">
              {(() => {
                const values = (memberDetail.nation || '').toString().split(',');
                return values.map((value, index) => {
                  const item = dictData["sys_user_country"] && dictData["sys_user_country"].find((d: Record<string, string>) => d.value === value);
                  const content = item ? <span key={value}>{item.label}</span> : <span key={value}>-</span>;
                  return index < values.length - 1 ? (
                    <React.Fragment key={index}>
                      {content}
                      ,&nbsp;
                    </React.Fragment>
                  ) : content;
                });
              })()}
          </Descriptions.Item>
          <Descriptions.Item label="性别">
              {(() => {
                const values = (memberDetail.gender || '').toString().split(',');
                return values.map((value, index) => {
                  const item = dictData["sys_user_sex"] && dictData["sys_user_sex"].find((d: Record<string, string>) => d.value === value);
                  const content = item ? <span key={value}>{item.label}</span> : <span key={value}>-</span>;
                  return index < values.length - 1 ? (
                    <React.Fragment key={index}>
                      {content}
                      ,&nbsp;
                    </React.Fragment>
                  ) : content;
                });
              })()}
          </Descriptions.Item>
          <Descriptions.Item label="生日">
              {dayjs(memberDetail.birthday).format('YYYY-MM-DD')}
          </Descriptions.Item>
          <Descriptions.Item label="爱好">
              {(() => {
                const values = (memberDetail.hobby || '').toString().split(',');
                return values.map((value, index) => {
                  const item = dictData["sys_user_hobby"] && dictData["sys_user_hobby"].find((d: Record<string, string>) => d.value === value);
                  const content = item ? <span key={value}>{item.label}</span> : <span key={value}>-</span>;
                  return index < values.length - 1 ? (
                    <React.Fragment key={index}>
                      {content}
                      ,&nbsp;
                    </React.Fragment>
                  ) : content;
                });
              })()}
          </Descriptions.Item>
          <Descriptions.Item label="父Id">
              { memberDetail.parent_id}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
};

export default MemberDetailComponent;