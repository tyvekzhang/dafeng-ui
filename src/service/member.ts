import httpClient from '@/utils/http-client';
import { BaseQueryImpl, PageQuery, PageResult } from '@/types';
import {
  MemberQuery,
  MemberCreate,
  MemberModify,
  MemberDetail,
  MemberPage,
  MemberBatchModify,
} from '@/types/member';
import { AxiosResponse } from 'axios';
import { downloadBlob } from '@/service/util';

/**
 * 分页查询Member
 * 
 * @param pageQuery 分页参数
 * @param memberQuery 查询条件
 * @returns 含Member详情列表的分页结果
 */
export function fetchMemberByPage(pageQuery?: PageQuery, memberQuery?: Partial<MemberQuery>) {
  let pageQueryParams: PageQuery;
  if (pageQuery === null || pageQuery === undefined) {
    pageQueryParams = BaseQueryImpl.create(1, 200);
  } else {
    pageQueryParams = pageQuery
  }
   const params = {
    ...pageQueryParams,
    ...memberQuery
  };
  return httpClient.get<PageResult<MemberPage>>('/member/page', params);
}


/**
 * 获取Member详情
 * 
 * @param id Member的ID
 * @returns Member详细信息
 */
export function fetchMemberDetail(id: string) {
  return httpClient.get<MemberDetail>(`/member/detail/${id}`);
}

/**
 * 导出Member数据导入模板
 * 
 */
export async function exportMemberTemplate() {
  const response = await httpClient.get<AxiosResponse>(
    `/member/export-template`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, '会员管理导入模板.xlsx');
}

/**
 * 导出Member数据
 * 
 * @param ids 要导出的Member的ID列表
 */
export async function exportMemberPage(ids: string[]) {
  const params = {
    ids: ids,
  };
  const response = await httpClient.get<AxiosResponse>(`/member/export`, params, {
    responseType: 'blob',
  });
  downloadBlob(response, '会员管理导出.xlsx');
}

/**
 * 创建Member
 * 
 * @param memberCreate 创建数据
 * @returns 创建的Member的ID
 */
export function createMember(memberCreate: MemberCreate) {
  return httpClient.post<number>('/member/create', memberCreate);
}

/**
 * 导入Member数据并进行校验
 * 
 * @param file 上传的Excel文件
 * @returns 校验结果列表
 */
export function importMember(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return httpClient.post<MemberCreate[]>('/member/import', formData);
}

/**
 * 批量创建Member
 * 
 * @param memberCreateList 创建数据列表
 * @returns 创建的Member的ID列表
 */
export function batchCreateMember(memberCreateList: MemberCreate[]) {
  if (!memberCreateList?.length) {
    return Promise.resolve([]);
  }
  return httpClient.post<number[]>('/member/batch-create', memberCreateList);
}

/**
 * 移除Member
 * 
 * @param id 要移除的Member的Id
 */
export function removeMember(id: string) {
  return httpClient.delete<void>(`/member/remove/${id}`);
}

/**
 * 批量移除Member
 * 
 * @param ids 要移除的Member的ID数组
 */
export function batchRemoveMember(ids: string[]) {
  return httpClient.delete<void>('/member/batch-remove', { ids: ids });
}

/**
 * 更新Member信息
 * 
 * @param memberModify 包含ID数组和修改的数据
 */
export function modifyMember(memberModify: MemberModify) {
  return httpClient.put<void>('/member/modify', memberModify);
}

/**
 * 批量更新Member信息
 * 
 * @param memberBatchModify 包含ID数组和修改的数据
 */
export function batchModifyMember(memberBatchModify: MemberBatchModify) {
  return httpClient.put<void>('/member/batch-modify', memberBatchModify);
}