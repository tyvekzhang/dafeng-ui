import { message } from '@/components/GlobalToast';
import { exportNewWordTemplate } from '@/service/new-word';
import { NewWordCreate } from '@/types/new-word';
import { InboxOutlined } from '@ant-design/icons';
import { Button, Modal, Table, Upload, UploadFile } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { UploadRequestOption } from 'rc-upload/es/interface';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';

interface NewWordImportProps {
  isNewWordImportModalVisible: boolean;
  isNewWordImportLoading: boolean;
  onNewWordImportCancel: () => void;
  onNewWordImportFinish: (fileList: RcFile[]) => Promise<NewWordCreate[]>;
  handleNewWordImport: () => void;
}

const NewWordImportComponent: React.FC<NewWordImportProps> = ({
  isNewWordImportModalVisible,
  onNewWordImportCancel,
  onNewWordImportFinish,
  isNewWordImportLoading,
  handleNewWordImport,
}) => {
  const [NewWordImportFileList, setNewWordImportFileList] = useState<RcFile[]>([]);
  const [NewWordCreateList, setNewWordCreateList] = useState<NewWordCreate[]>([]);
  const [isUploadShow, setIsUploadShow] = useState<boolean>(true);

  const footerButtons = () => [
    <Button key="back" onClick={handleNewWordImportCancel}>
      取消
    </Button>,
    <Button key="submit" type="primary" loading={isNewWordImportLoading} onClick={handleNewWordImportConfirm}>
      确定
    </Button>,
  ];

  const handleNewWordImportConfirm = async () => {
    if (isUploadShow) {
      if (NewWordImportFileList.length === 0) {
        message.warning('请先选择文件');
        return;
      }
      try {
        const NewWordPageList = await onNewWordImportFinish(NewWordImportFileList);
        setIsUploadShow(false);
        setNewWordCreateList(NewWordPageList as NewWordCreate[]);
      } finally {
        setNewWordImportFileList([]);
      }
    } else {
      handleNewWordImport();
      setIsUploadShow(true);
    }
  };
  // 表格列信息
  const NewWordPageColumns: ColumnsType<NewWordCreate> = [
    {
      title: '序号',
      dataIndex: 'No',
      key: 'No',
      render: (_: number, _record: NewWordCreate, rowIndex: number) => rowIndex + 1,
      width: '8%',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '文章ID',
      dataIndex: 'articleId',
      key: 'articleId',
    },
    {
      title: '词库表ID',
      dataIndex: 'wordId',
      key: 'wordId',
    },
    {
      title: '单词',
      dataIndex: 'word',
      key: 'word',
    },
    {
      title: '复习次数',
      dataIndex: 'reviewCount',
      key: 'reviewCount',
    },
    {
      title: '复习时间',
      dataIndex: 'nextReviewDate',
      key: 'nextReviewDate',
    },
    {
      title: '租户ID',
      dataIndex: 'tenantId',
      key: 'tenantId',
    },
    {
      title: '校验信息',
      dataIndex: 'errMsg',
      key: 'errMsg',
    },
  ];

  const handleNewWordExportTemplate = async () => {
    await exportNewWordTemplate();
  };

  const customUploadRequest = async (options: UploadRequestOption): Promise<void | undefined> => {
    const { onSuccess, onError, file } = options;
    const rcFile = file as RcFile;
    if (!rcFile.name.endsWith('.xls') && !rcFile.name.endsWith('.xlsx')) {
      message.error('仅支持xls、xlsx格式文件');
      onError?.(new Error('仅支持xls、xlsx格式文件'));
      return;
    }
    setNewWordImportFileList((prev) => [...prev, rcFile]);
    setTimeout(() => {
      onSuccess?.(rcFile);
    }, 200);
  };

  const handleRemove = (file: UploadFile) => {
    setNewWordImportFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleNewWordImportCancel = () => {
    onNewWordImportCancel();
    setIsUploadShow(true);
  };

  return (
    <Modal
      title="阅读生词导入"
      open={isNewWordImportModalVisible}
      onCancel={handleNewWordImportCancel}
      footer={footerButtons}
      width={'70%'}
    >
      {isUploadShow ? (
        <div>
          <div>
            <Upload.Dragger
              name="file"
              multiple
              accept=".xlsx,.xls"
              onRemove={handleRemove}
              fileList={NewWordImportFileList}
              customRequest={customUploadRequest as any}
            >
              <p className="sc-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="sc-upload-text">{'点击或拖拽到此上传'}</p>
              <p className="sc-upload-hint">仅支持上传xls、xlsx格式的文件</p>
            </Upload.Dragger>
          </div>
          <div onClick={handleNewWordExportTemplate} className="cursor-pointer mt-4 text-blue-600">
            下载模板
          </div>
        </div>
      ) : (
        <div>
          <Table
            columns={NewWordPageColumns}
            dataSource={NewWordCreateList}
            pagination={false}
            bordered={false}
            rowKey={'id'}
          />
        </div>
      )}
    </Modal>
  );
};

export default NewWordImportComponent;
