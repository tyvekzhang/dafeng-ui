export interface NewWordCreate {
    
    /** 文章ID */
    article_id: string;
    
    /** 词库表ID */
    word_id: string;
    
    /** 单词 */
    word: string;
    
    /** 翻译 */
    translation: string;
    
    /** 复习次数 */
    review_count: string;
    
    /** 复习时间 */
    next_review_date: string;
    
}

export interface NewWordModify {
    
    /** 主键 */
    id: string;
    
    /** 文章ID */
    article_id: string;
    
    /** 词库表ID */
    word_id: string;
    
    /** 单词 */
    word: string;
    
    /** 翻译 */
    translation: string;
    
    /** 复习次数 */
    review_count: string;
    
    /** 复习时间 */
    next_review_date: string;
    
}

export interface NewWordBatchModify {

    /** 主键列表 */
    ids: string[]
    
    /** 文章ID */
    article_id: string;
    
    /** 词库表ID */
    word_id: string;
    
    /** 单词 */
    word: string;
    
    /** 翻译 */
    translation: string;
    
    /** 复习次数 */
    review_count: string;
    
    /** 复习时间 */
    next_review_date: string;
    
}

export interface NewWordQuery {
    
    /** 主键 */
    id: string;
    
    /** 文章ID */
    article_id: string;
    
    /** 词库表ID */
    word_id: string;
    
    /** 单词 */
    word: string;
    
    /** 翻译 */
    translation: string;
    
    /** 复习次数 */
    review_count: string;
    
    /** 复习时间 */
    next_review_date: string;
    
    /** 创建时间 */
    create_time: string;
    
}

export interface NewWordDetail {
    
    /** 主键 */
    id: string;
    
    /** 文章ID */
    article_id: string;
    
    /** 词库表ID */
    word_id: string;
    
    /** 单词 */
    word: string;
    
    /** 翻译 */
    translation: string;
    
    /** 复习次数 */
    review_count: string;
    
    /** 复习时间 */
    next_review_date: string;
    
    /** 创建时间 */
    create_time: string;
    
}

export interface NewWordPage {
    
    /** 主键 */
    id: string;
    
    /** 文章ID */
    article_id: string;
    
    /** 词库表ID */
    word_id: string;
    
    /** 单词 */
    word: string;
    
    /** 翻译 */
    translation: string;
    
    /** 复习次数 */
    review_count: string;
    
    /** 复习时间 */
    next_review_date: string;
    
    /** 创建时间 */
    create_time: string;
    
}