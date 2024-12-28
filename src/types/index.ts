export interface UserInfo {
  userId: string | number;
  username: string;
  realName: string;
  avatar: string;
  token: string;
  desc?: string;
  homePath?: string;
}

export interface ModelBase {
  id: number;
  create_time: Date;
  update_time?: Date;
}

export interface PageBase {
  page: number;
  size: number;
  count?: boolean;
}

/**
 * 排序项接口
 */
export interface OrderItem {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * 分页接口
 */
export interface PageQuery {
  current: number;
  pageSize: number;
  orders: OrderItem[];
}

/**
 * 基础查询接口
 */
export interface BaseQuery {
  current: number;
  pageSize: number;
  sorter?: string;

  buildPage(): PageQuery;
}

/**
 * 基础查询实现类
 */
export class BaseQueryImpl implements BaseQuery {
  // 排序常量
  private static readonly SORT_ASC = 'ascend';
  private static readonly SORT_DESC = 'descend';

  // 默认分页参数
  private static readonly DEFAULT_CURRENT = 1;
  private static readonly DEFAULT_PAGE_SIZE = 10;
  private static readonly MAX_PAGE_SIZE = 200;

  // 私有只读属性
  private readonly _current: number;
  private readonly _pageSize: number;
  private readonly _sorter?: string;

  /**
   * 构造函数
   * @param current 当前页码
   * @param pageSize 每页大小
   * @param sorter 排序参数
   */
  constructor(
    current: number = BaseQueryImpl.DEFAULT_CURRENT,
    pageSize: number = BaseQueryImpl.DEFAULT_PAGE_SIZE,
    sorter?: string,
  ) {
    this._current = Math.max(1, current);
    this._pageSize = Math.max(1, Math.min(pageSize, BaseQueryImpl.MAX_PAGE_SIZE));
    this._sorter = sorter;
  }

  // Getter 方法
  get current(): number {
    return this._current;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  get sorter(): string | undefined {
    return this._sorter;
  }

  /**
   * 静态工厂方法
   */
  static create(current?: number, pageSize?: number, sorter?: string): BaseQueryImpl {
    return new BaseQueryImpl(current, pageSize, sorter);
  }

  /**
   * 克隆方法
   * @param updates 修改参数
   */
  clone(
    updates?: Partial<{
      current: number;
      pageSize: number;
      sorter: string;
    }>,
  ): BaseQueryImpl {
    return new BaseQueryImpl(
      updates?.current ?? this._current,
      updates?.pageSize ?? this._pageSize,
      updates?.sorter ?? this._sorter,
    );
  }

  /**
   * 解析排序参数
   * @returns 排序配置数组
   */
  private parseSorter(): OrderItem[] {
    if (!this._sorter || this._sorter.trim() === '') {
      return [];
    }

    try {
      const sorterJson = JSON.parse(this._sorter);
      return Object.entries(sorterJson)
        .filter(([_, order]) => order === BaseQueryImpl.SORT_ASC || order === BaseQueryImpl.SORT_DESC)
        .map(([key, order]) => ({
          field: this.toUnderlineCase(key),
          order: order === BaseQueryImpl.SORT_ASC ? 'asc' : 'desc',
        }));
    } catch (error) {
      console.warn('Invalid sorter format', error);
      return [];
    }
  }

  /**
   * 构建分页对象
   * @returns 分页对象
   */
  public buildPage(): PageQuery {
    return {
      current: this._current,
      pageSize: this._pageSize,
      orders: this.parseSorter(),
    };
  }

  /**
   * 驼峰转下划线
   * @param key 驼峰命名的字符串
   *
   * @returns 下划线命名的字符串
   */
  private toUnderlineCase(key: string): string {
    return key
      .split(/(?=[A-Z])/)
      .join('_')
      .toLowerCase();
  }

  /**
   * 验证排序参数
   * @param sorterJson 排序参数对象
   * @returns 是否有效
   */
  private validateSorterJson(sorterJson: Record<string, string>): boolean {
    return Object.values(sorterJson).every(
      (order) => order === BaseQueryImpl.SORT_ASC || order === BaseQueryImpl.SORT_DESC,
    );
  }
}

// 使用示例
function exampleUsage() {
  // 创建基本查询对象
  const query1 = BaseQueryImpl.create(
    1,
    20,
    JSON.stringify({
      userName: 'ascend',
      createTime: 'descend',
    }),
  );

  // 构建分页对象
  const page1 = query1.buildPage();
  console.log(page1);

  // 克隆并修改查询对象
  const query2 = query1.clone({
    current: 2,
    pageSize: 15,
  });

  const page2 = query2.buildPage();
  console.log(page2);
}

export interface PageResult<T> {
  /**
   * 总记录数
   */
  total: number;

  /**
   * 当前页的数据列表
   */
  records: T[];
}
