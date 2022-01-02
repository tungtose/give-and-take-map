import { useMutation } from 'react-query';
import api from '../helpers/api';


export const createPost = async (input: any) => {
  const response = await api.post('posts', input);
  return response.data;
}
