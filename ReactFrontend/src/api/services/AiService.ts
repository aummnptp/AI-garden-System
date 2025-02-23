import axios from "axios";
const BASE_URL = import.meta.env.VITE_NEST_BACKEND_API_URL;

axios.defaults.withCredentials = true;

export const uploadFileService = async (serviceUri: string, file: File) => {
  if (!serviceUri) {
    throw new Error("Service URI is required");
  }
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await axios.post(serviceUri, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const data = response.data;
    // ฟังก์ชันสำหรับ extract keys จาก JSON (ระดับ 1 และ 2)
    const extractKeys = (obj: any, parentKey = "", depth = 1, maxDepth = 2): string[] => {
      const keys: string[] = [];
      if (depth > maxDepth) return keys;

      Object.keys(obj).forEach((key) => {
        const fullPath = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          keys.push(fullPath);
          keys.push(...extractKeys(obj[key], fullPath, depth + 1, maxDepth));
        } else if (Array.isArray(obj[key]) && obj[key].length > 0 && typeof obj[key][0] === "object") {
          keys.push(fullPath);
          keys.push(...extractKeys(obj[key][0], fullPath, depth + 1, maxDepth));
        } else {
          keys.push(fullPath);
        }
      });
      return keys;
    };

    const keys = extractKeys(data);
    return { data, keys };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const updateAiModelService = async (
    aiId: string,
    modelData: any,
    file?: File
  ) => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("modelData", JSON.stringify(modelData));
  
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/${aiId}/update-ai`,
        formData,
        {
          headers: {
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating AI model:", error);
      throw error;
    }
  };
 
  export const fetchAiModelsService = async (filters: Record<string, string | null> = {}) => {

    const cleanFilters: Record<string, string> = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== null) // กรองค่า null
        .map(([key, value]) => [key, value as string]) // แปลงให้เป็น string
    );
  
    const queryString = new URLSearchParams(cleanFilters).toString();
    const { data } = await axios.get(`${BASE_URL}/ai-models/?${queryString}`);
    return data;
  };
  
  export const fetchAiLimitSettingService = async () => {
    const { data } = await axios.get(`${BASE_URL}/ai-usage-limit-setting`);
    return data;
  };
    
  export const fetchAllAiTag = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/tags/tag-in-system`);
    return data;
  };

  export const fetchApprovedAiService = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ai-models/my_approved`);
      return response.data ?? []; // ป้องกัน undefined
    } catch (error) {
      console.error("Error fetching approved AI models:", error);
      return [];
    }
  };

  export const fetchUserApprovedAiService = async (userId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/ai-models/approved/${userId}`);
      return response.data ?? []; // ป้องกัน undefined
    } catch (error) {
      console.error("Error fetching approved AI models:", error);
      return [];
    }
  };

  export const fetchAllModelsWithApprovalStatus = async (userId: string) => {
    const { data } = await axios.get(`${BASE_URL}/ai-models/${userId}/models`);
    return data;
  };
  