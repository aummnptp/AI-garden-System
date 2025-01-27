
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
import SaveContentModal from "../components/docs/modal/SaveContentModal";
import DiscardContentModal from "../components/docs/modal/DiscardConentModal";

interface SubTitle {
  subDocsId: number;
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



const DocsPage = () => {
  // ข้อมูลของ Docdata
  let { docsId, subDocsId } = useParams();
  // const wrapperRef = useRef<HTMLDivElement | null>(null);
  // const subwrapperRef = useRef<HTMLDivElement | null>(null);
  const [saveContentModal, setSaveContentModal] = useState(false);
  const [discardContentModal, setDiscardContentModal] = useState(false);
  const [docDatas, setDocDatas] = useState<DocData[]>([
    {
      docsId: 1,
      title: "AI Garden System",
      contentData: `
<p><span style="color: #353d81;"><strong><span style="font-size: 36pt;">Welcome to AI Garden System</span></strong></span></p>`,
      showEditModal: false,
      editPosition: { top: 0, left: 0 }, // แก้ไขจาก array เป็น object
      showInput: false,
      showDeleteModal: false,
      text: "",
      subTitle: [
        {
          subDocsId: 1,
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

  // const handleTitleSave = (index: number) => {
  //   const updatedTitles = [...docDatas];
  //   updatedTitles[index].title = updatedTitles[index].text;
  //   // save title input to docdata
  //   setDocDatas(updatedTitles);
  //   // clear txt input
  //   updatedTitles[index].text = "";
  //   // set input show to false

  //   updatedTitles[index].showInput = false;
  //   setDocDatas(updatedTitles);
  // };



  // const handleClickOutside = (event: MouseEvent) => {
  //   if (
  //     wrapperRef.current &&
  //     !wrapperRef.current.contains(event.target as Node)
  //   ) {
  //     docDatas.forEach((data, index) => {
  //       if (data.showInput) {
  //         handleTitleSave(index);
  //       }
  //     });
  //   }
  //   if (
  //     subwrapperRef.current &&
  //     !subwrapperRef.current.contains(event.target as Node)
  //   ) {
  //     docDatas.forEach((data, index) => {
  //       data.subTitle.forEach((sub, subIndex) => {
  //         if (sub.showInput) {
  //           handleSubTitleSave(index, subIndex);
  //         }
  //       });
  //     });
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [docDatas]);

  // const handleSubTitleSave = (index: number, subIndex: number) => {
  //   // Create copies of the state arrays
  //   const updatedTitles = [...docDatas];

  //   // Check if the necessary data exists
  //   if (updatedTitles[index] && updatedTitles[index].subTitle) {
  //     updatedTitles[index].subTitle[subIndex].name =
  //       updatedTitles[index].subTitle[subIndex].text;
  //     setDocDatas(updatedTitles);
  //     updatedTitles[index].subTitle[subIndex].text = "";
  //     updatedTitles[index].subTitle[subIndex].showInput = false;
  //     setDocDatas(updatedTitles);
  //   }
  // };

  // editor here
  // const [value, setValue] = useState(docDatas[0].contentData);
  // const [text, setText] = useState("");
  const [showTextEditor, setShowTextEditor] = useState(false);
  // const [showSaveEditorModal, setShowSaveEditorModal] = useState(false);

  const [currentPageData, setCurrentPageData] = useState(
    docDatas[0].contentData
  );


  // แก้ไขตัว content ด้วย editorใน เว็บ

  // const SaveEditContent = (index: number, subIndex: number | null) => {
  //   if (subIndex !== null) {
  //     setCurrentPageData(text);
  //     const updatedDocDatas = [...docDatas];
  //     updatedDocDatas[index].subTitle[subIndex].contentData = text;
  //     setDocDatas(updatedDocDatas);
  //   } else {
  //     setCurrentPageData(text);
  //     const updatedDocDatas = [...docDatas];
  //     updatedDocDatas[index].contentData = text;
  //     setDocDatas(updatedDocDatas);
  //   }
  //   setShowTextEditor(false);
  //   setShowSaveEditorModal(false);
  // };

  
  const [editorValue, setEditorValue] = useState(currentPageData);

  const handleEdit = () => {
    setEditorValue(currentPageData);
    setShowTextEditor(true);
  };

  // const handleSave = () => {

  //   setCurrentPageData(editorValue);
  //   setShowTextEditor(false);
  // };

 const handleSave = async () => {
  // let { docsId, subDocsId } = useParams(); // ใช้ useParams เพื่อดึง docsId และ subDocsId จาก URL

  try {
    const url = subDocsId
      ? `${import.meta.env.VITE_NEST_BACKEND_API_URL}/docs/update-subdocs/${subDocsId}`
      : `${import.meta.env.VITE_NEST_BACKEND_API_URL}/docs/update-docs/${docsId}`;

    const response = await axios.patch(
      url,
      { content: editorValue }, // ส่งค่าคอนเทนต์จาก Editor
      { withCredentials: true } // รองรับ cookies สำหรับ backend ที่ต้องการ
    );

    setCurrentPageData(editorValue); // อัปเดตคอนเทนต์ใน state
    setShowTextEditor(false); // ซ่อน Text Editor

    console.log("Content saved successfully:", response.data);
  } catch (error) {
    console.error("Error saving data:", error);
  } finally {
    setSaveContentModal(false); // ปิด Modal
  }
};
  
  const handleDiscard = () => {
    setShowTextEditor(false);
    setDiscardContentModal(false);
  };

  const onCloseSaveModal = () => {
    // Implement your discard logic here
    setSaveContentModal(false);
  };
  const onOpenSaveModal = () => {
    // Implement your discard logic here
    setSaveContentModal(true);
  };
  const onCloseDiscardModal = () => {
    // Implement your discard logic here
    setDiscardContentModal(false);
  };
  const onOpenDiscardModal = () => {
    // Implement your discard logic here
    setDiscardContentModal(true);
  };

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      let  contentDetailResponse;
 
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
  


  return (
    <div className="flex h-full min-h-screen bg-neutral-100">
      
      {/* Doc SideBar Left */}
      <DocList
      />

      {/* content container */}
      <div 
      className="w-[80%] ml-auto px-2 flex flex-col items-center pb-32  h-full min-h-screen bg-white "
      >
        <div className="w-full justify-self-center relative ">
          {showTextEditor ? (
            <div className="w-full h-full flex flex-col items-center bg-white">

              <DiscardContentModal
              open={discardContentModal}
              onClose={onCloseDiscardModal}
              onDiscard={handleDiscard}
              />
              <SaveContentModal
              open={saveContentModal}
              onClose={onCloseSaveModal}
              onSave={handleSave}
              />
              <ContentEditor
                value={editorValue}
                onSave={onOpenSaveModal}
                onDiscard={onOpenDiscardModal}
                onEditorChange={setEditorValue}
                setText={setEditorValue}
              />
            </div>
          ) : (
            <>
              <ContentViewer
                currentPageData={currentPageData}
                onEdit={handleEdit}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
