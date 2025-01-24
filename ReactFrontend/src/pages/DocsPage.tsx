import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Reorder } from "framer-motion";
import "react-quill/dist/quill.snow.css"; // import styles
import { Editor } from "@tinymce/tinymce-react";
import DocList from "../components/docs/DocList";
import ContentViewer from "../components/docs/ContentViewer";
import ContentEditor from "../components/docs/ContentEditor";
import axios from "axios";
import { useParams } from "react-router-dom";

interface SubTitle {
  subId: number;
  name: string;
  contentData: string;
  showEdit: boolean;
  editPosition: { top: number; left: number };
  showInput: boolean;
  showDelete: boolean;
  text: string;
}

interface DocData {
  docsId: number;
  title: string;
  contentData: string;
  showEditModal: boolean;
  editPosition: { top: number; left: number };
  showInput: boolean;
  showDeleteModal: boolean;
  text: string;
  subTitle: SubTitle[];
}

type EditAtIndexType = {
  index: number;
  subIndex: number | null;
};

const DocsPage = () => {
  // ข้อมูลของ Docdata
  let { docsId, subDocsId } = useParams();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const subwrapperRef = useRef<HTMLDivElement | null>(null);
  const [docDatas, setDocDatas] = useState<DocData[]>([
    {
      id: 1,
      title: "AI Garden System",
      contentData: `
<p><span style="color: #353d81;"><strong><span style="font-size: 36pt;">Welcome to AI Garden System</span></strong></span></p>
<p><span style="font-size: 18pt;">ในแต่ละส่วนของหน้านี้จะเป็นคำอธิบายเกี่ยวกับdocument ที่จะช่วยให้ข้อมูลส่วนต่างๆของเว็บไซต์<br>สามารถกดเลือกแต่ละหัวข้อทางsidebar menu เพื่อดูข้อมูลแต่ละหัวข้อ<br><br></span></p>
      `,
      showEditModal: false,
      editPosition: { top: 0, left: 0 }, // แก้ไขจาก array เป็น object
      showInput: false,
      showDeleteModal: false,
      text: "",
      subTitle: [
        {
          subId: 1,
          name: "Get Started",
          contentData: "get start content here",
          showEdit: false,
          editPosition: { top: 0, left: 0 },
          showInput: false,
          showDelete: false,
          text: ``,
        },
      ],
    },
  ]);

  const handleTitleSave = (index: number) => {
    const updatedTitles = [...docDatas];
    updatedTitles[index].title = updatedTitles[index].text;
    // save title input to docdata
    setDocDatas(updatedTitles);
    // clear txt input
    updatedTitles[index].text = "";
    // set input show to false

    updatedTitles[index].showInput = false;
    setDocDatas(updatedTitles);
  };



  const handleClickOutside = (event: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      docDatas.forEach((data, index) => {
        if (data.showInput) {
          handleTitleSave(index);
        }
      });
    }
    if (
      subwrapperRef.current &&
      !subwrapperRef.current.contains(event.target as Node)
    ) {
      docDatas.forEach((data, index) => {
        data.subTitle.forEach((sub, subIndex) => {
          if (sub.showInput) {
            handleSubTitleSave(index, subIndex);
          }
        });
      });
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [docDatas]);

  const handleSubTitleSave = (index: number, subIndex: number) => {
    // Create copies of the state arrays
    const updatedTitles = [...docDatas];

    // Check if the necessary data exists
    if (updatedTitles[index] && updatedTitles[index].subTitle) {
      updatedTitles[index].subTitle[subIndex].name =
        updatedTitles[index].subTitle[subIndex].text;
      setDocDatas(updatedTitles);
      updatedTitles[index].subTitle[subIndex].text = "";
      updatedTitles[index].subTitle[subIndex].showInput = false;
      setDocDatas(updatedTitles);
    }
  };

  // editor here
  const [value, setValue] = useState(docDatas[0].contentData);
  const [text, setText] = useState("");
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showSaveEditorModal, setShowSaveEditorModal] = useState(false);
  // const [currentHeadingId, setCurrentHeadingId] = useState(docDatas[0].id);
  const [showWarningEdit, setShowWarningEdit] = useState(false);
  const [editAtIndex, setEditAtIndex] = useState<EditAtIndexType[]>([
    { index: 0, subIndex: null },
  ]);
  const [currentPageData, setCurrentPageData] = useState(
    docDatas[0].contentData
  );
  const handleEditorChange = (newValue: string, editor: any) => {
    setValue(newValue);
    setText(editor.getContent());
  };

  // แก้ไขตัว content ด้วย editorใน เว็บ

  const SaveEditContent = (index: number, subIndex: number | null) => {
    if (subIndex !== null) {
      setCurrentPageData(text);
      const updatedDocDatas = [...docDatas];
      updatedDocDatas[index].subTitle[subIndex].contentData = text;
      setDocDatas(updatedDocDatas);
    } else {
      setCurrentPageData(text);
      const updatedDocDatas = [...docDatas];
      updatedDocDatas[index].contentData = text;
      setDocDatas(updatedDocDatas);
    }
    setShowTextEditor(false);
    setShowSaveEditorModal(false);
  };

  const AbandonEditing = () => {
    setShowWarningEdit(false);
    setShowTextEditor(false);
  };
  const hideWarningModal = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) {
      setShowWarningEdit(false);
    }
  };

  // const [showTextEditor, setShowTextEditor] = useState(false);
  // const [currentPageData, setCurrentPageData] = useState("<p>Initial content</p>");
  const [editorValue, setEditorValue] = useState(currentPageData);

  const handleEdit = () => {
    setEditorValue(currentPageData);
    setShowTextEditor(true);
  };

  const handleSave = () => {
    setCurrentPageData(editorValue);
    setShowTextEditor(false);
  };

  const handleDiscard = () => {
    setShowTextEditor(false);
  };

  const [docs, setDocs] = useState<DocData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      let docsResponse, contentDetailResponse;
      docsResponse = await axios.get(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/docs`,
        {
          withCredentials: true,
        }
      );
      if (subDocsId) {
        contentDetailResponse = await axios.get(
          `${
            import.meta.env.VITE_NEST_BACKEND_API_URL
          }/docs/content-subdocs/${subDocsId}`,
          { withCredentials: true }
        );
      } else if (docsId) {
        contentDetailResponse = await axios.get(
          `${
            import.meta.env.VITE_NEST_BACKEND_API_URL
          }/docs/content-docs/${docsId}`,
          { withCredentials: true }
        );
      }
      // Add frontend-specific fields to docs data
      const enrichedDocs = docsResponse.data.map((doc: any) => ({
        ...doc,
        showEdit: false,
        editPosition: { top: 0, left: 0 },
        showInput: false,
        showDelete: false,
      }));
      setDocs(enrichedDocs);
      if (contentDetailResponse) {
        setCurrentPageData(contentDetailResponse.data.content);
      }
    } catch (error) {
      console.error("Error fetching data!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [docsId, subDocsId]);

  if (loading) {
    return <div>Loading...</div>;
  }
  // const handleDeleteDoc = async (docsId: string) => {
  //   try {
  //     // เรียก API ลบ SubDocument
  //     const response = await axios.delete(
  //       `${
  //         import.meta.env.VITE_NEST_BACKEND_API_URL
  //       }/docs/delete-docs/${docsId}`,
  //       { withCredentials: true } // ส่ง Cookies หากจำเป็น
  //     );

  //     if (response.status === 200) {
  //       console.log("SubDocument deleted successfully:", response.data);
  //       // เพิ่ม logic เช่นอัปเดต UI หลังจากลบสำเร็จ
  //       fetchData();
  //       // alert('SubDocument deleted successfully');
  //     }
  //   } catch (error) {
  //     console.error("Error deleting SubDocument:", error);
  //     alert("Failed to delete Document. Please try again.");
  //   }
  // };

  // const handleDeleteSubDoc = async (subDocsId: string) => {
  //   try {
  //     // เรียก API ลบ SubDocument
  //     const response = await axios.delete(
  //       `${
  //         import.meta.env.VITE_NEST_BACKEND_API_URL
  //       }/docs/delete-subdocs/${subDocsId}`,
  //       { withCredentials: true } // ส่ง Cookies หากจำเป็น
  //     );

  //     if (response.status === 200) {
  //       console.log("SubDocument deleted successfully:", response.data);
  //       // เพิ่ม logic เช่นอัปเดต UI หลังจากลบสำเร็จ
  //       fetchData();
  //       // alert('SubDocument deleted successfully');
  //     }
  //   } catch (error) {
  //     console.error("Error deleting SubDocument:", error);
  //     alert("Failed to delete SubDocument. Please try again.");
  //   }
  // };

  // const handleTitleAdd = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_NEST_BACKEND_API_URL}/docs/add-title`,
  //       {
  //         title: "New Heading",
  //         content: "",
  //       },
  //       { withCredentials: true }
  //     );

  //     console.log("Document added successfully:", response.data);
  //     fetchData();
  //     // Add any additional logic here if necessary (e.g., updating UI)
  //   } catch (error) {
  //     console.error("Error creating document:", error.message || error);
  //     // Optional: Add user notification logic (e.g., toast)
  //   }
  // };

  // const handleSubTitleAdd = async (docsId: number) => {
  //   try {
  //     const response = await axios.post(
  //       `${
  //         import.meta.env.VITE_NEST_BACKEND_API_URL
  //       }/docs/add-subtitle/${docsId}`,
  //       {
  //         title: "New Sub Heading",
  //         content: "",
  //       },
  //       { withCredentials: true }
  //     );

  //     console.log("SubDocument added successfully:", response.data);
  //     fetchData();
  //   } catch (error) {
  //     console.error("Error creating sub document:", error.message || error);
  //   }
  // };


  // const onchangeDocTitle = (docsId, newTitle:string) => {
  //   const updatedDocs = docs.map((doc) => {
  //     if (doc.docsId === docsId) {
  //       return { ...doc, title: newTitle };
  //     }
  //     return doc;
  //   });
  //   setDocs(updatedDocs);    
  // };

  //  const patchDocsTitle  = (docsId, newTitle) => {
  //   axios.patch(`/api/docs/${docsId}`, { title: newTitle })
  //     .then(response => {
  //       console.log('Document renamed:', response.data);
  //     })
  //     .catch(error => {
  //       console.error('Error renaming document:', error);
  //     });
  // };

  
  const onchangeSubDocTitle = (subDocsId, newSubTitle:string) => {
    const updatedDocs = docs.map((doc) => {
      if (doc.subDocsId === subDocsId) {
        return { ...doc, title: newSubTitle };
      }
      return doc;
    });
    setDocs(updatedDocs);    
  };

   const patchSubDocsTitle  = (subDocsId, newSubTitle) => {
    axios.patch(`/api/docs/${docsId}`, { title: newTitle })
      .then(response => {
        console.log('Document renamed:', response.data);
      })
      .catch(error => {
        console.error('Error renaming document:', error);
      });
  };

  return (
    <div className="flex h-full min-h-screen bg-neutral-100">
      {/* Doc SideBar Left */}
      <DocList
        // docs={docs}
        // onDeleteDoc={handleDeleteDoc}
        // onDeleteSubDoc={handleDeleteSubDoc}
        // addTitle={handleTitleAdd}
        // addSubTitle={handleSubTitleAdd}
        // onchangeDocTitle={onchangeDocTitle}
        // patchDocsTitle={patchDocsTitle}
      />

      {/* content container */}
      <div className="w-[80%] ml-auto px-2 flex flex-col items-center pb-32  h-full min-h-screen bg-white ">
        <div className="w-full justify-self-center relative">
    
          {showTextEditor ? (
            <ContentEditor
              value={editorValue}
              onSave={handleSave}
              onDiscard={handleDiscard}
              onEditorChange={setEditorValue}
              setText={setEditorValue}
            />
          ) : (
            <>
            <div dangerouslySetInnerHTML={{ __html: currentPageData }} />
            <ContentViewer
              currentPageData={currentPageData}
              onEdit={handleEdit}
              />
              </>
          )}
        </div>

        {showTextEditor === true && showWarningEdit === true ? (
          <>
            <div
              className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
              onClick={(e) => hideWarningModal(e)}
            >
              <div className="relative w-5/12 my-6 mx-auto">
                {/*card */}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className=" flex items-center justify-between p-5 border-b border-solid border-blueGray-200 rounded-t ">
                    <h1
                      className=" text-3xl font-semibold text-center p-5 ml-5 mb-2 tracking-tight 
                  text-indigo-900 "
                    >
                      <span className="mt-5 absolute inset-x-0 top-0 text-center">
                        Discard Change?
                      </span>
                    </h1>
                  </div>
                  {/*body*/}
                  {/*footer*/}
                  <div className=" mx-auto flex items-center justify-end p-6">
                    <Button
                      variant="outlined"
                      size="large"
                      // color='error'
                      onClick={(e) => hideWarningModal(e)}
                    >
                      Continue editing
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      color="error"
                      onClick={() => AbandonEditing()}
                    >
                      Discard
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}

        {showSaveEditorModal === true ? (
          <>
            <div
              className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
              onClick={(e) => hideSaveEditorModal(e)}
            >
              <div className="relative w-5/12 my-6 mx-auto">
                {/*card */}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className=" flex items-center justify-between p-5 border-b border-solid border-blueGray-200 rounded-t ">
                    <h1
                      className=" text-3xl font-semibold text-center p-5 ml-5 mb-2 tracking-tight 
                  text-indigo-900 "
                    >
                      <span className="mt-5 absolute inset-x-0 top-0 text-center">
                        Do you want to save it?
                      </span>
                    </h1>
                  </div>
                  {/*body*/}
                  {/*footer*/}
                  <div className=" mx-auto flex items-center justify-end p-6">
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={(e) => hideSaveEditorModal(e)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: "#4f46e5",
                        "&:hover": {
                          backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                        },
                      }}
                      onClick={() =>
                        SaveEditContent(
                          editAtIndex[0].index,
                          editAtIndex[0].subIndex
                        )
                      }
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default DocsPage;
