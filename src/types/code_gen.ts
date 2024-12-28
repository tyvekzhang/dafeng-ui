export interface CodePreviewResponse {
  entity: string;
  mapper: string;
  service: string;
  serviceImpl: string;
  controller: string;
  create: string;
  modify: string;
  query: string;
  detail: string;
  page: string;
  converter: string;
  index: string;
  indexCreate: string;
  api: string;
  type: string;
}

export interface GenTableQueryResponse {
  id: number;
  connectionName: string;
  databaseName: string;
  tableId: number;
  tableName: string;
  entity: string;
  tableComment?: string;
  createTime: number;
}

export interface TableDataResponse {
  records: GenTableQueryResponse[];
  total_count: number;
}
