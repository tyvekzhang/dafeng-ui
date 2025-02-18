export interface MemberPage {
    
    /** 主键 */
    id: string;
    
    /** 名称 */
    name: string;
    
    /** 国家 */
    nation: string;
    
    /** 性别 */
    gender: number;
    
    /** 生日 */
    birthday: string;
    
    /** 爱好 */
    hobby: string;
    
}

export interface MemberCreate {
    
    /** 名称 */
    name: string;
    
    /** 国家 */
    nation: string;
    
    /** 性别 */
    gender: number;
    
    /** 生日 */
    birthday: string;
    
    /** 爱好 */
    hobby: string;
    
}

export interface MemberQuery {
    
    /** 主键 */
    id: string;
    
    /** 名称 */
    name: string;
    
    /** 国家 */
    nation: string;
    
    /** 性别 */
    gender: number;
    
    /** 生日 */
    birthday: string;
    
    /** 爱好 */
    hobby: string;
    
}

export interface MemberModify {
    
    /** 主键 */
    id: string;
    
    /** 名称 */
    name: string;
    
    /** 国家 */
    nation: string;
    
    /** 性别 */
    gender: number;
    
    /** 生日 */
    birthday: string;
    
    /** 爱好 */
    hobby: string;
    
}

export interface MemberBatchModify {
    /** 主键列表 */
    ids: string[];
    
    /** 名称 */
    name: string;
    
    /** 国家 */
    nation: string;
    
    /** 性别 */
    gender: number;
    
    /** 生日 */
    birthday: string;
    
    /** 爱好 */
    hobby: string;
    
}

export interface MemberDetail {
    
    /** 主键 */
    id: string;
    
    /** 名称 */
    name: string;
    
    /** 国家 */
    nation: string;
    
    /** 性别 */
    gender: number;
    
    /** 生日 */
    birthday: string;
    
    /** 爱好 */
    hobby: string;
    
}