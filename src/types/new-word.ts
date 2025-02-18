export interface NewWordPage {
    
    /** 主键 */
    id: string;
    
    /** 姓名 */
    word: string;
    
    /** 国家 */
    translation: string;
    
    /** 爱好 */
    next_review_date: string;
    
    /** 性别 */
    tenant: number;
    
    /** 出生年月 */
    update_time: string;
    
}

export interface NewWordCreate {
    
    /** 姓名 */
    word: string;
    
    /** 国家 */
    translation: string;
    
    /** 爱好 */
    next_review_date: string;
    
    /** 性别 */
    tenant: number;
    
    /** 出生年月 */
    update_time: string;
    
}

export interface NewWordQuery {
    
    /** 主键 */
    id: string;
    
    /** 姓名 */
    word: string;
    
    /** 国家 */
    translation: string;
    
    /** 爱好 */
    next_review_date: string;
    
    /** 性别 */
    tenant: number;
    
    /** 出生年月 */
    update_time: string;
    
}

export interface NewWordModify {
    
    /** 主键 */
    id: string;
    
    /** 姓名 */
    word: string;
    
    /** 国家 */
    translation: string;
    
    /** 爱好 */
    next_review_date: string;
    
    /** 性别 */
    tenant: number;
    
    /** 出生年月 */
    update_time: string;
    
}

export interface NewWordBatchModify {
    /** 主键列表 */
    ids: string[];
    
    /** 姓名 */
    word: string;
    
    /** 国家 */
    translation: string;
    
    /** 爱好 */
    next_review_date: string;
    
    /** 性别 */
    tenant: number;
    
    /** 出生年月 */
    update_time: string;
    
}

export interface NewWordDetail {
    
    /** 主键 */
    id: string;
    
    /** 姓名 */
    word: string;
    
    /** 国家 */
    translation: string;
    
    /** 爱好 */
    next_review_date: string;
    
    /** 性别 */
    tenant: number;
    
    /** 出生年月 */
    update_time: string;
    
}