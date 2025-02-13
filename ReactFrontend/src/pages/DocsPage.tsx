

import { useEffect,  useState } from "react";

import "react-quill/dist/quill.snow.css"; // import styles

import DocList from "../components/docs/DocList";
import ContentViewer from "../components/docs/ContentViewer";
import ContentEditor from "../components/docs/ContentEditor";
import axios from "axios";
import { useParams } from "react-router-dom";
import SaveContentModal from "../components/docs/modal/SaveContentModal";
import DiscardContentModal from "../components/docs/modal/DiscardConentModal";






const DocsPage = () => {

  let { docsId, subDocsId } = useParams();
  const [saveContentModal, setSaveContentModal] = useState(false);
  const [discardContentModal, setDiscardContentModal] = useState(false);
  // const [docDatas, setDocDatas] = useState<Docs[]>([]);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [currentPageData, setCurrentPageData] = useState("");  
  const [editorValue, setEditorValue] = useState(currentPageData);

  const handleEdit = () => {
    setEditorValue(currentPageData);
    setShowTextEditor(true);
  };

  
 const handleSave = async () => {
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
  
  // const {
  //   data: currentPageData , // กำหนดค่าเริ่มต้นให้เป็น string ว่าง ๆ
  //   isLoading: isLoadingContent,
  //   error: errorContent,
  //   refetch: refetchDocsData,
  // } = useFetchQuery(
  //   ["docs"],
  //   // ตรวจสอบว่า docsId หรือ subDocsId มีค่าหรือไม่
  //   subDocsId
  //     ? `/docs/content-subdocs/${subDocsId}`
  //     : docsId
  //     ? `/docs/content-docs/${docsId}`
  //     : ""
  // );

  // ฟังก์ชัน fetcher สำหรับใช้กับ useQuery
  // const fetchContentData = async () => {
  //   try {
  //     let response;
  
  //     if (subDocsId) {
  //       response = await axios.get(
  //         `${import.meta.env.VITE_NEST_BACKEND_API_URL}/docs/content-subdocs/${subDocsId}`,
  //         { withCredentials: true }
  //       );
  //     } else if (docsId) {
  //       response = await axios.get(
  //         `${import.meta.env.VITE_NEST_BACKEND_API_URL}/docs/content-docs/${docsId}`,
  //         { withCredentials: true }
  //       );
  //     } else {
  //       return null;
  //     }
  
  //     return response.data.content;
  //   } catch (error) {
  //     throw new Error("Error fetching data!");
  //   }
  // };
  // const {
  //   data: currentPageData,
  //   isLoading,
  //   error,
  //   refetch:refetchDocsData, // เพิ่มฟังก์ชัน refetch ที่ได้จาก useQuery
  // } = useQuery({
  //   queryKey: ['contentData', docsId || subDocsId],
  //   queryFn: fetchContentData,
  //   enabled: !!(docsId || subDocsId),
  // });
  // // ไม่ต้องจัดการสถานะการโหลดและข้อผิดพลาดด้วยตัวเองแล้ว
  // // TanStack Query จะจัดการให้
  // console.log(currentPageData)
  // // ถ้าต้องการเซ็ตค่าให้กับ state อื่น สามารถใช้ useEffect
  // useEffect(() => {
  //   if (currentPageData) {
  //     setEditorValue(currentPageData.content);
  //   }
  // }, [currentPageData]);
  
  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  
  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

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
