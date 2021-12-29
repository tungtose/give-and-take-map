import { useQuery } from "react-query";
import api from '../helpers/api';
import { groupByLocType, locType } from '../helpers/utils';

export interface Loc {
  type: 'send' | 'receive';
  isFinished: boolean;
  showMap: boolean;
  _id: string;
  loc: LocDetail;
}

export interface LocDetail {
  type: "Point";
  coordinates: Float32Array;
}

export interface LocByType {
  send: Loc;
  receive: Loc;
}

const getAllLocs = async (): Promise<LocByType> => {

  const response = await api.get<Loc[]>('/posts/locs');

  const locByType = groupByLocType(response.data);

  return locByType;
};

export default function useLocs() {
  return useQuery<LocByType | undefined>('allLocs', getAllLocs, { staleTime: 15 * 60 * 1000, cacheTime: 15 * 60 * 1000 });
}
