// import axios from "axios";
// // import DOCS_ROUTES from "../routes/DocsRoutes";

// axios.defaults.withCredentials = true;

// const updateDocsTitle = async (docsId: string, newTitle: string) => {
//   try {
//     const response = await axios.patch(
//       `${DOCS_ROUTES.updateDocument}${docsId}`,
//       { title: newTitle }
//     );
//     return response.data; // ส่งข้อมูลกลับไปยัง caller
//   } catch (error) {
//     console.error("Error renaming document:", error);
//     throw error; // ส่ง error กลับไปยัง caller
//   }
// };



// export { updateDocsTitle,};