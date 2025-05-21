import httpClient from '@/utils/http-client';
import { BaseQueryImpl, PageQuery, PageResult } from '@/types';
import {
  ArticleQuery,
  ArticleCreate,
  ArticleModify,
  ArticleDetail,
  ArticlePage,
  ArticleBatchModify,
} from '@/types/article';
import { AxiosResponse } from 'axios';
import { downloadBlob } from '@/service/util';

/**
 * 分页查询Article
 *
 * @param pageQuery 分页参数
 * @param articleQuery 查询条件
 * @returns 含Article详情列表的分页结果
 */
export function fetchArticleByPage(pageQuery?: PageQuery, articleQuery?: Partial<ArticleQuery>) {
  let pageQueryParams: PageQuery;
  if (pageQuery === null || pageQuery === undefined) {
    pageQueryParams = BaseQueryImpl.create(1, 200);
  } else {
    pageQueryParams = pageQuery
  }
  const params = {
    ...pageQueryParams,
    ...articleQuery
  };
  return httpClient.get<PageResult<ArticlePage>>('/article/page', params);
}


/**
 * 获取Article详情
 *
 * @param id Article的ID
 * @returns Article详细信息
 */
export function fetchArticleDetail(id: string) {
  return httpClient.get<ArticleDetail>(`/article/detail/${id}`);
}

/**
 * 导出Article数据导入模板
 *
 */
export async function exportArticleTemplate() {
  const response = await httpClient.get<AxiosResponse>(
    `/article/export-template`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, '会员管理导入模板.xlsx');
}

/**
 * 导出Article数据
 *
 * @param ids 要导出的Article的ID列表
 */
export async function exportArticlePage(ids: string[]) {
  const params = {
    ids: ids,
  };
  const response = await httpClient.get<AxiosResponse>(`/article/export`, params, {
    responseType: 'blob',
  });
  downloadBlob(response, '会员管理导出.xlsx');
}

/**
 * 创建Article
 *
 * @param articleCreate 创建数据
 * @returns 创建的Article的ID
 */
export function createArticle(articleCreate: ArticleCreate) {
  return httpClient.post<number>('/article/create', articleCreate);
}

/**
 * 导入Article数据并进行校验
 *
 * @param file 上传的Excel文件
 * @returns 校验结果列表
 */
export function importArticle(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return httpClient.post<ArticleCreate[]>('/article/import', formData);
}

/**
 * 批量创建Article
 *
 * @param articleCreateList 创建数据列表
 * @returns 创建的Article的ID列表
 */
export function batchCreateArticle(articleCreateList: ArticleCreate[]) {
  if (!articleCreateList?.length) {
    return Promise.resolve([]);
  }
  return httpClient.post<number[]>('/article/batch-create', articleCreateList);
}

/**
 * 移除Article
 *
 * @param id 要移除的Article的Id
 */
export function removeArticle(id: string) {
  return httpClient.delete<void>(`/article/remove/${id}`);
}

/**
 * 批量移除Article
 *
 * @param ids 要移除的Article的ID数组
 */
export function batchRemoveArticle(ids: string[]) {
  return httpClient.delete<void>('/article/batch-remove', { ids: ids });
}

/**
 * 更新Article信息
 *
 * @param articleModify 包含ID数组和修改的数据
 */
export function modifyArticle(articleModify: ArticleModify) {
  return httpClient.put<void>('/article/modify', articleModify);
}

/**
 * 批量更新Article信息
 *
 * @param articleBatchModify 包含ID数组和修改的数据
 */
export function batchModifyArticle(articleBatchModify: ArticleBatchModify) {
  return httpClient.put<void>('/article/batch-modify', articleBatchModify);
}
