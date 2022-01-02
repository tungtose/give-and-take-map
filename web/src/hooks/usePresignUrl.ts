import api from '../helpers/api';

interface PresignUrl { urls: string[]; }

export const getPresignUrl = async (fileName: string[]): Promise<PresignUrl> => {
  const response = await api.post<PresignUrl>(`posts/presigned-url`, { fileName });
  return response.data;
};

