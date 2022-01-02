import { useQuery } from "react-query";
import api from '../helpers/api';
import * as R from 'ramda';

type Items = any;

const getAllItems = async (): Promise<Items> => {
  const response = await api.get<Items>(`posts/items`);
  const groupByType = R.groupBy((element: any) => element.type, response.data);
  return groupByType;
};

export default function useItems() {
  return useQuery<Items | undefined>(["getAllItems"], getAllItems, {
    enabled: true,
    cacheTime: 150 * 60 * 1000,
    retry: false
  });
}
