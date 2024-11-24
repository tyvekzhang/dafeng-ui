import axiosInstance from '@/services/request';
import { PageData } from '@/types/common';
import { Database, DatabaseConnection, TableAdd, TableColumn, TableIndex, TableInfo } from '@/types/db_manage';

export const fetchConnections = async (): Promise<DatabaseConnection[]> => {
  const params = {
    page: 1,
    size: 100,
  };
  return axiosInstance.get<PageData<DatabaseConnection>>('/connection/connections', params).then((res) => {
    return res.records;
  });
};

export const fetchDatabases = async (connectionId: number): Promise<Database[]> => {
  const params = {
    page: 1,
    size: 1000,
    connection_id: connectionId,
  };
  return axiosInstance.get<PageData<Database>>('/database/databases', params).then((res) => {
    return res.records;
  });
};

export const fetchTables = async (databaseId: number): Promise<TableInfo[]> => {
  const params = {
    page: 1,
    size: 1000,
    database_id: databaseId,
  };
  return axiosInstance.get<PageData<TableInfo>>('/table/tables', params).then((res) => {
    return res.records;
  });
};

export const fetchTableStructure = async (tableId: number): Promise<TableColumn[]> => {
  const params = {
    page: 1,
    size: 1000,
    table_id: tableId,
  };

  return axiosInstance.get<PageData<TableColumn>>('/field/fields', params).then((res) => {
    const records = res.records;
    if (records) {
      return records.map((prev) => ({
        ...prev,
        key: prev.id.toString(),
      }));
    }
    return [];
  });
};
export const fetchIndexStructure = async (tableId: number): Promise<TableIndex[]> => {
  const params = {
    page: 1,
    size: 1000,
    table_id: tableId,
  };
  return axiosInstance.get<PageData<TableIndex>>('/index/indexes', params).then((res) => {
    return res.records;
  });
};

export const tableAdd = async (data: TableAdd): Promise<void> => {
  const tableAdd = {
    database_id: data.databaseId,
    name: data.tableName,
  };
  return axiosInstance.post('/table/add', tableAdd);
};

export const fieldGenerate = async (tableInfo: TableInfo, fieldData: TableColumn[], indexData: TableIndex[]) => {
  const tableGenerate = {
    database_id: tableInfo.database_id,
    table_name: tableInfo.name,
    comment: tableInfo.remark,
    field_metadata: fieldData,
    index_metadata: indexData,
  };
  console.log(tableGenerate);
  return axiosInstance.post('/table/generate', tableGenerate);
};

export const addField = async (
  connectionId: string,
  databaseId: string,
  tableId: string,
  field: TableColumn,
): Promise<void> => {
  // Simulated API call
  return new Promise((resolve) => setTimeout(resolve, 100));
};
