export interface NewWordCreate {
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

    /** 复习时间 */
    nextReviewDate: string;

    /** 租户ID */
    tenantId: number;

    /** 创建时间 */
    createTime: string;

    /** 修改时间 */
    updateTime: string;

}

export interface NewWordModify {
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

    /** 复习时间 */
    nextReviewDate: string;

    /** 租户ID */
    tenantId: number;

    /** 修改时间 */
    updateTime: string;

}

export interface NewWordBatchModify {
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

  /** 复习时间 */
  nextReviewDate: string;

  /** 租户ID */
  tenantId: number;

  /** 修改时间 */
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

    /** 复习时间 */
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

    /** 复习时间 */
    nextReviewDate: string;

    /** 租户ID */
    tenantId: number;

}

export interface NewWordPage {
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

    /** 复习时间 */
    nextReviewDate: string;

    /** 租户ID */
    tenantId: number;

}
