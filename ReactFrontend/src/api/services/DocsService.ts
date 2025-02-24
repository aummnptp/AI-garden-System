import axios from "axios";
import DOCS_ROUTES from "../routes/DocsRoutes";

axios.defaults.withCredentials = true;

export const addTitleService = async () => {
  try {
    const response = await axios.post(
      `${DOCS_ROUTES.addTitle}`,
      { title: "new title", content: "new content here" },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addSubtitleService = async (docsId: string) => {
  try {
    const response = await axios.post(
      `${DOCS_ROUTES.addSubtitle}${docsId}`,
      { title: "new sub title", content: "new sub content here" },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateDocsTitleService = async (docsId: string, newTitle: string) => {
  try {
    const response = await axios.patch(
      `${DOCS_ROUTES.updateDocument}${docsId}`,
      { title: newTitle }
    );
    return response.data; 
  } catch (error) {
    throw error; 
  }
};

export const updateSubDocsTitleService = async (subDocsId: string, newTitle: string) => {
  try {

    const response = await axios.patch(
      `${DOCS_ROUTES.updateSubDocument}${subDocsId}`,
      { title: newTitle },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTitleService = async (docsId: string) => {
  try {
    const response = await axios.delete(
      `${DOCS_ROUTES.deleteDocument}${docsId}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSubTitleService = async (subDocsId: string) => {
  try {
    const response = await axios.delete(
      `${DOCS_ROUTES.deleteSubDocument}${subDocsId}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changeDocsVisiblityService = async (docsId: string, hiddenChangeState: boolean) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_NEST_BACKEND_API_URL}/docs/update-docs/${docsId}`,
      { hidden: hiddenChangeState }, 
    );
    return response.data; 
  } catch (error) {
    throw error;
  }
};

export const changeSubDocsVisiblityService = async (subDocsId: string, hiddenChangeState: boolean) => {
  try {
    const response = await axios.patch(
      `${DOCS_ROUTES.updateSubDocument}${subDocsId}`,
      { hidden: hiddenChangeState },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveDocsOrderService = async (docsToSave: { docsId: string; order: number }[]) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_NEST_BACKEND_API_URL}/docs/save-docs-order`,
      { documents: docsToSave },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ฟังก์ชันสำหรับบันทึกลำดับของเอกสารย่อย
export const saveSubDocsOrderService = async (subDocsToSave: { docsId: string; subDocsId: string; order: number }[]) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_NEST_BACKEND_API_URL}/docs/save-subdocs-order`,
      { subDocuments: subDocsToSave },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateContentDocumentService = async (docsId: string, content: string) => {
  try {
    const response = await axios.patch(`${DOCS_ROUTES.updateDocument}${docsId}`, { content });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateContentSubDocumentService = async (subDocsId: string, content: string) => {
  try {
    const response = await axios.patch(`${DOCS_ROUTES.updateSubDocument}${subDocsId}`, { content });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const BASE_URL = import.meta.env.VITE_NEST_BACKEND_API_URL;


export const fetchDocsHeading = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/docs`);
  return data;
};

export const fetchContentData = async (docsId?: string, subDocsId?: string) => {
  const url = subDocsId
    ? `/docs/content-subdocs/${subDocsId}`
    : `/docs/content-docs/${docsId}`;
  const { data } = await axios.get(`${BASE_URL}${url}`);
  return data;
};