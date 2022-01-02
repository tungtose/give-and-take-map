import { useQuery } from "react-query";
import axios from 'axios';
import {
  GEO_API_KEY,
  SEARCH_ADDRESS_ENDPOINT,
  ADDRESS_DETAIL_ENDPOINT
} from '../constants';



export async function getAutoComplete(input: string) {
  const response = await axios.get(
    SEARCH_ADDRESS_ENDPOINT,
    {
      params: {
        input,
        api_key: GEO_API_KEY,
      }
    }
  )
  console.log("GET_ADDRESS", response);
  return response.data;
}

export async function getAddressDetail(addressId?: string | null) {
  const response = await axios.get(
    ADDRESS_DETAIL_ENDPOINT,
    {
      params: {
        place_id: addressId,
        api_key: GEO_API_KEY
      }
    }
  )
  return response.data;
}

export function useAutoCompleteAddress(input: string) {

  return useQuery<any | Error>(
    ['autoCompleteAddress', input],
    () => getAutoComplete(input),
    { enabled: true }
  )
}

export function useGetAddress(addressId?: string | null) {
  return useQuery<any | Error>(
    ['getAddressDetail', addressId],
    () => getAddressDetail(addressId),
    { enabled: !!addressId }
  )
}
