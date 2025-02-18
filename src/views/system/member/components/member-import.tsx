import { message } from '@/components/GlobalToast';
import { exportMemberTemplate } from '@/service/member';
import { MemberCreate } from '@/types/member';
import { InboxOutlined } from '@ant-design/icons';
import { Button, Modal, Table, Upload, UploadFile } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { UploadRequestOption } from 'rc-upload/es/interface';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';

interface MemberImportProps {
  isMemberImportModalVisible: boolean;
  isMemberImportLoading: boolean;
  onMemberImportCancel: () => void;
  onMemberImportFinish: (fileList: RcFile[]) => Promise<MemberCreate[]>;
  handleMemberImport: () => void;
}

const MemberImportComponent: React.FC<MemberImportProps> = ({
  isMemberImportModalVisible,
  onMemberImportCancel,
  onMemberImportFinish,
  isMemberImportLoading,
  handleMemberImport,
}) => {
  const [memberImportFileList, setMemberImportFileList] = useState<RcFile[]>([]);
  const [MemberCreateList, setMemberCreateList] = useState<MemberCreate[]>([]);
  const [isUploadShow, setIsUploadShow] = useState<boolean>(true);

  const footerButtons = () => [
    <Button key="back" onClick={handleMemberImportCancel}>
      取消
    </Button>,
    <Button key="submit" type="primary" loading={isMemberImportLoading} onClick={handleMemberImportConfirm}>
      确定
    </Button>,
  ];

  const handleMemberImportConfirm = async () => {
    if (isUploadShow) {
      if (memberImportFileList.length === 0) {
        message.warning('请先选择文件');
        return;
      }
      try {
        const MemberPageList = await onMemberImportFinish(memberImportFileList);
        setIsUploadShow(false);
        setMemberCreateList(MemberPageList as MemberCreate[]);
      } finally {
        setMemberImportFileList([]);
      }
    } else {
      handleMemberImport();
      setIsUploadShow(true);
    }
  };
  // 表格列信息
  const MemberPageColumns: ColumnsType<MemberCreate> = [
    {
      title: "序号",
      dataIndex: "No",
      key: "No",
      render: (_: number, _record: MemberCreate, rowIndex: number) => rowIndex + 1,
      width: "8%",
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "国家",
      dataIndex: "nation",
      key: "nation",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "生日",
      dataIndex: "birthday",
      key: "birthday",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "爱好",
      dataIndex: "hobby",
      key: "hobby",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "错误信息",
      dataIndex: "errMsg",
      key: "errMsg",
      render: (text) => (text ? text : "-"),
    },
  ];

  const handleMemberExportTemplate = async () => {
    await exportMemberTemplate();
  };

  const customUploadRequest = async (options: UploadRequestOption): Promise<void | undefined> => {
    const { onSuccess, onError, file } = options;
    const rcFile = file as RcFile;
    if (!rcFile.name.endsWith('.xls') && !rcFile.name.endsWith('.xlsx')) {
      message.error('仅支持xls、xlsx格式文件');
      onError?.(new Error('仅支持xls、xlsx格式文件'));
      return;
    }
    setMemberImportFileList((prev) => [...prev, rcFile]);
    setTimeout(() => {
      onSuccess?.(rcFile);
    }, 200);
  };

  const handleRemove = (file: UploadFile) => {
    setMemberImportFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleMemberImportCancel = () => {
    onMemberImportCancel();
    setIsUploadShow(true);
  };

  return (
    <Modal
      title="会员管理导入"
      open={isMemberImportModalVisible}
      onCancel={handleMemberImportCancel}
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
              fileList={ memberImportFileList}
              customRequest={customUploadRequest as any}
            >
              <p className="sc-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="sc-upload-text">{'点击或拖拽到此上传'}</p>
              <p className="sc-upload-hint">仅支持上传xls、xlsx格式的文件</p>
            </Upload.Dragger>
          </div>
          <div onClick={handleMemberExportTemplate} className="cursor-pointer mt-4 text-blue-600">
            下载模板
          </div>
        </div>
      ) : (
        <div>
          <Table
            columns={ MemberPageColumns}
            dataSource={ MemberCreateList}
            pagination={false}
            bordered={false}
            rowKey={'id'}
          />
        </div>
      )}
    </Modal>
  );
};

export default MemberImportComponent;