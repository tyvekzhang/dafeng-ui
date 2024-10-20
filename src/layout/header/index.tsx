import {Layout} from 'antd';

import { FoldTrigger, Breadcrumb } from './components';
import LayoutFeature from "@/layout/feature";
import React from "react";

const LayoutHeader = () => {
  const { Header } = Layout;

  return (
    <Header
      className='flex-between-h'
      style={{
        flexDirection: 'column',
        height: 'auto',
        background: '#fff'
      }}
    >
      <div className='flex-between-h' style={{ padding: '0 12px' }}>
        <div className='flex-center-v'>
          <FoldTrigger />
          <Breadcrumb />
        </div>
        <LayoutFeature />
      </div>
    </Header>
  );
};

export default LayoutHeader;
