export interface NewWordCreate {
  /** 文章ID */
  articleId: number;

  /** 词库表ID */
  wordId: number;

  /** 单词 */
  word: string;

  /** 复习次数 */
  reviewCount: number;

  /** 复习时间 */
  nextReviewDate: string;
}

export interface NewWordModify {
  /** 主键 */
  id: number;

  /** 文章ID */
  articleId: number;

  /** 词库表ID */
  wordId: number;

  /** 单词 */
  word: string;

  /** 复习次数 */
  reviewCount: number;

  /** 复习时间 */
  nextReviewDate: string;
}

export interface NewWordBatchModify {
  /** 主键列表 */
  ids: number[];

  /** 主键 */
  id: number;

  /** 文章ID */
  articleId: number;

  /** 词库表ID */
  wordId: number;

  /** 单词 */
  word: string;

  /** 复习次数 */
  reviewCount: number;

  /** 复习时间 */
  nextReviewDate: string;
}

export interface NewWordQuery {
  /** 主键 */
  id: number;

  /** 文章ID */
  articleId: number;

  /** 词库表ID */
  wordId: number;

  /** 单词 */
  word: string;

  /** 复习次数 */
  reviewCount: number;

  /** 复习时间 */
  nextReviewDate: string;

  /** 创建时间 */
  createTime: string;
}

export interface NewWordDetail {
  /** 主键 */
  id: number;

  /** 文章ID */
  articleId: number;

  /** 词库表ID */
  wordId: number;

  /** 单词 */
  word: string;

  /** 复习次数 */
  reviewCount: number;

  /** 复习时间 */
  nextReviewDate: string;

  /** 创建时间 */
  createTime: string;
}

export interface NewWordPage {
  /** 主键 */
  id: number;

  /** 文章ID */
  articleId: number;

  /** 词库表ID */
  wordId: number;

  /** 单词 */
  word: string;

  /** 复习次数 */
  reviewCount: number;

  /** 复习时间 */
  nextReviewDate: string;

  /** 创建时间 */
  createTime: string;
}
