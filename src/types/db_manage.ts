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
  comment?: string;
}

export interface TableColumn {
  id?: number;
  key: string;
  name: string;
  type: string | undefined;
  length?: number;
  scale?: number;
  default: string;
  comment: string;
  nullable: boolean;
  primary_key: boolean;
  autoincrement: boolean;
  sort: number;
}

export interface TableIndex {
  key: string;
  name: string;
  type: string;
  field: string;
  comment?: string;
}

export interface TableMetadata {
  table_name: string;
  comment?: string;
}

export interface TableAdd {
  tableName: string;
  databaseId: number;
}
