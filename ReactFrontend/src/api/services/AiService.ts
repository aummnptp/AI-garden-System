import axios from "axios";

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
    console.log("Response from API:", data);
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
            // ไม่ต้องตั้ง Content-Type เพราะ axios จะตั้งให้โดยอัตโนมัติเมื่อใช้ FormData
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating AI model:", error);
      throw error;
    }
  };

