import type React from 'react';
import { useState } from 'react';
import { Button, Input, message, Upload, UploadFile } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { RcFile } from 'rc-upload/lib/interface';
import { UploadRequestOption } from 'rc-upload/es/interface';
import { croPdf } from '@/service/pdf_manage';

const PdfCropper: React.FC = () => {
  const [pageRange, setPageRange] = useState<string>('');
  const [importFileList, setImportFileList] = useState<RcFile[]>([]);

  const handleDownload = async () => {
    if (!importFileList || !pageRange) {
      message.error('Please upload a PDF file and enter a page range.');
      return;
    }

    // Validate page range format
    const rangePattern = /^\d+-\d+$/;
    if (!rangePattern.test(pageRange)) {
      message.error('Invalid page range format. Use "start-end" (e.g., "1-3").');
      return;
    }
    await croPdf(importFileList[0], pageRange)
  };

  const customUploadRequest = async (options: UploadRequestOption): Promise<void | undefined> => {
    const { onSuccess, onError, file } = options;
    const rcFile = file as RcFile;
    if (!rcFile.name.endsWith('.pdf') && !rcFile.name.endsWith('.xlsx')) {
      message.error('仅支持pdf格式文件');
      onError?.(new Error('仅支持pdf格式文件'));
      return;
    }
    setImportFileList((prev) => [...prev, rcFile]);
    setTimeout(() => {
      onSuccess?.(rcFile);
    }, 200);
  };


  const handleRemove = (file: UploadFile) => {
    setImportFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  return (
    <div style={{ padding: '20px', width: "40%"}}>
      <div>
        <Upload.Dragger
          name="file"
          multiple
          accept=".pdf"
          onRemove={handleRemove}
          fileList={importFileList}
          customRequest={customUploadRequest as any}
        >
          <p className="sc-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="sc-upload-text">{'点击或拖拽到此上传'}</p>
          <p className="sc-upload-hint">仅支持上传pdf格式的文件</p>
        </Upload.Dragger>
      </div>

      <Input
        placeholder="Enter page range (e.g., 1-3)"
        value={pageRange}
        onChange={(e) => setPageRange(e.target.value)}
        style={{ marginTop: '20px', width: '100%' }}
      />
      <div></div>
      <Button type="primary" onClick={handleDownload} style={{ marginTop: '20px', width: '100%', }}>
        Download Cropped PDF
      </Button>
    </div>
  );
};

export default PdfCropper;

