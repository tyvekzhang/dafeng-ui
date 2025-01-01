import { Layout } from 'antd';

import LayoutFeature from '@/layout/feature';
import { Breadcrumb, FoldTrigger } from './components';

const LayoutHeader = () => {
  const { Header } = Layout;

  return (
    <Header
      className="flex-between-h"
      style={{
        flexDirection: 'column',
        height: 'auto',
        background: '#fff',
      }}
    >
      <div
        className="flex-between-h"
        style={{ padding: '0px 24px 0px 12px', marginBottom: '2px', boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12)' }}
      >
        <div className="flex-center-v">
          <FoldTrigger />
          <Breadcrumb />
        </div>
        <LayoutFeature />
      </div>
    </Header>
  );
};

export default LayoutHeader;
