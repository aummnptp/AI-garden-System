import axios from "axios";
import DOCS_ROUTES from "../routes/DocsRoutes";

axios.defaults.withCredentials = true;

const updateDocsTitle = async (docsId: string, newTitle: string) => {
  try {
    const response = await axios.patch(
      `${DOCS_ROUTES.updateDocument}${docsId}`,
      { title: newTitle }
    );
    return response.data; // ส่งข้อมูลกลับไปยัง caller
  } catch (error) {
    console.error("Error renaming document:", error);
    throw error; // ส่ง error กลับไปยัง caller
  }
};

const addSubtitle = async (docsId: string, subtitle: string) => {
  try {
    const response = await axios.post(
      `${DOCS_ROUTES.addSubtitle}${docsId}`,
      { title:subtitle },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding subtitle:", error);
    throw error;
  }
};

const updateSubDocsTitle = async (subDocsId: string, newTitle: string) => {
  try {
    const response = await axios.patch(
      `${DOCS_ROUTES.updateSubDocument}${subDocsId}`,
      { title: newTitle },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error renaming sub-document:", error);
    throw error;
  }
};

export { updateDocsTitle,updateSubDocsTitle,addSubtitle};