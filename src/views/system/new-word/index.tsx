import React, { useEffect, useState } from 'react';
import {
  batchCreateNewWord,
  batchModifyNewWord,
  batchRemoveNewWord,
  createNewWord,
  fetchNewWordByPage,
  importNewWord,
  modifyNewWord,
} from '@/service/new-word';
import { NewWordBatchModify, NewWordCreate, NewWordModify, NewWordPage } from '@/types/new-word';
import { PaginatedTable } from '@/components/base/paginated-table';
import { ColumnsType } from 'antd/lib/table';
import { BaseQueryImpl } from '@/types';
import ActionButtonComponent from '@/components/base/action-button';
import { message } from '@/components/GlobalToast';
import NewWordCreateComponent from '@/views/system/new-word/components/new-word-create';
import { Form } from 'antd';
import NewWordQueryComponent from '@/views/system/new-word/components/new-word-query';
import NewWordModifyComponent from '@/views/system/new-word/components/new-word-modify';
import NewWordBatchModifyComponent from '@/views/system/new-word/components/new-word-batch-modify';
import NewWordImportComponent from '@/views/system/new-word/components/new-word-import';
import type { RcFile } from 'rc-upload/lib/interface';

const NewWord: React.FC = () => {
  // 查询模块
  const [newWordPageDataSource, setNewWordPageDataSource] = useState<NewWordPage[]>([]);
  const [newWordPageTotalCount, setNewWordPageTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    const fetchData = async () => {
      const newWordPage = await newWordQueryForm.validateFields() as NewWordPage;
      const pageData = BaseQueryImpl.create(current, pageSize).buildPage();
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
    setCurrent(1)
    setPageSize(10)
  }
  // 表格列信息
  const newWordPageColumns: ColumnsType<NewWordPage> = [
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
      title: '复习时间',
      dataIndex: 'nextReviewDate',
      key: 'nextReviewDate',
    },
    {
      title: '租户ID',
      dataIndex: 'tenantId',
      key: 'tenantId',
    },
  ];
  const [newWordQueryForm] = Form.useForm();
  const handleNewWordQueryReset = () => {
    resetPagination()
    newWordQueryForm.resetFields();
  };
  const onNewWordQueryFinish = async () => {
    const newWordPage = await newWordQueryForm.validateFields() as NewWordPage;
    await handleNewWordQueryFinish(newWordPage);
  };
  const handleNewWordQueryFinish = async (newWordPage: NewWordPage) => {
    await fetchNewWordByPage(BaseQueryImpl.create(current, pageSize).buildPage(), newWordPage).then(resp => {
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
    newWordCreateForm.resetFields()
    setIsNewWordCreateModalVisible(false);
  };
  const handleNewWordCreateFinish = async (newWordCreate: NewWordCreate) => {
    setIsNewWordCreateLoading(true);
    try {
      await createNewWord(newWordCreate);
      message.success('新增成功');
      newWordCreateForm.resetFields();
      await onNewWordQueryFinish()
    } finally {
      setIsNewWordCreateLoading(false);
      setIsNewWordCreateModalVisible(false);
    }
  };

  // 删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<NewWordPage[]>([]);
  const handleSelectionChange = (selectedRowKeys: React.Key[], selectedRows: NewWordPage[]) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };
  const handleNewWordBatchRemove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的项目');
      return;
    }
    try {
      setIsBatchRemoveLoading(true)
      await batchRemoveNewWord(selectedRowKeys.map((key) => Number(key)));
      await onNewWordQueryFinish()
    } finally {
      setIsBatchRemoveLoading(false)
    }
  };
  const handleNewWordBatchRemoveCancel = async () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    message.info('操作已取消');
  };

  // 单个修改模块
  const [isNewWordModifyModalVisible, setIsNewWordModifyModalVisible] = useState<boolean>(false);
  const [isNewWordModifyLoading, setIsNewWordModifyLoading] = useState<boolean>(false);
  const [newWordModifyForm] = Form.useForm();
  const handleNewWordModifyCancel = () => {
    newWordModifyForm.resetFields();
    setIsNewWordModifyModalVisible(false);
  };
  const handleNewWordModifyFinish = async () => {
    const newWordModify = await newWordModifyForm.validateFields() as NewWordModify;
    setIsNewWordModifyLoading(true);
    try {
      await modifyNewWord(newWordModify);
      newWordModifyForm.resetFields();
      message.success('修改成功');
    } finally {
      setIsNewWordModifyLoading(false)
      setIsNewWordModifyModalVisible(false);
    }
  };

  // 批量修改模块
  const onNewWordBatchModify = () => {
    if (selectedRowKeys.length === 1) {
      setIsNewWordModifyModalVisible(true)
      newWordModifyForm.setFieldsValue({...selectedRows[0]})
    } else {
      setIsNewWordBatchModifyModalVisible(true)
      newWordBatchModifyForm.resetFields()
    }

  };
  const [isNewWordBatchModifyModalVisible, setIsNewWordBatchModifyModalVisible] = useState<boolean>(false);
  const [isNewWordBatchModifyLoading, setIsNewWordBatchModifyLoading] = useState<boolean>(false);
  const [newWordBatchModifyForm] = Form.useForm();
  const handleNewWordBatchModifyCancel = () => {
    newWordBatchModifyForm.resetFields();
    setIsNewWordBatchModifyModalVisible(false);
  };
  const handleNewWordBatchModifyFinish = async () => {
    const newWordBatchModify = await newWordBatchModifyForm.validateFields() as NewWordBatchModify;
    setIsNewWordBatchModifyLoading(true);
    try {
      await batchModifyNewWord(newWordBatchModify, selectedRowKeys.map((key) => Number(key)));
      newWordBatchModifyForm.resetFields();
      message.success('修改成功');
    } finally {
      setIsNewWordBatchModifyLoading(false)
      setIsNewWordBatchModifyModalVisible(false);
    }
  };


  // 导入模块
  const [isNewWordImportModalVisible, setIsNewWordImportModalVisible] = useState<boolean>(false);
  const [isNewWordImportLoading, setIsNewWordImportLoading] = useState<boolean>(false);
  const [newWordCreateList, setNewWordCreateList] = useState<NewWordCreate[]>([]);

  const onNewWordImport = () => {
    setIsNewWordImportModalVisible(true)
  };
  const handleNewWordImportCancel = () => {
    setIsNewWordImportModalVisible(false)
  }
  const onNewWordImportFinish = async (fileList: RcFile[]) => {
    try {
      setIsNewWordImportLoading(true)
      const newWordCreateList = await importNewWord(fileList)
      setNewWordCreateList(newWordCreateList)
      return newWordCreateList
    } finally {
      setIsNewWordImportLoading(false)
    }
  }

  const handleNewWordImport = async () => {
    setIsNewWordImportLoading(true)
    try {
      await batchCreateNewWord(newWordCreateList)
    } finally {
      setIsNewWordImportLoading(false)
      setNewWordCreateList([])
    }
  }



  // 导出模块
  const onNewWordExport = async () => {
    message.error('Export functionality not implemented');
  };

  // 操作配置模块
  const actionConfig = {
    showCreate: true,
    showImport: true,
    showExport: false,
    showModify: false,
    showRemove: true,
  }
  return (
    <div className="container mx-auto px-4 bg-white">
      <div className="shadow-sm">
        {/*查询模块*/}
        <NewWordQueryComponent
          onNewWordQueryFinish={onNewWordQueryFinish}
          onNewWordQueryReset={handleNewWordQueryReset}
          newWordQueryForm={newWordQueryForm}
        />
      </div>
      <div>
        <ActionButtonComponent
          onCreate={onNewWordCreate}
          onImport={onNewWordImport}
          onExport={onNewWordExport}
          onBatchModify={onNewWordBatchModify}
          onConfirmBatchRemove={handleNewWordBatchRemove}
          onConfirmBatchRemoveCancel={handleNewWordBatchRemoveCancel}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        {/*分页展示模块*/}
        <PaginatedTable<NewWordPage>
          columns={newWordPageColumns}
          dataSource={newWordPageDataSource}
          total={newWordPageTotalCount}
          current={current}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
          onSelectionChange={handleSelectionChange}
          rowKey="userId"
        />
      </div>
      <div>
        <div>
          {/*新增模块*/}
          <NewWordCreateComponent
            isNewWordCreateModalVisible={isNewWordCreateModalVisible}
            onNewWordCreateCancel={handleNewWordCreateCancel}
            onNewWordCreateFinish={handleNewWordCreateFinish}
            isNewWordCreateLoading={isNewWordCreateLoading}
            newWordCreateForm={newWordCreateForm}
          />
        </div>
        <div>
          {/*单个修改模块*/}
          <NewWordModifyComponent
            isNewWordModifyModalVisible={isNewWordModifyModalVisible}
            onNewWordModifyCancel={handleNewWordModifyCancel}
            onNewWordModifyFinish={handleNewWordModifyFinish}
            isNewWordModifyLoading={isNewWordModifyLoading}
            newWordModifyForm={newWordModifyForm}
          />
        </div>
        <div>
          {/*批量修改模块*/}
          <NewWordBatchModifyComponent
            isNewWordBatchModifyModalVisible={isNewWordBatchModifyModalVisible}
            onNewWordBatchModifyCancel={handleNewWordBatchModifyCancel}
            onNewWordBatchModifyFinish={handleNewWordBatchModifyFinish}
            isNewWordBatchModifyLoading={isNewWordBatchModifyLoading}
            newWordBatchModifyForm={newWordBatchModifyForm}
          />
        </div>
        <div>
          {/*导入模块*/}
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
