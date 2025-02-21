import axios from "axios";
import { BACKEND_API_URL } from "../../env";
const BASE_URL = import.meta.env.VITE_NEST_BACKEND_API_URL;

export const addNoteService = async (projectId: string, historyId: string, title: string, content: string) => {
    try {
  
      const response = await axios.post(
        `${BACKEND_API_URL}/projects/${projectId}/notes/add-note/${historyId}`,
        { title, content },
        { withCredentials: true }
      );
  
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  export const deleteHistoryService = async (
    workspaceId: string,
    projectId: string,
    historyId: string
  ) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/projects/${projectId}/history/${historyId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting history:", error);
      throw error;
    }
  };


  export const fetchProjectHistoryService = async (workspaceId: string, projectId: string) => {
    const { data } = await axios.get(`${BASE_URL}/workspaces/${workspaceId}/projects/all-history/${projectId}`);
    return data;
  };
  
  export const fetchProjectNotesService = async (projectId: string) => {
    const { data } = await axios.get(`${BASE_URL}/projects/${projectId}/notes/all-project-note`);
    return data;
  };


  export const fetchProjectHistoryDetailService = async (workspaceId: string, projectId: string,historyId:string) => {
    const { data } = await axios.get(`${BASE_URL}/workspaces/${workspaceId}/projects/${projectId}/history/${historyId}`);
    return data;
  };


  export const fetchHistoryNoteDataService = async (projectId: string, historyId: string,) => {
    const { data } = await axios.get(`${BASE_URL}/projects/${projectId}/notes/${historyId}/history-detail`);
    return data;
  };