export interface NewWordCreate {
  /** 用户ID */
  userId: number;

  /** 文章ID */
  articleId: number;

  /** 词库表ID */
  wordId: number;

  /** 单词 */
  word: string;

  /** 复习次数 */
  reviewCount: number;

  /** 下次复习时间 */
  nextReviewDate: string;

  /** 租户ID */
  tenantId: number;
}

export interface NewWordModify {
  /** 主键 */
  id: number;
  /** 用户ID */
  userId: number;

  /** 文章ID */
  articleId: number;

  /** 词库表ID */
  wordId: number;

  /** 单词 */
  word: string;

  /** 复习次数 */
  reviewCount: number;

  /** 下次复习时间 */
  nextReviewDate: string;

  /** 租户ID */
  tenantId: number;

  /** 更新时间 */
  updateTime: string;
}

export interface NewWordBatchModify {
  /** 主键列表 */
  ids: number[];
  /** 用户ID */
  userId: number;

  /** 文章ID */
  articleId: number;

  /** 词库表ID */
  wordId: number;

  /** 单词 */
  word: string;

  /** 复习次数 */
  reviewCount: number;

  /** 下次复习时间 */
  nextReviewDate: string;

  /** 租户ID */
  tenantId: number;

  /** 更新时间 */
  updateTime: string;
}

export interface NewWordQuery {
  /** 用户ID */
  userId: number;

  /** 文章ID */
  articleId: number;

  /** 词库表ID */
  wordId: number;

  /** 单词 */
  word: string;

  /** 复习次数 */
  reviewCount: number;

  /** 下次复习时间 */
  nextReviewDate: string;

  /** 租户ID */
  tenantId: number;
}

export interface NewWordDetail {
  /** 用户ID */
  userId: number;

  /** 文章ID */
  articleId: number;

  /** 词库表ID */
  wordId: number;

  /** 单词 */
  word: string;

  /** 复习次数 */
  reviewCount: number;

  /** 下次复习时间 */
  nextReviewDate: string;

  /** 租户ID */
  tenantId: number;
}

export interface NewWordPage {
  /** 主键 */
  id: number;

  /** 用户ID */
  userId: number;

  /** 文章ID */
  articleId: number;

  /** 词库表ID */
  wordId: number;

  /** 单词 */
  word: string;

  /** 复习次数 */
  reviewCount: number;

  /** 下次复习时间 */
  nextReviewDate: string;

  /** 租户ID */
  tenantId: number;
}
