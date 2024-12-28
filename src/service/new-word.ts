import httpClient from '@/utils/http-client';
import { PageQuery, PageResult } from '@/types';
import {
  NewWordQuery,
  NewWordCreate,
  NewWordModify,
  NewWordDetail,
  NewWordPage,
  NewWordBatchModify,
} from '@/types/new-word';

/**
 * 分页查询NewWord
 * @param page 分页参数
 * @param newWordQuery 查询条件
 * @returns 返回分页结果，包含NewWord详情列表
 */
export function fetchNewWordByPage(page: PageQuery, newWordQuery?: Partial<NewWordQuery>) {
  return httpClient.post<PageResult<NewWordPage>>('/new-word/page', { ...page, ...newWordQuery });
}

/**
 * 创建NewWord
 * @param newWordCreate 创建NewWord的数据
 * @returns 返回创建的NewWord的ID
 */
export function createNewWord(newWordCreate: NewWordCreate) {
  return httpClient.post<number>('/new-word/create', newWordCreate);
}

/**
 * 批量创建NewWord
 * @param newWordCreateList 批量创建NewWord的数据
 * @returns 返回创建NewWord的ID
 */
export function batchCreateNewWord(newWordCreateList: NewWordCreate[]) {
  return httpClient.post<number[]>('/new-word/batch-create', newWordCreateList);
}

/**
 * 获取NewWord详情
 * @param id NewWord的ID
 * @returns 返回NewWord的详细信息
 */
export function fetchNewWordDetail(id: number) {
  return httpClient.get<NewWordDetail>(`/new-word/detail/${id}`);
}

/**
 * 修改NewWord信息
 * @param newWordModify 修改的NewWord数据
 * @returns 无返回值
 */
export function modifyNewWord(newWordModify: NewWordModify) {
  return httpClient.put<void>(`/new-word/modify`, newWordModify);
}

/**
 * 批量修改NewWord信息
 * @param newWordBatchModify 修改的NewWord数据
 * @param ids 批量修改NewWord的ID列表
 * @returns 无返回值
 */
export function batchModifyNewWord(newWordBatchModify: NewWordBatchModify, ids: number[]) {
  return httpClient.put<void>(`/new-word/modify`, { ...ids, ...newWordBatchModify});
}

/**
 * 批量删除NewWord
 * @param ids 要删除的NewWordID数组
 * @returns 无返回值
 */
export function batchRemoveNewWord(ids: number[]) {
  return httpClient.delete<void>('/new-word/batch-remove', { data: ids });
}

/**
 * 导入NewWord
 * @param fileList 要导入的NewWord文件列表
 */
export function importNewWord(fileList: File[]) {
  const formData = new FormData();
  fileList.forEach((file) => {
    formData.append('file', file);
  });
  return httpClient.post<NewWordCreate[]>('/new-word/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
