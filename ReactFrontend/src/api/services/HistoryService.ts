import axios from "axios";
import { BACKEND_API_URL } from "../../env";

export const addNoteService = async (projectId: string, historyId: string, title: string, content: string) => {
    try {
      console.log("📤 Sending request to add note:", { projectId, historyId, title, content });
  
      const response = await axios.post(
        `${BACKEND_API_URL}/projects/${projectId}/notes/add-note/${historyId}`,
        { title, content },
        { withCredentials: true } // ✅ Ensure auth is included
      );
  
      console.log("✅ Note added successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error adding note:", error.response?.data || error.message);
      throw error;
    }
  };