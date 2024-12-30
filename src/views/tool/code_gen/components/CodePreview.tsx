import { message } from '@/components/GlobalToast';
import { codePreview } from '@/service/code_gen';
import { CodePreviewResponse } from '@/types/code_gen';
import { CloseOutlined, CopyOutlined } from '@ant-design/icons';
import { Modal, Tabs } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodePreviewProps {
  open: boolean;
  onClose: () => void;
  tableId: number;
}

interface TabItem {
  key: string;
  label: string;
  children: string;
  language: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ open, onClose, tableId }) => {
  const [codePreviewData, setCodePreviewData] = useState<CodePreviewResponse | null>(null);
  const processCodeString = useCallback((code: string) => {
    return code.replace(/\\n/g, '\n').replace(/\\"/g, '"');
  }, []);

  useEffect(() => {
    const fetchCodePreview = async () => {
      if (!tableId || !open) return;

      const data = await codePreview(tableId);
      setCodePreviewData(data);
    };

    fetchCodePreview();
  }, [tableId, open]);

  const buildItems = useCallback(
    (data: CodePreviewResponse | null): TabItem[] => {
      if (!data) return [];

      return [
        { key: 'entity', label: 'entity.java', children: processCodeString(data.entity), language: 'java' },
        { key: 'mapper', label: 'mapper.java', children: processCodeString(data.mapper), language: 'java' },
        { key: 'service', label: 'service.java', children: processCodeString(data.service), language: 'java' },
        {
          key: 'serviceImpl',
          label: 'serviceImpl.java',
          children: processCodeString(data.serviceImpl),
          language: 'java',
        },
        { key: 'controller', label: 'controller.java', children: processCodeString(data.controller), language: 'java' },
        { key: 'converter', label: 'converter.java', children: processCodeString(data.converter), language: 'java' },
        { key: 'create', label: 'create.java', children: processCodeString(data.create), language: 'java' },
        { key: 'modify', label: 'modify.java', children: processCodeString(data.modify), language: 'java' },
        {
          key: 'batchModify',
          label: 'batchModify.java',
          children: processCodeString(data.batchModify),
          language: 'java',
        },
        { key: 'query', label: 'query.java', children: processCodeString(data.query), language: 'java' },
        { key: 'detail', label: 'detail.java', children: processCodeString(data.detail), language: 'java' },
        { key: 'page', label: 'page.java', children: processCodeString(data.page), language: 'java' },
        { key: 'index', label: 'index.tsx', children: processCodeString(data.index), language: 'js' },
        { key: 'indexCreate', label: 'iCreate.tsx', children: processCodeString(data.indexCreate), language: 'js' },
        { key: 'api', label: 'api.ts', children: processCodeString(data.api), language: 'js' },
        { key: 'type', label: 'type.ts', children: processCodeString(data.type), language: 'js' },
      ];
    },
    [processCodeString],
  );
  const items = useMemo(() => buildItems(codePreviewData), [buildItems, codePreviewData]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success('代码已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
      });
  }, []);

  const renderTabContent = useCallback(
    ({ children, language }: { children: string; language: string }) => (
      <div className="relative">
        <button
          onClick={() => copyToClipboard(children)}
          className="absolute right-2 top-2 p-2 hover:bg-gray-700 rounded"
          title="复制代码"
          aria-label="复制代码"
        >
          <CopyOutlined className="text-gray-400" />
        </button>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: '4px',
            fontSize: '14px',
          }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    ),
    [copyToClipboard],
  );

  return (
    <Modal
      title="代码预览"
      open={open}
      onCancel={onClose}
      width={1200}
      footer={null}
      closeIcon={<CloseOutlined />}
      destroyOnClose
    >
      <Tabs
        items={items.map((item) => ({
          key: item.key,
          label: item.label,
          children: renderTabContent({ children: item.children, language: item.language }),
        }))}
      />
    </Modal>
  );
};

export default CodePreview;
