import httpClient from '@/utils/http-client';
import { AxiosResponse } from 'axios';

export async function croPdf(file: File, pageRange: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('page_range', pageRange);
  const response = await httpClient.post<AxiosResponse>(`/tool/crop-pdf`, formData, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data', // 设置请求头
    },
  });
  const fileName = file.name.replace(".pdf", "裁剪后.zip")
  downloadBlob(response, fileName);
}


export function downloadBlob(response: AxiosResponse, default_filename: string): void {
  const data: Blob = response.data;
  const filename = default_filename;
  const url = window.URL.createObjectURL(data);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

