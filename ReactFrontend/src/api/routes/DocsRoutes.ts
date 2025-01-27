import { BACKEND_API_URL } from "../../env";

const DOCS_ROUTES = {
  updateDocument: `${BACKEND_API_URL}/docs/update-docs/`,
  updateSubDocument: `${BACKEND_API_URL}/docs/update-subdocs/`,
  addSubtitle: `${BACKEND_API_URL}/docs/add-subtitle/`,
  deleteDocument:`${BACKEND_API_URL}/docs/delete-docs/`,
  deleteSubDocument:`${BACKEND_API_URL}/docs/delete-subdocs/`,
  reOrderDocument:`${BACKEND_API_URL}/docs/save-docs-order`,
  reOrderSubDocument:`${BACKEND_API_URL}/docs/save-subdocs-order`,

};

export default DOCS_ROUTES;