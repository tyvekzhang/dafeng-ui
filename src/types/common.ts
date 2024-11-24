import React from 'react';

export interface ModelBase {
  id: number;
  create_time: Date;
  update_time?: Date;
}

export interface PageBase {
  page: number;
  size: number;
  count?: boolean;
}

export interface PageData<T> {
  records: T[];
  total_count: number;
}

export interface EditableCellProps<T = any> extends React.HTMLAttributes<HTMLElement> {
  editing: boolean; // 是否处于编辑状态
  dataIndex: string; // 数据字段名
  title: any; // 列的标题
  inputType: 'number' | 'text'; // 输入框类型
  record: T; // 当前行的数据类型
  index: number; // 当前行的索引
}
