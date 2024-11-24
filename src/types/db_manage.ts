export interface DatabaseConnection {
  id: number;
  connection_name: string;
}

export interface Database {
  id: number;
  database_name: string;
}

export interface TableInfo {
  id: number;
  name: string;
  database_id: number;
  remark?: string
}

export interface TableColumn {
  id: number
  key: string;
  name: string;
  type: string;
  default: string;
  length?: number;
  decimals?: number;
  not_null: boolean;
  index_col: boolean;
  remark: string;
}

export interface TableIndex {
  name: string;
  type: string;
  field: string;
  remark?: string;
}

export interface TableAdd {
  tableName: string;
  databaseId: number;
}

