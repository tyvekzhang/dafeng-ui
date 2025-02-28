import httpClient from '@/utils/http-client';
import { AxiosResponse } from 'axios';
import { downloadBlob } from '@/service/util';

export async function croPdf(file: File, pageRange: string, convertToImage: string, taskName: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('page_range', pageRange);
  formData.append('convert_to_image', convertToImage);
  formData.append('task_name', taskName);
  const response = await httpClient.post<AxiosResponse>(`/tool/crop-pdf`, formData, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data', // 设置请求头
    },
  });
  const fileName = file.name.replace(".pdf", "裁剪后.zip")
  downloadBlob(response, fileName);
}

