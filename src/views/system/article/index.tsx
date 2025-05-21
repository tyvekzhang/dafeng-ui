
import { useAppSelector } from '@/stores';
import { Form } from "antd";
import ActionButtonComponent from "@/components/base/action-button";
import { PaginatedTable } from "@/components/base/paginated-table";
import { message } from "@/components/GlobalToast";
import dayjs from 'dayjs';
import {
  batchCreateArticle,
  batchModifyArticle,
  batchRemoveArticle,
  createArticle,
  exportArticlePage,
  fetchArticleByPage,
  fetchArticleDetail,
  importArticle,
  modifyArticle,
  removeArticle,
} from "@/service/article";
import { BaseQueryImpl } from "@/types";
import { ArticleBatchModify, ArticleCreate, ArticleDetail, ArticleModify, ArticlePage, ArticleQuery } from "@/types/article";
import ArticleBatchModifyComponent from "@/views/system/article/components/article-batch-modify";
import ArticleCreateComponent from "@/views/system/article/components/article-create";
import ArticleImportComponent from "@/views/system/article/components/article-import";
import ArticleModifyComponent from "@/views/system/article/components/article-modify";
import ArticleQueryComponent from "@/views/system/article/components/article-query";
import { ColumnsType } from "antd/lib/table";
import type { RcFile } from "rc-upload/lib/interface";
import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import ArticleDetailComponent from "@/views/system/article/components/article-detail";
import TransitionWrapper from '@/components/base/transition-wrapper';

const Article: React.FC = () => {
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
  const { dictData } = useAppSelector((state: Record<string, any>) => state.dict);
  const [isArticleQueryShow, setIsArticleQueryShow] = useState<boolean>(true)
  const [articlePageDataSource, setArticlePageDataSource] = useState<ArticlePage[]>([]);
  const [articlePageTotalCount, setArticlePageTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const onArticleQueryShow = () => {
    setIsArticleQueryShow(prevState => !prevState)
  }
  useEffect(() => {
    const fetchData = async () => {
      const articleQuery = (await articleQueryForm.validateFields()) as ArticleQuery;
      const pageData = BaseQueryImpl.create(current, pageSize);
      const resp = await fetchArticleByPage(pageData, articleQuery);
      setArticlePageDataSource(resp.records);
      setArticlePageTotalCount(resp.total);
    };
    fetchData().then(() => {
    });
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
  const [isArticleDetailDrawerVisible, setIsArticleDetailDrawerVisible] = useState<boolean>(false);
  const [articleDetail, setArticleDetail] = useState<ArticleDetail | null>(null);
  const onArticleDetail = async (articlePage: ArticlePage) => {
    setIsArticleDetailDrawerVisible(true);
    const id = articlePage.id;
    await fetchArticleDetail(id).then(setArticleDetail);
  };

  const onArticleDetailClose = async () => {
    setArticleDetail(null);
    setIsArticleDetailDrawerVisible(false);
  };

  // 表格列信息
  const articlePageColumns: ColumnsType<ArticlePage> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      hidden: true,
    },
    {
      title: "序号",
      dataIndex: "No",
      key: "No",
      render: (_: number, _record: ArticlePage, rowIndex: number) => rowIndex + 1,
      width: "8%",
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "doi地址",
      dataIndex: "doi",
      key: "doi",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "期刊名称",
      dataIndex: "publication",
      key: "publication",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "问题",
      dataIndex: "query",
      key: "query",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "问题嵌入向量",
      dataIndex: "query_vector",
      key: "query_vector",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "方法",
      dataIndex: "methods",
      key: "methods",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex gap-2 items-center justify-center">
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-operation"
            onClick={ () => onArticleDetail(record)}
          >
            <EyeOutlined className="w-3 h-3" />
            详情
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-operation"
            onClick={ () => onArticleModify(record)}
          >
            <EditOutlined className="w-3 h-3" />
            编辑
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-remove"
            onClick={ () => handleArticleDelete(record)}
          >
            <DeleteOutlined className="w-3 h-3" />
            删除
          </button>

          {showMore && (
            <button type="button" className="flex items-center gap-0.5 text-xs btn-operation">
              <span>更多</span>
              <MoreOutlined className="w-3 h-3" />
            </button>
          )}
        </div>
      ),
    },
  ]

  const [visibleColumns, setVisibleColumns] = useState(articlePageColumns.map(col => col.key));
  const onToggleColumnVisibility = (columnKey: number) => {
    setVisibleColumns(prevVisibleColumns => {
      if (prevVisibleColumns.includes(columnKey)) {
        return prevVisibleColumns.filter(key => key !== columnKey);
      } else {
        return [...prevVisibleColumns, columnKey];
      }
    });
  };
  const filteredArticleColumns = articlePageColumns.filter(col => visibleColumns.includes(col.key));

  const [articleQueryForm] = Form.useForm();
  const handleArticleQueryReset = () => {
    resetPagination();
    articleQueryForm.resetFields();
  };
const onArticleQueryFinish = async () => {
    const articleQueryFormData = articleQueryForm.getFieldsValue();
            const create_timeValue = articleQueryFormData.create_time ? articleQueryFormData.create_time.format('YYYY-MM-DD') : null;
            articleQueryFormData.create_time = create_timeValue;
            const update_timeValue = articleQueryFormData.update_time ? articleQueryFormData.update_time.format('YYYY-MM-DD') : null;
            articleQueryFormData.update_time = update_timeValue;
    const articleQuery = articleQueryFormData as ArticleQuery;
    const filteredArticleQuery = Object.fromEntries(
        Object.entries(articleQuery).filter(([, value]) => value !== undefined && value !== null && value !== ""),
    );
    resetPagination();
    await handleArticleQueryFinish(filteredArticleQuery as ArticleQuery);
};
  const handleArticleQueryFinish = async (articleQuery: ArticleQuery) => {
    await fetchArticleByPage(BaseQueryImpl.create(current, pageSize), articleQuery).then((resp) => {
      setArticlePageDataSource(resp.records);
      setArticlePageTotalCount(resp.total);
    });
  };

  // 新增模块
  const [isArticleCreateModalVisible, setIsArticleCreateModalVisible] = useState(false);
  const [isArticleCreateLoading, setIsArticleCreateLoading] = useState(false);
  const [articleCreateForm] = Form.useForm();
  const onArticleCreate = () => {
    setIsArticleCreateModalVisible(true);
  };
  const handleArticleCreateCancel = () => {
    articleCreateForm.resetFields();
    setIsArticleCreateModalVisible(false);
  };
  const handleArticleCreateFinish = async (articleCreate: ArticleCreate) => {
    setIsArticleCreateLoading(true);
    try {
      await createArticle(articleCreate);
      message.success("新增成功");
      articleCreateForm.resetFields();
      await onArticleQueryFinish();
    } finally {
      setIsArticleCreateLoading(false);
      setIsArticleCreateModalVisible(false);
    }
  };

  // 单个删除模块
  const handleArticleDelete = async (articlePage: ArticlePage) => {
    await removeArticle(articlePage.id);
    await onArticleQueryFinish();
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<ArticlePage[]>([]);
  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  const handleSelectionChange = (selectedRowKeys: React.Key[], selectedRows: ArticlePage[]) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };
  const handleArticleBatchRemove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("请先选择要删除的项目");
      return;
    }
    try {
      setIsBatchRemoveLoading(true);
      await batchRemoveArticle(selectedRows.map((row) => row.id));
      await onArticleQueryFinish();
      resetSelectedRows();
    } finally {
      setIsBatchRemoveLoading(false);
    }
  };
  const handleArticleBatchRemoveCancel = async () => {
    resetSelectedRows();
    message.info("操作已取消");
  };

  // 单个更新模块
  const [isArticleModifyModalVisible, setIsArticleModifyModalVisible] = useState<boolean>(false);
  const [isArticleModifyLoading, setIsArticleModifyLoading] = useState<boolean>(false);
  const [articleModifyForm] = Form.useForm();
  const onArticleModify = (articlePage: ArticlePage) => {
    setIsArticleModifyModalVisible(true);
    setSelectedRowKeys([articlePage.id])
    setSelectedRows([articlePage])
    articleModifyForm.setFieldsValue({ ...articlePage });
  };

  const handleArticleModifyCancel = () => {
    resetSelectedRows();
    articleModifyForm.resetFields();
    setIsArticleModifyModalVisible(false);
  };
  const handleArticleModifyFinish = async () => {
    const articleModifyData = (await articleModifyForm.validateFields()) as ArticleModify;
    const articleModify = {...articleModifyData, id: selectedRows[0].id};
    setIsArticleModifyLoading(true);
    try {
      await modifyArticle(articleModify);
      articleModifyForm.resetFields();
      message.success("更新成功");
      await onArticleQueryFinish();
      resetSelectedRows();
    } finally {
      setIsArticleModifyLoading(false);
      setIsArticleModifyModalVisible(false);
    }
  };

  // 批量更新模块
  const onArticleBatchModify = () => {
    if (selectedRowKeys.length === 1) {
      const selectedRow = selectedRows[0]
      articleBatchModifyForm.setFieldsValue({ ...selectedRow });
      setIsArticleBatchModifyModalVisible(true);
    } else {
      articleBatchModifyForm.resetFields();
      setIsArticleBatchModifyModalVisible(true);
    }
  };
  const [isArticleBatchModifyModalVisible, setIsArticleBatchModifyModalVisible] = useState<boolean>(false);
  const [isArticleBatchModifyLoading, setIsArticleBatchModifyLoading] = useState<boolean>(false);
  const [articleBatchModifyForm] = Form.useForm();
  const handleArticleBatchModifyCancel = async () => {
    articleBatchModifyForm.resetFields();
    setIsArticleBatchModifyModalVisible(false);
    resetSelectedRows();
    message.info("操作已取消");
  };
  const handleArticleBatchModifyFinish = async () => {
    const articleBatchModify = (await articleBatchModifyForm.validateFields()) as ArticleBatchModify;
    setIsArticleBatchModifyLoading(true);
    if (selectedRows === null || selectedRows.length === 0) {
      message.warning("请选择要更新的项目")
      return;
    }
    try {
      articleBatchModify.ids = selectedRows.map((row) => row.id);
      await batchModifyArticle(articleBatchModify);
      articleBatchModifyForm.resetFields();
      message.success("更新成功");
      await onArticleQueryFinish();
      resetSelectedRows();
    } finally {
      setIsArticleBatchModifyLoading(false);
      setIsArticleBatchModifyModalVisible(false);
    }
  };

  // 导入模块
  const [isArticleImportModalVisible, setIsArticleImportModalVisible] = useState<boolean>(false);
  const [isArticleImportLoading, setIsArticleImportLoading] = useState<boolean>(false);
  const [articleCreateList, setArticleCreateList] = useState<ArticleCreate[]>([]);

  const onArticleImport = () => {
    setIsArticleImportModalVisible(true);
  };
  const handleArticleImportCancel = () => {
    setIsArticleImportModalVisible(false);
  };
  const onArticleImportFinish = async (fileList: RcFile[]) => {
    try {
      setIsArticleImportLoading(true);
      const articleCreateList = await importArticle(fileList[0]);
      setArticleCreateList(articleCreateList);
      return articleCreateList;
    } finally {
      setIsArticleImportLoading(false);
    }
  };

  const handleArticleImport = async () => {
    setIsArticleImportLoading(true);
    try {
      await batchCreateArticle(articleCreateList);
      message.success("导入成功");
      setIsArticleImportModalVisible(false);
      await onArticleQueryFinish();
    } finally {
      setIsArticleImportLoading(false);
      setArticleCreateList([]);
    }
  };

  // 导出模块
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const onArticleExport = async () => {
    if (selectedRowKeys === null || selectedRowKeys.length === 0) {
      message.warning("请先选择导出的项目");
      return;
    }
    try {
      setIsExportLoading(true);
      await exportArticlePage(selectedRows.map((row) => row.id));
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 bg-white">
      <TransitionWrapper show={isArticleQueryShow}>
        <div className="shadow-sm">
          <ArticleQueryComponent
            onArticleQueryFinish={onArticleQueryFinish}
            onArticleQueryReset={handleArticleQueryReset}
            articleQueryForm={ articleQueryForm}
          />
        </div>
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onArticleCreate}
          onImport={onArticleImport}
          onExport={onArticleExport}
          onBatchModify={onArticleBatchModify}
          onConfirmBatchRemove={handleArticleBatchRemove}
          onConfirmBatchRemoveCancel={handleArticleBatchRemoveCancel}
          isQueryShow={isArticleQueryShow}
          onQueryShow={onArticleQueryShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={isExportLoading}
          rawColumns={ articlePageColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<ArticlePage>
          columns={ filteredArticleColumns}
          dataSource={ articlePageDataSource}
          total={ articlePageTotalCount}
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
          <ArticleCreateComponent
            isArticleCreateModalVisible={isArticleCreateModalVisible}
            onArticleCreateCancel={handleArticleCreateCancel}
            onArticleCreateFinish={handleArticleCreateFinish}
            isArticleCreateLoading={isArticleCreateLoading}
            articleCreateForm={ articleCreateForm}
            treeSelectDataSource={ articlePageDataSource }
          />
        </div>
        <div>
          <ArticleDetailComponent
            isArticleDetailDrawerVisible={isArticleDetailDrawerVisible}
            onArticleDetailClose={onArticleDetailClose}
            articleDetail={ articleDetail}
          />
        </div>
        <div>
          <ArticleModifyComponent
            isArticleModifyModalVisible={isArticleModifyModalVisible}
            onArticleModifyCancel={handleArticleModifyCancel}
            onArticleModifyFinish={handleArticleModifyFinish}
            isArticleModifyLoading={isArticleModifyLoading}
            articleModifyForm={ articleModifyForm}
            treeSelectDataSource={ articlePageDataSource }
          />
        </div>
        <div>
          <ArticleBatchModifyComponent
            isArticleBatchModifyModalVisible={isArticleBatchModifyModalVisible}
            onArticleBatchModifyCancel={handleArticleBatchModifyCancel}
            onArticleBatchModifyFinish={handleArticleBatchModifyFinish}
            isArticleBatchModifyLoading={isArticleBatchModifyLoading}
            articleBatchModifyForm={ articleBatchModifyForm}
            treeSelectDataSource={ articlePageDataSource }
          />
        </div>
        <div>
          <ArticleImportComponent
            isArticleImportModalVisible={isArticleImportModalVisible}
            isArticleImportLoading={isArticleImportLoading}
            onArticleImportFinish={onArticleImportFinish}
            onArticleImportCancel={handleArticleImportCancel}
            handleArticleImport={handleArticleImport}
          />
        </div>
      </div>
    </div>
  );
};

export default Article;
