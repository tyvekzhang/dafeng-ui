import ActionButtonComponent from "@/components/base/action-button";
import { PaginatedTable } from "@/components/base/paginated-table";
import { message } from "@/components/GlobalToast";
import dayjs from 'dayjs';
import {
  batchCreateMember,
  batchModifyMember,
  batchRemoveMember,
  createMember,
  exportMemberPage,
  fetchMemberByPage,
  fetchMemberDetail,
  importMember,
  modifyMember,
  removeMember,
} from "@/service/member";
import { BaseQueryImpl } from "@/types";
import { MemberBatchModify, MemberCreate, MemberDetail, MemberModify, MemberPage, MemberQuery } from "@/types/member";
import MemberBatchModifyComponent from "@/views/system/member/components/member-batch-modify";
import MemberCreateComponent from "@/views/system/member/components/member-create";
import MemberImportComponent from "@/views/system/member/components/member-import";
import MemberModifyComponent from "@/views/system/member/components/member-modify";
import MemberQueryComponent from "@/views/system/member/components/member-query";
import { Form } from "antd";
import { ColumnsType } from "antd/lib/table";
import type { RcFile } from "rc-upload/lib/interface";
import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import MemberDetailComponent from "@/views/system/member/components/member-detail";
import TransitionWrapper from '@/components/base/transition-wrapper';

const Member: React.FC = () => {
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
  const [isMemberQueryShow, setIsMemberQueryShow] = useState<boolean>(true)
  const [memberPageDataSource, setMemberPageDataSource] = useState<MemberPage[]>([]);
  const [memberPageTotalCount, setMemberPageTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const onMemberQueryShow = () => {
    setIsMemberQueryShow(prevState => !prevState)
  }
  useEffect(() => {
    const fetchData = async () => {
      const memberQuery = (await memberQueryForm.validateFields()) as MemberQuery;
      const pageData = BaseQueryImpl.create(current, pageSize);
      const resp = await fetchMemberByPage(pageData, memberQuery);
      setMemberPageDataSource(resp.records);
      setMemberPageTotalCount(resp.total);
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
  const [isMemberDetailDrawerVisible, setIsMemberDetailDrawerVisible] = useState<boolean>(false);
  const [memberDetail, setMemberDetail] = useState<MemberDetail | null>(null);
  const onMemberDetail = async (memberPage: MemberPage) => {
    setIsMemberDetailDrawerVisible(true);
    const id = memberPage.id;
    await fetchMemberDetail(id).then(setMemberDetail);
  };

  const onMemberDetailClose = async () => {
    setMemberDetail(null);
    setIsMemberDetailDrawerVisible(false);
  };

  // 表格列信息
  const memberPageColumns: ColumnsType<MemberPage> = [
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
      render: (_: number, _record: MemberPage, rowIndex: number) => rowIndex + 1,
      width: "8%",
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "国家",
      dataIndex: "nation",
      key: "nation",
      render: (text) => (text ? text : "-"),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      width: "6%",
    },
    {
      title: "生日",
      dataIndex: "birthday",
      key: "birthday",
      render: (text: string) => (
        text ? <span>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</span>: "-"
      ),
      width: "14%",
      ellipsis: true,
    },
    {
      title: "爱好",
      dataIndex: "hobby",
      key: "hobby",
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
            onClick={ () => onMemberDetail(record)}
          >
            <EyeOutlined className="w-3 h-3" />
            详情
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-operation"
            onClick={ () => onMemberModify(record)}
          >
            <EditOutlined className="w-3 h-3" />
            编辑
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 text-xs btn-remove"
            onClick={ () => handleMemberDelete(record)}
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

  const [visibleColumns, setVisibleColumns] = useState(memberPageColumns.map(col => col.key));
  const onToggleColumnVisibility = (columnKey: number) => {
    setVisibleColumns(prevVisibleColumns => {
      if (prevVisibleColumns.includes(columnKey)) {
        return prevVisibleColumns.filter(key => key !== columnKey);
      } else {
        return [...prevVisibleColumns, columnKey];
      }
    });
  };
  const filteredMemberColumns = memberPageColumns.filter(col => visibleColumns.includes(col.key));

  const [memberQueryForm] = Form.useForm();
  const handleMemberQueryReset = () => {
    resetPagination();
    memberQueryForm.resetFields();
  };
  const onMemberQueryFinish = async () => {
    const memberQueryFormData = memberQueryForm.getFieldsValue();
    const { create_time } = memberQueryFormData
    if (create_time) {
      const [startDate, endDate] = create_time
      memberQueryFormData.create_time = [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
    }
    const memberQuery = memberQueryFormData as MemberQuery;
    const filteredMemberQuery = Object.fromEntries(
      Object.entries(memberQuery).filter(([, value]) => value !== undefined && value !== null && value !== ""),
    );
    resetPagination();
    await handleMemberQueryFinish(filteredMemberQuery as MemberQuery);
  };
  const handleMemberQueryFinish = async (memberQuery: MemberQuery) => {
    await fetchMemberByPage(BaseQueryImpl.create(current, pageSize), memberQuery).then((resp) => {
      setMemberPageDataSource(resp.records);
      setMemberPageTotalCount(resp.total);
    });
  };

  // 新增模块
  const [isMemberCreateModalVisible, setIsMemberCreateModalVisible] = useState(false);
  const [isMemberCreateLoading, setIsMemberCreateLoading] = useState(false);
  const [memberCreateForm] = Form.useForm();
  const onMemberCreate = () => {
    setIsMemberCreateModalVisible(true);
  };
  const handleMemberCreateCancel = () => {
    memberCreateForm.resetFields();
    setIsMemberCreateModalVisible(false);
  };
  const handleMemberCreateFinish = async (memberCreate: MemberCreate) => {
    setIsMemberCreateLoading(true);
    try {
      await createMember(memberCreate);
      message.success("新增成功");
      memberCreateForm.resetFields();
      await onMemberQueryFinish();
    } finally {
      setIsMemberCreateLoading(false);
      setIsMemberCreateModalVisible(false);
    }
  };

  // 单个删除模块
  const handleMemberDelete = async (memberPage: MemberPage) => {
    await removeMember(memberPage.id);
    await onMemberQueryFinish();
  };

  // 批量删除模块
  const [isBatchRemoveLoading, setIsBatchRemoveLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<MemberPage[]>([]);
  const resetSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  const handleSelectionChange = (selectedRowKeys: React.Key[], selectedRows: MemberPage[]) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  };
  const handleMemberBatchRemove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("请先选择要删除的项目");
      return;
    }
    try {
      setIsBatchRemoveLoading(true);
      await batchRemoveMember(selectedRows.map((row) => row.id));
      await onMemberQueryFinish();
      resetSelectedRows();
    } finally {
      setIsBatchRemoveLoading(false);
    }
  };
  const handleMemberBatchRemoveCancel = async () => {
    resetSelectedRows();
    message.info("操作已取消");
  };

  // 单个更新模块
  const [isMemberModifyModalVisible, setIsMemberModifyModalVisible] = useState<boolean>(false);
  const [isMemberModifyLoading, setIsMemberModifyLoading] = useState<boolean>(false);
  const [memberModifyForm] = Form.useForm();
  const onMemberModify = (memberPage: MemberPage) => {
    setIsMemberModifyModalVisible(true);
    setSelectedRowKeys([memberPage.id])
    setSelectedRows([memberPage])
    memberModifyForm.setFieldsValue({ ...memberPage });
  };

  const handleMemberModifyCancel = () => {
    resetSelectedRows();
    memberModifyForm.resetFields();
    setIsMemberModifyModalVisible(false);
  };
  const handleMemberModifyFinish = async () => {
    const memberModifyData = (await memberModifyForm.validateFields()) as MemberModify;
    const memberModify = {...memberModifyData, id: selectedRows[0].id};
    setIsMemberModifyLoading(true);
    try {
      await modifyMember(memberModify);
      memberModifyForm.resetFields();
      message.success("更新成功");
      await onMemberQueryFinish();
      resetSelectedRows();
    } finally {
      setIsMemberModifyLoading(false);
      setIsMemberModifyModalVisible(false);
    }
  };

  // 批量更新模块
  const onMemberBatchModify = () => {
    if (selectedRowKeys.length === 1) {
      setIsMemberModifyModalVisible(true);
      memberModifyForm.setFieldsValue({ ...selectedRows[0] });
    } else {
      setIsMemberBatchModifyModalVisible(true);
      memberBatchModifyForm.resetFields();
    }
  };
  const [isMemberBatchModifyModalVisible, setIsMemberBatchModifyModalVisible] = useState<boolean>(false);
  const [isMemberBatchModifyLoading, setIsMemberBatchModifyLoading] = useState<boolean>(false);
  const [memberBatchModifyForm] = Form.useForm();
  const handleMemberBatchModifyCancel = async () => {
    memberBatchModifyForm.resetFields();
    setIsMemberBatchModifyModalVisible(false);
    resetSelectedRows();
    message.info("操作已取消");
  };
  const handleMemberBatchModifyFinish = async () => {
    const memberBatchModify = (await memberBatchModifyForm.validateFields()) as MemberBatchModify;
    setIsMemberBatchModifyLoading(true);
    if (selectedRows === null || selectedRows.length === 0) {
      message.warning("请选择要更新的项目")
      return;
    }
    try {
      memberBatchModify.ids = selectedRows.map((row) => row.id);
      await batchModifyMember(memberBatchModify);
      memberBatchModifyForm.resetFields();
      message.success("更新成功");
      await onMemberQueryFinish();
      resetSelectedRows();
    } finally {
      setIsMemberBatchModifyLoading(false);
      setIsMemberBatchModifyModalVisible(false);
    }
  };

  // 导入模块
  const [isMemberImportModalVisible, setIsMemberImportModalVisible] = useState<boolean>(false);
  const [isMemberImportLoading, setIsMemberImportLoading] = useState<boolean>(false);
  const [memberCreateList, setMemberCreateList] = useState<MemberCreate[]>([]);

  const onMemberImport = () => {
    setIsMemberImportModalVisible(true);
  };
  const handleMemberImportCancel = () => {
    setIsMemberImportModalVisible(false);
  };
  const onMemberImportFinish = async (fileList: RcFile[]) => {
    try {
      setIsMemberImportLoading(true);
      const memberCreateList = await importMember(fileList[0]);
      setMemberCreateList(memberCreateList);
      return memberCreateList;
    } finally {
      setIsMemberImportLoading(false);
    }
  };

  const handleMemberImport = async () => {
    setIsMemberImportLoading(true);
    try {
      await batchCreateMember(memberCreateList);
      message.success("导入成功");
      setIsMemberImportModalVisible(false);
      await onMemberQueryFinish();
    } finally {
      setIsMemberImportLoading(false);
      setMemberCreateList([]);
    }
  };

  // 导出模块
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const onMemberExport = async () => {
    if (selectedRowKeys === null || selectedRowKeys.length === 0) {
      message.warning("请先选择导出的项目");
      return;
    }
    try {
      setIsExportLoading(true);
      await exportMemberPage(selectedRows.map((row) => row.id));
      resetSelectedRows();
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 bg-white">
      <TransitionWrapper show={isMemberQueryShow}>
        <div className="shadow-sm">
          <MemberQueryComponent
            onMemberQueryFinish={onMemberQueryFinish}
            onMemberQueryReset={handleMemberQueryReset}
            memberQueryForm={ memberQueryForm}
          />
        </div>
      </TransitionWrapper>
      <div>
        <ActionButtonComponent
          onCreate={onMemberCreate}
          onImport={onMemberImport}
          onExport={onMemberExport}
          onBatchModify={onMemberBatchModify}
          onConfirmBatchRemove={handleMemberBatchRemove}
          onConfirmBatchRemoveCancel={handleMemberBatchRemoveCancel}
          isQueryShow={isMemberQueryShow}
          onQueryShow={onMemberQueryShow}
          isExportDisabled={selectedRowKeys.length === 0}
          isBatchModifyDisabled={selectedRowKeys.length === 0}
          isBatchRemoveDisabled={selectedRowKeys.length === 0}
          isBatchRemoveLoading={isBatchRemoveLoading}
          isExportLoading={isExportLoading}
          rawColumns={ memberPageColumns as any[]}
          visibleColumns={visibleColumns as any[]}
          onToggleColumnVisibility={onToggleColumnVisibility}
          actionConfig={actionConfig}
          className="mb-2 mt-4"
        />
      </div>
      <div>
        <PaginatedTable<MemberPage>
          columns={ filteredMemberColumns}
          dataSource={ memberPageDataSource}
          total={ memberPageTotalCount}
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
          <MemberCreateComponent
            isMemberCreateModalVisible={isMemberCreateModalVisible}
            onMemberCreateCancel={handleMemberCreateCancel}
            onMemberCreateFinish={handleMemberCreateFinish}
            isMemberCreateLoading={isMemberCreateLoading}
            memberCreateForm={ memberCreateForm}
          />
        </div>
        <div>
          <MemberDetailComponent
            isMemberDetailDrawerVisible={isMemberDetailDrawerVisible}
            onMemberDetailClose={onMemberDetailClose}
            memberDetail={ memberDetail}
          />
        </div>
        <div>
          <MemberModifyComponent
            isMemberModifyModalVisible={isMemberModifyModalVisible}
            onMemberModifyCancel={handleMemberModifyCancel}
            onMemberModifyFinish={handleMemberModifyFinish}
            isMemberModifyLoading={isMemberModifyLoading}
            memberModifyForm={ memberModifyForm}
          />
        </div>
        <div>
          <MemberBatchModifyComponent
            isMemberBatchModifyModalVisible={isMemberBatchModifyModalVisible}
            onMemberBatchModifyCancel={handleMemberBatchModifyCancel}
            onMemberBatchModifyFinish={handleMemberBatchModifyFinish}
            isMemberBatchModifyLoading={isMemberBatchModifyLoading}
            memberBatchModifyForm={ memberBatchModifyForm}
          />
        </div>
        <div>
          <MemberImportComponent
            isMemberImportModalVisible={isMemberImportModalVisible}
            isMemberImportLoading={isMemberImportLoading}
            onMemberImportFinish={onMemberImportFinish}
            onMemberImportCancel={handleMemberImportCancel}
            handleMemberImport={handleMemberImport}
          />
        </div>
      </div>
    </div>
  );
};

export default Member;
