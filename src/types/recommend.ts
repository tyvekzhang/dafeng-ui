export interface RecommendCreate {
  /** 推荐文章ID */
  articleId: number;

  /** 状态 */
  status: number;
}

export interface RecommendModify {
  /** 主键 */
  id: number;

  /** 推荐文章ID */
  articleId: number;

  /** 状态 */
  status: number;
}

export interface RecommendBatchModify {
  /** 主键列表 */
  ids: number[];

  /** 主键 */
  id: number;

  /** 推荐文章ID */
  articleId: number;

  /** 状态 */
  status: number;
}

export interface RecommendQuery {
  /** 主键 */
  id: number;

  /** 推荐文章ID */
  articleId: number;

  /** 状态 */
  status: number;

  /** 创建时间 */
  createTime: string;
}

export interface RecommendDetail {
  /** 主键 */
  id: number;

  /** 推荐文章ID */
  articleId: number;

  /** 状态 */
  status: number;

  /** 创建时间 */
  createTime: string;
}

export interface RecommendPage {
  /** 主键 */
  id: number;

  /** 推荐文章ID */
  articleId: number;

  /** 状态 */
  status: number;

  /** 创建时间 */
  createTime: string;
}
