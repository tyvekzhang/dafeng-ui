import { ExceptionEnum } from '@/enums/exceptionEnum';
import { Button, Card, Result } from 'antd';
import type { FC, ReactNode } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

interface LoaderData {
  status: any;
  withCard: boolean;
}

const subTitleMap = new Map([
  [ExceptionEnum.PAGE_NOT_ACCESS, '对不起，您没有权限访问此页面。'],
  [ExceptionEnum.PAGE_NOT_FOUND, '对不起，您访问的页面不存在。'],
  [ExceptionEnum.SERVER_ERROR, '对不起，服务器发生错误。'],
  [ExceptionEnum.UNKNOWN_ERROR, '未知错误。'],
]);

const Wrapper: FC<{ children: ReactNode; withCard: boolean }> = ({ children, withCard }) => {
  if (withCard) {
    return <Card bordered={false}>{children}</Card>;
  }
  return <div className="flex-center full-height">{children}</div>;
};

const PageException: FC = () => {
  const navigate = useNavigate();

  const { status, withCard } = useLoaderData() as LoaderData;

  const goHome = () => {
    navigate('/');
  };

  const getSubTitle = (status: ExceptionEnum): string | undefined => {
    return subTitleMap.get(status) || subTitleMap.get(ExceptionEnum.UNKNOWN_ERROR);
  };

  return (
    <Wrapper withCard={withCard}>
      <Result
        status={status || ExceptionEnum.UNKNOWN_ERROR}
        title={status || getSubTitle(ExceptionEnum.UNKNOWN_ERROR)}
        subTitle={getSubTitle(status)}
        extra={
          <Button type="primary" onClick={goHome}>
            返回首页
          </Button>
        }
      />
    </Wrapper>
  );
};

export default PageException;
