import { useQuery } from "react-query";
import api from '../helpers/api';


type Post = any;

const getOnePost = async (postId: string): Promise<Post> => {

  const response = await api.get<Post>(`posts/${postId}`);

  return response.data
};

export default function useLocs(postId: string) {
  return useQuery<Post | undefined>(["post", postId], () => getOnePost(postId), { staleTime: 15 * 60 * 1000, cacheTime: 100 * 60 * 1000 });
}
