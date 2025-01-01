import ActionButtonComponent from '@/components/base/action-button';
import { PaginatedTable } from '@/components/base/paginated-table';
import TransitionWrapper from '@/components/base/transition-wrapper';
import { message } from '@/components/GlobalToast';
import {
  batchCreateNewWord,
  batchModifyNewWord,
  batchRemoveNewWord,
  createNewWord,
  exportNewWordPage,
  fetchNewWordByPage,
  fetchNewWordDetail,
  importNewWord,
  modifyNewWord,
  removeNewWord,
} from '@/service/new-word';
import { BaseQueryImpl } from '@/types';
import { NewWordBatchModify, NewWordCreate, NewWordDetail, NewWordModify, NewWordPage } from '@/types/new-word';
import NewWordBatchModifyComponent from '@/views/system/new-word/components/new-word-batch-modify';
import NewWordCreateComponent from '@/views/system/new-word/components/new-word-create';
import NewWordDetailComponent from '@/views/system/new-word/components/new-word-detail';
import NewWordImportComponent from '@/views/system/new-word/components/new-word-import';
import NewWordModifyComponent from '@/views/system/new-word/components/new-word-modify';
import NewWordQueryComponent from '@/views/system/new-word/components/new-word-query';
import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useEffect, useState } from 'react';

const NewWord: React.FC = () => {
  // 配置模块
  const actionConfig = {
    showCreate: true,
    showImport: true,
    showExport: true,
    showModify: true,
    showRemove: true,
  };
  const showMore = false;

  // 查询模块
  const [isNewWordQueryShow, setIsNewWordQueryShow] = useState<boolean>(true);
  const [newWordPageDataSource, setNewWordPageDataSource] = useState<NewWordPage[]>([]);
  const [newWordPageTotalCount, setNewWordPageTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const onNewWordQueryShow = () => {
    setIsNewWordQueryShow((prevState) => !prevState);
  };
  useEffect(() => {
    const fetchData = async () => {
      const newWordPage = (await newWordQueryForm.validateFields()) as NewWordPage;
      const pageData = BaseQueryImpl.create(current, pageSize);
      const resp = await fetchNewWordByPage(pageData, newWordPage);
      setNewWordPageDataSource(resp.records);
      setNewWordPageTotalCount(resp.total);
    };
    fetchData().then(() => {});
  }, [current, pageSize]);

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setCurrent(newPage);
    setPageSize(newPageSize);
  };
  const resetPagination = () => {
    setCurrent(1);
    setPageSize(10);
  };

  // 详情模块
  const [isNewWordDetailDrawerVisible, setIsNewWordDetailDrawerVisible] = useState<boolean>(false);
  const [newWordDetail, setNewWordDetail] = useState<NewWordDetail | null>(null);
  const onNewWordDetail = async (newWordPage: NewWordPage) => {
    setIsNewWordDetailDrawerVisible(true);
    const id = newWordPage.id;
    await fetchNewWordDetail(id).then(setNewWordDetail);
  };

  const onNewWordDetailClose = async () => {
    setNewWordDetail(null);
    setIsNewWordDetailDrawerVisible(false);
  };

  // 表格列信息
  const newWordPageColumns: ColumnsType<NewWordPage> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      hidden: true,
    },
    {
      title: '序号',
      dataIndex: 'No',
      key: 'No',
      render: (_: number, _record: NewWordPage, rowIndex: number) => rowIndex + 1,
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
      title: '下次复习时间',
      dataIndex: 'nextReviewDate',
      key: 'nextReviewDate',
    },
    {
      title: '租户ID',
      dataIndex: 'tenantId',
      key: 'tenantId',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center gap-1 text-red-500 text-[12px] btn-operation"
            onClick={() => onNewWordDetail(record)}
          >
            <EyeOutlined className="w-3 h-3" />
            详情
          </button>
          <button
            type="button"
            className="flex items-center gap-1 text-blue-500 text-[12px] btn-operation"
            onClick={() => onNewWordModify(record)}
          >
            <EditOutlined className="w-3 h-3" />
            编辑
          </button>
          <button
            type="button"
            className="flex items-center gap-1 text-red-500 text-[12px] btn-remove"
            onClick={() => handleNewWordDelete(record)}
          >
            <DeleteOutlined className="w-3 h-3" />
            删除
          </button>

          {showMore && (
            <button type="button" className="flex items-center gap-1 text-blue-500 text-[10px] btn-operation">
              <span>更多</span>
              <MoreOutlined className="w-3 h-3" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState(newWordPageColumns.map((col) => col.key));
  const onToggleColumnVisibility = (columnKey: number) => {
    setVisibleColumns((prevVisibleColumns) => {
      if (prevVisibleColumns.includes(columnKey)) {
        return prevVisibleColumns.filter((key) => key !== columnKey);
      } else {
        return [...prevVisibleColumns, columnKey];
      }
    });
  };
  const filteredNewWordColumns = newWordPageColumns.filter((col) => visibleColumns.includes(col.key));

  const [newWordQueryForm] = Form.useForm();
  const handleNewWordQueryReset = () => {
    resetPagination();
    newWordQueryForm.resetFields();
  };
  const onNewWordQueryFinish = async () => {
    const newWordPage = (await newWordQueryForm.validateFields()) as NewWordPage;
    const filteredNewWordPage = Object.fromEntries(
      Object.entries(newWordPage).filter(([, value]) => value !== undefined && value !== null && value !== ''),
    );
    resetPagination();
    await handleNewWordQueryFinish(filteredNewWordPage as NewWordPage);
  };
  const handleNewWordQueryFinish = async (newWordPage: NewWordPage) => {
    await fetchNewWordByPage(BaseQueryImpl.create(current, pageSize), newWordPage).then((resp) => {
      setNewWordPageDataSource(resp.records);
      setNewWordPageTotalCount(resp.total);
    });
  };

  // 新增模块
  const [isNewWordCreateModalVisible, setIsNewWordCreateModalVisible] = useState(false);
  const [isNewWordCreateLoading, setIsNewWordCreateLoading] = useState(false);
  const [newWordCreateForm] = Form.useForm();
  const onNewWordCreate = () => {
    setIsNewWordCreateModalVisible(true);
  };
  const handleNewWordCreateCancel = () => {
    newWordCreateForm.resetFields();
    setIsNewWordCreateModalVisible(false);
  };
  const handleNewWordCreateFinish = async (newWordCreate: NewWordCreate) => {
    setIsNewWordCreateLoading(true);
    try {
      await createNewWord(newWordCreate);
      message.success('新增成功');
      newWordCreateForm.resetFields();
      await onNewWordQueryFinish();
    } finally {
      setIsNewWordCreateLoading(false);
      setIsNewWordCreateModalVisible(false);
    }
  };

  // 单个删除模块
  const handleNewWordDelete = async (newWordPage: NewWordPage) => {
    await removeNewWord(newWordPage.id);
    await onNewWordQueryFinish();
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<NewWordPage[]>([]);
  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  const handleSelectionChange = (selectedRowKeys: React.Key[], selectedRows: NewWordPage[]) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };
  const handleNewWordBatchRemove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的项目');
      return;
    }
    try {
      setIsBatchRemoveLoading(true);
      await batchRemoveNewWord(selectedRowKeys.map((key) => Number(key)));
      await onNewWordQueryFinish();
      resetSelectedRows();
    } finally {
      setIsBatchRemoveLoading(false);
    }
  };
  const handleNewWordBatchRemoveCancel = async () => {
    resetSelectedRows();
    message.info('操作已取消');
  };

  // 单个更新模块
  const [isNewWordModifyModalVisible, setIsNewWordModifyModalVisible] = useState<boolean>(false);
  const [isNewWordModifyLoading, setIsNewWordModifyLoading] = useState<boolean>(false);
  const [newWordModifyForm] = Form.useForm();
  const onNewWordModify = (record: NewWordPage) => {
    setIsNewWordModifyModalVisible(true);
    newWordModifyForm.setFieldsValue({ ...record });
  };

  const handleNewWordModifyCancel = () => {
    newWordModifyForm.resetFields();
    setIsNewWordModifyModalVisible(false);
  };
  const handleNewWordModifyFinish = async () => {
    const newWordModify = (await newWordModifyForm.validateFields()) as NewWordModify;
    setIsNewWordModifyLoading(true);
    try {
      await modifyNewWord(newWordModify);
      newWordModifyForm.resetFields();
      message.success('更新成功');
      await onNewWordQueryFinish();
      resetSelectedRows();
    } finally {
      setIsNewWordModifyLoading(false);
      setIsNewWordModifyModalVisible(false);
    }
  };

  // 批量更新模块
  const onNewWordBatchModify = () => {
    if (selectedRowKeys.length === 1) {
      setIsNewWordModifyModalVisible(true);
      newWordModifyForm.setFieldsValue({ ...selectedRows[0] });
    } else {
      setIsNewWordBatchModifyModalVisible(true);
      newWordBatchModifyForm.resetFields();
    }
  };
  const [isNewWordBatchModifyModalVisible, setIsNewWordBatchModifyModalVisible] = useState<boolean>(false);
  const [isNewWordBatchModifyLoading, setIsNewWordBatchModifyLoading] = useState<boolean>(false);
  const [newWordBatchModifyForm] = Form.useForm();
  const handleNewWordBatchModifyCancel = async () => {
    newWordBatchModifyForm.resetFields();
    setIsNewWordBatchModifyModalVisible(false);
    resetSelectedRows();
    message.info('操作已取消');
  };
  const handleNewWordBatchModifyFinish = async () => {
    const newWordBatchModify = (await newWordBatchModifyForm.validateFields()) as NewWordBatchModify;
    setIsNewWordBatchModifyLoading(true);
    try {
      newWordBatchModify.ids = selectedRowKeys.map((key) => Number(key));
      await batchModifyNewWord(newWordBatchModify);
      newWordBatchModifyForm.resetFields();
      message.success('更新成功');
      await onNewWordQueryFinish();
      resetSelectedRows();
    } finally {
      setIsNewWordBatchModifyLoading(false);
      setIsNewWordBatchModifyModalVisible(false);
    }
  };

  // 导入模块
  const [isNewWordImportModalVisible, setIsNewWordImportModalVisible] = useState<boolean>(false);
  const [isNewWordImportLoading, setIsNewWordImportLoading] = useState<boolean>(false);
  const [newWordCreateList, setNewWordCreateList] = useState<NewWordCreate[]>([]);

  const onNewWordImport = () => {
    setIsNewWordImportModalVisible(true);
  };
  const handleNewWordImportCancel = () => {
    setIsNewWordImportModalVisible(false);
  };
  const onNewWordImportFinish = async (fileList: RcFile[]) => {
    try {
      setIsNewWordImportLoading(true);
      const newWordCreateList = await importNewWord(fileList[0]);
      setNewWordCreateList(newWordCreateList);
      return newWordCreateList;
    } finally {
      setIsNewWordImportLoading(false);
    }
  };

  const handleNewWordImport = async () => {
    setIsNewWordImportLoading(true);
    try {
      await batchCreateNewWord(newWordCreateList);
      message.success('导入成功');
      setIsNewWordImportModalVisible(false);
      await onNewWordQueryFinish();
    } finally {
      setIsNewWordImportLoading(false);
      setNewWordCreateList([]);
    }
  };

  // 导出模块
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const onNewWordExport = async () => {
    if (selectedRowKeys === null || selectedRowKeys.length === 0) {
      message.warning('请先选择导出的项目');
      return;
    }
    try {
      setIsExportLoading(true);
      await exportNewWordPage(selectedRowKeys.map((key) => Number(key)));
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 bg-white">
      <TransitionWrapper show={isNewWordQueryShow}>
        <div className="shadow-sm">
          <NewWordQueryComponent
            onNewWordQueryFinish={onNewWordQueryFinish}
            onNewWordQueryReset={handleNewWordQueryReset}
            newWordQueryForm={newWordQueryForm}
          />
        </div>
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onNewWordCreate}
          onImport={onNewWordImport}
          onExport={onNewWordExport}
          onBatchModify={onNewWordBatchModify}
          onConfirmBatchRemove={handleNewWordBatchRemove}
          onConfirmBatchRemoveCancel={handleNewWordBatchRemoveCancel}
          isQueryShow={isNewWordQueryShow}
          onQueryShow={onNewWordQueryShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={isExportLoading}
          rawColumns={newWordPageColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<NewWordPage>
          columns={filteredNewWordColumns}
          dataSource={newWordPageDataSource}
          total={newWordPageTotalCount}
          current={current}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
          onSelectionChange={handleSelectionChange}
          selectedRowKeys={selectedRowKeys}
          rowKey="id"
        />
      </div>
      <div>
        <div>
          <NewWordCreateComponent
            isNewWordCreateModalVisible={isNewWordCreateModalVisible}
            onNewWordCreateCancel={handleNewWordCreateCancel}
            onNewWordCreateFinish={handleNewWordCreateFinish}
            isNewWordCreateLoading={isNewWordCreateLoading}
            newWordCreateForm={newWordCreateForm}
          />
        </div>
        <div>
          <NewWordDetailComponent
            isNewWordDetailDrawerVisible={isNewWordDetailDrawerVisible}
            onNewWordDetailClose={onNewWordDetailClose}
            newWordDetail={newWordDetail}
          />
        </div>
        <div>
          <NewWordModifyComponent
            isNewWordModifyModalVisible={isNewWordModifyModalVisible}
            onNewWordModifyCancel={handleNewWordModifyCancel}
            onNewWordModifyFinish={handleNewWordModifyFinish}
            isNewWordModifyLoading={isNewWordModifyLoading}
            newWordModifyForm={newWordModifyForm}
          />
        </div>
        <div>
          <NewWordBatchModifyComponent
            isNewWordBatchModifyModalVisible={isNewWordBatchModifyModalVisible}
            onNewWordBatchModifyCancel={handleNewWordBatchModifyCancel}
            onNewWordBatchModifyFinish={handleNewWordBatchModifyFinish}
            isNewWordBatchModifyLoading={isNewWordBatchModifyLoading}
            newWordBatchModifyForm={newWordBatchModifyForm}
          />
        </div>
        <div>
          <NewWordImportComponent
            isNewWordImportModalVisible={isNewWordImportModalVisible}
            isNewWordImportLoading={isNewWordImportLoading}
            onNewWordImportFinish={onNewWordImportFinish}
            onNewWordImportCancel={handleNewWordImportCancel}
            handleNewWordImport={handleNewWordImport}
          />
        </div>
      </div>
    </div>
  );
};

export default NewWord;
