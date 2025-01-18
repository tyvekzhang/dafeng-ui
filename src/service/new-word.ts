import httpClient from '@/utils/http-client';
import { BaseQueryImpl, PageQuery, PageResult } from '@/types';
import {
  NewWordQuery,
  NewWordCreate,
  NewWordModify,
  NewWordDetail,
  NewWordPage,
  NewWordBatchModify,
} from '@/types/new-word';
import { AxiosResponse } from 'axios';
import { downloadBlob } from '@/service/util';

/**
 * 分页查询NewWord
 * 
 * @param pageQuery 分页参数
 * @param newWordQuery 查询条件
 * @returns 含NewWord详情列表的分页结果
 */
export function fetchNewWordByPage(pageQuery?: PageQuery, newWordQuery?: Partial<NewWordQuery>) {
  let pageQueryParams: PageQuery;
  if (pageQuery === null || pageQuery === undefined) {
    pageQueryParams = BaseQueryImpl.create(1, 200);
  } else {
    pageQueryParams = pageQuery
  }
   const params = {
    ...pageQueryParams,
    ...newWordQuery
  };
  return httpClient.get<PageResult<NewWordPage>>('/new-word/page', params);
}


/**
 * 获取NewWord详情
 * 
 * @param id NewWord的ID
 * @returns NewWord详细信息
 */
export function fetchNewWordDetail(id: string) {
  return httpClient.get<NewWordDetail>(`/new-word/detail/${id}`);
}

/**
 * 导出NewWord数据导入模板
 * 
 */
export async function exportNewWordTemplate() {
  const response = await httpClient.get<AxiosResponse>(
    `/new-word/export-template`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, '阅读生词导入模板.xlsx');
}

/**
 * 导出NewWord数据
 * 
 * @param ids 要导出的NewWord的ID列表
 */
export async function exportNewWordPage(ids: string[]) {
  const params = {
    ids: ids,
  };
  const response = await httpClient.get<AxiosResponse>(`/new-word/export`, params, {
    responseType: 'blob',
  });
  downloadBlob(response, '阅读生词导出.xlsx');
}

/**
 * 创建NewWord
 * 
 * @param newWordCreate 创建数据
 * @returns 创建的NewWord的ID
 */
export function createNewWord(newWordCreate: NewWordCreate) {
  return httpClient.post<number>('/new-word/create', newWordCreate);
}

/**
 * 导入NewWord数据并进行校验
 * 
 * @param file 上传的Excel文件
 * @returns 校验结果列表
 */
export function importNewWord(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return httpClient.post<NewWordCreate[]>('/new-word/import', formData);
}

/**
 * 批量创建NewWord
 * 
 * @param newWordCreateList 创建数据列表
 * @returns 创建的NewWord的ID列表
 */
export function batchCreateNewWord(newWordCreateList: NewWordCreate[]) {
  if (!newWordCreateList?.length) {
    return Promise.resolve([]);
  }
  return httpClient.post<number[]>('/new-word/batch-create', newWordCreateList);
}

/**
 * 移除NewWord
 * 
 * @param id 要移除的NewWord的Id
 */
export function removeNewWord(id: string) {
  return httpClient.delete<void>(`/new-word/remove/${id}`);
}

/**
 * 批量移除NewWord
 * 
 * @param ids 要移除的NewWord的ID数组
 */
export function batchRemoveNewWord(ids: string[]) {
  return httpClient.delete<void>('/new-word/batch-remove', { ids: ids });
}

/**
 * 更新NewWord信息
 * 
 * @param newWordModify 包含ID数组和修改的数据
 */
export function modifyNewWord(newWordModify: NewWordModify) {
  return httpClient.put<void>('/new-word/modify', newWordModify);
}

/**
 * 批量更新NewWord信息
 * 
 * @param newWordBatchModify 包含ID数组和修改的数据
 */
export function batchModifyNewWord(newWordBatchModify: NewWordBatchModify) {
  return httpClient.put<void>('/new-word/batch-modify', newWordBatchModify);
}