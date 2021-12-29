import { useQuery } from "react-query";
import api from '../helpers/api';
import { groupByLocType, locType } from '../helpers/utils';

type Post = any;

interface SearchPostQuery {
  searchType: 'phone' | 'address';
  searchInput: string | null;
}

const searchPost = async (query: SearchPostQuery): Promise<Post> => {

  const response = await api.get<Post>(`posts/search`, { params: query });

  if (response.data.statusCode === 404) throw new Error("xxxxxxxx")

  const locByType = groupByLocType([response.data]);
  return locByType;
};

export default function useSearchPost(query: SearchPostQuery) {
  return useQuery<Post | undefined>(["searchPost", query], () => searchPost(query), {
    enabled: false,
    cacheTime: 0,
    retry: false
  });
}
