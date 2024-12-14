import httpClient from '@/services/request';
import { downloadBlob } from '@/services/util';
import { CodePreviewResponse, TableDataResponse } from '@/types/code_gen';
import { AxiosResponse } from 'axios';

export const codePreview = (tableId: number) => {
  if (tableId === null || tableId === undefined) {
    tableId = 13076635717632;
  }
  return httpClient.get<CodePreviewResponse>(`/gen-table/preview/${tableId}`);
};

export const codeList = () => {
  return httpClient.get<TableDataResponse>(`/gen-table/list`);
};

export const importTables = (database_id: number, tableIds: number[]) => {
  const data = {
    database_id: database_id,
    table_ids: tableIds,
  };
  return httpClient.post('/gen-table/import', data);
};

export const downloadCode = async (tableId: number, fileName: 'code.zip') => {
  const response = await httpClient.get<AxiosResponse>(
    `/gen-table/download/${tableId}`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, fileName);
};
