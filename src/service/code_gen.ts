import { downloadBlob } from '@/service/util';
import { CodePreviewResponse, TableDataResponse } from '@/types/code_gen';
import httpClient from '@/utils/http-client';
import { AxiosResponse } from 'axios';

export const codePreview = (tableId: number) => {
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

export const downloadCode = async (tableId: number, fileName: string = 'code.zip') => {
  const response = await httpClient.get<AxiosResponse>(
    `/gen-table/download/${tableId}`,
    {},
    {
      responseType: 'blob',
    },
  );
  downloadBlob(response, fileName);
};

export const deleteTable = (tableId: number) => {
  return httpClient.delete(`/gen-table/remove/${tableId}`);
};
