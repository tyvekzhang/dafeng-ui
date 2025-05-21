import { message } from '@/components/GlobalToast';
import { exportArticleTemplate } from '@/service/article';
import { ArticleCreate } from '@/types/article';
import { InboxOutlined } from '@ant-design/icons';
import { Button, Modal, Table, Upload, UploadFile } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { UploadRequestOption } from 'rc-upload/es/interface';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useState } from 'react';

interface ArticleImportProps {
  isArticleImportModalVisible: boolean;
  isArticleImportLoading: boolean;
  onArticleImportCancel: () => void;
  onArticleImportFinish: (fileList: RcFile[]) => Promise<ArticleCreate[]>;
  handleArticleImport: () => void;
}

const ArticleImportComponent: React.FC<ArticleImportProps> = ({
  isArticleImportModalVisible,
  onArticleImportCancel,
  onArticleImportFinish,
  isArticleImportLoading,
  handleArticleImport,
}) => {
  const [articleImportFileList, setArticleImportFileList] = useState<RcFile[]>([]);
  const [ArticleCreateList, setArticleCreateList] = useState<ArticleCreate[]>([]);
  const [isUploadShow, setIsUploadShow] = useState<boolean>(true);

  const footerButtons = () => [
    <Button key="back" onClick={handleArticleImportCancel}>
      取消
    </Button>,
    <Button key="submit" type="primary" loading={isArticleImportLoading} onClick={handleArticleImportConfirm}>
      确定
    </Button>,
  ];

  const handleArticleImportConfirm = async () => {
    if (isUploadShow) {
      if (articleImportFileList.length === 0) {
        message.warning('请先选择文件');
        return;
      }
      try {
        const ArticlePageList = await onArticleImportFinish(articleImportFileList);
        setIsUploadShow(false);
        setArticleCreateList(ArticlePageList as ArticleCreate[]);
      } finally {
        setArticleImportFileList([]);
      }
    } else {
      handleArticleImport();
      setIsUploadShow(true);
    }
  };
  // 表格列信息
  const ArticlePageColumns: ColumnsType<ArticleCreate> = [
    {
      title: "序号",
      dataIndex: "No",
      key: "No",
      render: (_: number, _record: ArticleCreate, rowIndex: number) => rowIndex + 1,
      width: "8%",
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "doi地址",
      dataIndex: "doi",
      key: "doi",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "期刊名称",
      dataIndex: "publication",
      key: "publication",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "问题",
      dataIndex: "query",
      key: "query",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "问题嵌入向量",
      dataIndex: "query_vector",
      key: "query_vector",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "方法",
      dataIndex: "methods",
      key: "methods",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      key: "create_time",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "错误信息",
      dataIndex: "errMsg",
      key: "errMsg",
      render: (text) => (text ? text : "-"),
    },
  ];

  const handleArticleExportTemplate = async () => {
    await exportArticleTemplate();
  };

  const customUploadRequest = async (options: UploadRequestOption): Promise<void | undefined> => {
    const { onSuccess, onError, file } = options;
    const rcFile = file as RcFile;
    if (!rcFile.name.endsWith('.xls') && !rcFile.name.endsWith('.xlsx')) {
      message.error('仅支持xls、xlsx格式文件');
      onError?.(new Error('仅支持xls、xlsx格式文件'));
      return;
    }
    setArticleImportFileList((prev) => [...prev, rcFile]);
    setTimeout(() => {
      onSuccess?.(rcFile);
    }, 200);
  };

  const handleRemove = (file: UploadFile) => {
    setArticleImportFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleArticleImportCancel = () => {
    onArticleImportCancel();
    setIsUploadShow(true);
  };

  return (
    <Modal
      title="文章信息导入"
      open={isArticleImportModalVisible}
      onCancel={handleArticleImportCancel}
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
              fileList={ articleImportFileList}
              customRequest={customUploadRequest as any}
            >
              <p className="sc-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="sc-upload-text">{'点击或拖拽到此上传'}</p>
              <p className="sc-upload-hint">仅支持上传xls、xlsx格式的文件</p>
            </Upload.Dragger>
          </div>
          <div onClick={handleArticleExportTemplate} className="cursor-pointer mt-4 text-blue-600">
            下载模板
          </div>
        </div>
      ) : (
        <div>
          <Table
            columns={ ArticlePageColumns}
            dataSource={ ArticleCreateList}
            pagination={false}
            bordered={false}
            rowKey={'id'}
          />
        </div>
      )}
    </Modal>
  );
};

export default ArticleImportComponent;