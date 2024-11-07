import { userExportTemplate } from '@/services';
import { InboxOutlined } from '@ant-design/icons';
import { Button, Modal, Upload } from 'antd';
import React from 'react';

interface ImportProps {
  isModalVisible: boolean;
  isLoading: boolean;
  handleCancel: () => void;
  handleUserImport: () => void;
  customUploadRequest: () => void;
}

const Import: React.FC<ImportProps> = ({
  isModalVisible,
  handleCancel,
  handleUserImport,
  isLoading,
  customUploadRequest,
}) => {
  const handleUserExportTemplate = async () => {
    await userExportTemplate();
  };
  return (
    <div>
      <Modal title="用户导入" open={isModalVisible} onCancel={handleCancel} onOk={handleUserImport} loading={isLoading}>
        <div>
          <Upload.Dragger name="file" maxCount={1} accept=".xlsx,.xls" customRequest={customUploadRequest as any}>
            <p className="sc-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="sc-upload-text">{'点击或拖拽到此上传'}</p>
            <p className="sc-upload-hint">仅支持上传xls、xlsx格式文件</p>
          </Upload.Dragger>
        </div>
        <div>
          <Button type={'link'} onClick={handleUserExportTemplate}>
            下载模板
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Import;
