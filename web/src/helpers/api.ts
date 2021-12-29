import axios from 'axios';
import { API_URL } from '../constants';


const apiInstance = axios.create({
  baseURL: API_URL,
  timeout: 150000,
  // headers: { 'X-Custom-Header': 'foobar' }
});

export default apiInstance;

