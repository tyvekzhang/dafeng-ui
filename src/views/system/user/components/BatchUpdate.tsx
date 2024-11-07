import { UserBatchUpdate } from '@/types/user';
import { Button, Form, Input, Modal, Radio, RadioChangeEvent, Space } from 'antd';
import { FormInstance } from 'antd/es/form';
import React from 'react';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};

interface BatchUpdateProps {
  isModalVisible: boolean;
  handleCancel: () => void;
  setIsPasswordVisible: any;
  userBatchUpdateForm: FormInstance;
  isUserBatchUpdateLoading: boolean;
  handleUserBatchUpdate: (data: UserBatchUpdate) => void;
  onBatchStatusChange: (e: RadioChangeEvent) => void;
  batchStatusValue: number;
  isPasswordVisible: boolean;
}

const BatchUpdate: React.FC<BatchUpdateProps> = ({
  isModalVisible,
  handleCancel,
  userBatchUpdateForm,
  isUserBatchUpdateLoading,
  handleUserBatchUpdate,
  onBatchStatusChange,
  batchStatusValue,
  isPasswordVisible,
  setIsPasswordVisible,
}) => {
  return (
    <div>
      <Modal
        title="用户批量修改"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={
          <>
            <Button
              type={'primary'}
              htmlType="submit"
              onClick={() => userBatchUpdateForm.submit()}
              loading={isUserBatchUpdateLoading}
            >
              确定
            </Button>
            <Button onClick={handleCancel}>取消</Button>
          </>
        }
      >
        <Form form={userBatchUpdateForm} name="user_batch_update_rule" onFinish={handleUserBatchUpdate}>
          <Form.Item name="status" label="状态" {...formItemLayout}>
            <Radio.Group onChange={onBatchStatusChange} value={batchStatusValue}>
              <Space>
                <Radio value={1}>正常</Radio>
                <Radio value={0}>禁用</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="password"
            label="密码"
            rules={[
              {
                min: 6,
                message: '请设置密码不少于6位',
              },
              {
                pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
                message: '需要有数字和字母',
              },
            ]}
            validateTrigger="onBlur"
          >
            <Input.Password
              placeholder="请输入"
              visibilityToggle={{ visible: isPasswordVisible, onVisibleChange: setIsPasswordVisible }}
            />
          </Form.Item>
          <Form.Item {...formItemLayout} name="remark" label="备注">
            <Input.TextArea placeholder="请输入" autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BatchUpdate;
