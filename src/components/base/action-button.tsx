import { Button, Popconfirm, Space } from 'antd';
import React from 'react';

interface ActionButtonsConfig {
  showCreate?: boolean;
  showImport?: boolean;
  showExport?: boolean;
  showModify?: boolean;
  showRemove?: boolean;
}

interface ActionButtonsProps {
  onCreate: () => void;
  onImport: () => void;
  onExport: () => void;
  onBatchModify: () => void;
  onConfirmBatchRemove: () => void;
  onConfirmBatchRemoveCancel: () => void;
  isExportDisabled: boolean;
  isBatchModifyDisabled: boolean;
  isBatchRemoveDisabled: boolean;
  isBatchRemoveLoading: boolean;
  isExportLoading: boolean;
  className?: string;
  actionConfig?: ActionButtonsConfig;
}

const ActionButtonComponent: React.FC<ActionButtonsProps> = ({
  onCreate,
  onImport,
  onExport,
  onBatchModify,
  onConfirmBatchRemove,
  onConfirmBatchRemoveCancel,
  isExportDisabled,
  isBatchModifyDisabled,
  isBatchRemoveDisabled,
  isBatchRemoveLoading,
  isExportLoading,
  className = '',
  actionConfig = {},
}) => {
  const defaultConfig = {
    showCreate: true,
    showImport: false,
    showExport: false,
    showModify: false,
    showRemove: true,
  };
  const config = { ...defaultConfig, ...actionConfig };
  return (
    <Space className={className}>
      {config.showCreate && (
        <Button onClick={onCreate} className="btn-add">
          新增
        </Button>
      )}
      {config.showImport && (
        <Button onClick={onImport} className="btn-import">
          导入
        </Button>
      )}
      {config.showExport && (
        <Button loading={isExportLoading} disabled={isExportDisabled} onClick={onExport} className="btn-export">
          导出
        </Button>
      )}
      {config.showModify && (
        <Button disabled={isBatchModifyDisabled} onClick={onBatchModify} className="btn-batch-update">
          编辑
        </Button>
      )}
      {config.showRemove && (
        <Popconfirm
          title="删除所选的内容"
          description="你确定删除吗? 删除后将无法找回"
          onConfirm={onConfirmBatchRemove}
          onCancel={onConfirmBatchRemoveCancel}
          okText="是"
          cancelText="否"
        >
          <Button loading={isBatchRemoveLoading} disabled={isBatchRemoveDisabled} className="btn-batch-delete">
            删除
          </Button>
        </Popconfirm>
      )}
    </Space>
  );
};

export default ActionButtonComponent;
