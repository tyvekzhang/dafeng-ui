export interface ArticlePage {
    
    /** 主键 */
    id: string;
    
    /** 标题 */
    title: string;
    
    /** doi地址 */
    doi: string;
    
    /** 期刊名称 */
    publication: string;
    
    /** 问题 */
    query: string;
    
    /** 问题嵌入向量 */
    query_vector: string;
    
    /** 方法 */
    methods: string;
    
    /** 创建时间 */
    create_time: string;
    
}

export interface ArticleCreate {
    
    /** 标题 */
    title: string;
    
    /** doi地址 */
    doi: string;
    
    /** 期刊名称 */
    publication: string;
    
    /** 问题 */
    query: string;
    
    /** 问题嵌入向量 */
    query_vector: string;
    
    /** 方法 */
    methods: string;
    
}

export interface ArticleQuery {
    
    /** 主键 */
    id: string;
    
    /** 标题 */
    title: string;
    
    /** doi地址 */
    doi: string;
    
    /** 期刊名称 */
    publication: string;
    
    /** 问题 */
    query: string;
    
    /** 问题嵌入向量 */
    query_vector: string;
    
    /** 方法 */
    methods: string;
    
    /** 创建时间 */
    create_time: string;
    
}

export interface ArticleModify {
    
    /** 主键 */
    id: string;
    
    /** 标题 */
    title: string;
    
    /** doi地址 */
    doi: string;
    
    /** 期刊名称 */
    publication: string;
    
    /** 问题 */
    query: string;
    
    /** 问题嵌入向量 */
    query_vector: string;
    
    /** 方法 */
    methods: string;
    
}

export interface ArticleBatchModify {
    /** 主键列表 */
    ids: string[];
    
    /** 标题 */
    title: string;
    
    /** doi地址 */
    doi: string;
    
    /** 期刊名称 */
    publication: string;
    
    /** 问题 */
    query: string;
    
    /** 问题嵌入向量 */
    query_vector: string;
    
    /** 方法 */
    methods: string;
    
}

export interface ArticleDetail {
    
    /** 主键 */
    id: string;
    
    /** 标题 */
    title: string;
    
    /** doi地址 */
    doi: string;
    
    /** 期刊名称 */
    publication: string;
    
    /** 问题 */
    query: string;
    
    /** 问题嵌入向量 */
    query_vector: string;
    
    /** 方法 */
    methods: string;
    
    /** 创建时间 */
    create_time: string;
    
}