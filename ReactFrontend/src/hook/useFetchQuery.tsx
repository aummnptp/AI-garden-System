import { useQuery } from "@tanstack/react-query";
import axios from "axios";


import { BACKEND_API_URL } from "../env";
const API_BASE_URL = BACKEND_API_URL;


// const fetchData = async (url: string) => {
//   const { data } = await axios.get(`${API_BASE_URL}${url}`, { withCredentials: true });
//   return data;
// };

export const useFetchQuery = (queryKey: string[], url: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}${url}`, { withCredentials: true });
      return response.data || []; 
    }
  });

  return { data: data ?? [], isLoading, error, refetch }; 
};
