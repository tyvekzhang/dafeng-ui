import React from 'react';
import { Select } from 'antd';
import * as Icons from '@ant-design/icons';

const { Option } = Select;

const IconSelect: React.FC = () => {
  const iconList = Object.keys(Icons).filter(key => key.endsWith('Outlined'));

  return (
    <Select
      showSearch
      placeholder="Select an icon"
      optionFilterProp="children"
    >
      {iconList.map(iconName => (
        <Option key={iconName} value={iconName}>
          {React.createElement(Icons[iconName])}
          <span style={{ marginLeft: 8 }}>{iconName}</span>
        </Option>
      ))}
    </Select>
  );
};

export default IconSelect;

