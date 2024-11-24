import { EditableCellProps } from '@/types/common';
import { Form, Input, InputNumber } from 'antd';
import React from 'react';

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  record,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber style={{ width: '64px' }} /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
