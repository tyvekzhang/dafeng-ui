import { BaseQueryImpl, PageQuery, PageResult } from '@/types';
import {
  NewWordBatchModify,
  NewWordCreate,
  NewWordDetail,
  NewWordModify,
  NewWordPage,
  NewWordQuery,
} from '@/types/new-word';
import httpClient from '@/utils/http-client';

/**
 * 分页查询NewWord
 *
 * @param pageQuery 分页参数
 * @param recommendQuery 查询条件
 * @returns 含NewWord详情列表的分页结果
 */
export function fetchNewWordByPage(pageQuery?: PageQuery, recommendQuery?: Partial<NewWordQuery>) {
  let pageQueryParams: PageQuery;
  if (pageQuery === null || pageQuery === undefined) {
    pageQueryParams = BaseQueryImpl.create(1, 200);
  } else {
    pageQueryParams = pageQuery;
  }
  const params = {
    ...pageQueryParams,
    ...recommendQuery,
  };
  return httpClient.get<PageResult<NewWordPage>>('/new-word/page', params);
}

/**
 * 获取NewWord详情
 *
 * @param id NewWord的ID
 * @returns NewWord详细信息
 */
export function fetchNewWordDetail(id: number) {
  return httpClient.get<NewWordDetail>(`/new-word/detail/${id}`);
}

/**
 * 导出NewWord数据导入模板
 *
 */
export function exportNewWordTemplate() {
  return httpClient.get<void>('/new-word/export-template');
}

/**
 * 导出NewWord数据
 *
 * @param ids 要导出的NewWord的ID列表
 */
export function exportNewWordPage(ids: number[]) {
  return httpClient.get<void>('/new-word/export', { params: { ids } });
}

/**
 * 创建NewWord
 *
 * @param recommendCreate 创建数据
 * @returns 创建的NewWord的ID
 */
export function createNewWord(recommendCreate: NewWordCreate) {
  return httpClient.post<number>('/new-word/create', recommendCreate);
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
 * @param recommendCreateList 创建数据列表
 * @returns 创建的NewWord的ID列表
 */
export function batchCreateNewWord(recommendCreateList: NewWordCreate[]) {
  return httpClient.post<number[]>('/new-word/batch-create', recommendCreateList);
}

/**
 * 移除NewWord
 *
 * @param id 要移除的NewWord的Id
 */
export function removeNewWord(id: number) {
  return httpClient.delete<void>(`/new-word/remove/${id}`);
}

/**
 * 批量移除NewWord
 *
 * @param ids 要移除的NewWord的ID数组
 */
export function batchRemoveNewWord(ids: number[]) {
  return httpClient.delete<void>('/new-word/batch-remove', { data: ids });
}

/**
 * 更新NewWord信息
 *
 * @param recommendModify 包含ID数组和修改的数据
 */
export function modifyNewWord(recommendModify: NewWordModify) {
  return httpClient.put<void>('/new-word/modify', recommendModify);
}

/**
 * 批量更新NewWord信息
 *
 * @param recommendBatchModify 包含ID数组和修改的数据
 */
export function batchModifyNewWord(recommendBatchModify: NewWordBatchModify) {
  return httpClient.put<void>('/new-word/batch-modify', recommendBatchModify);
}
