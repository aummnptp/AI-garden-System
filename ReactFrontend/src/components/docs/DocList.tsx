import React, { useEffect, useRef, useState } from "react";
import { Reorder } from "framer-motion";

import EditableInput from "./EditableInput";
import EditModal from "./EditModal";
import DeleteDocModal from "./modal/DeleteDocModal";
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

import { Button, Divider, Menu, MenuItem, TextField } from "@mui/material";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import SubDocList from "./subDocList";
import DeleteSubDocModal from "./modal/DeleteSubDocModal";
import {
  updateDocsTitle,
  updateSubDocsTitle,
} from "../../api/services/DocsService";
import {
  HideImageOutlined,
  HideSourceOutlined,
  SaveAltOutlined,
  SaveAsOutlined,
  SaveOutlined,
  SwapVertOutlined,
  VisibilityOff,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import SaveReorderModal from "./modal/SaveReorderModal";
import { Docs,SubDocs } from "../../types/Docs";
import { useFetchQuery } from "../../hook/useFetchQuery";

// interface SubDoc {
//   subDocsId: string;
//   title: string;
//   content: string;
//   // showEdit: boolean;
//   order: number;
//   // editPosition: { top: number; left: number };
//   // showInput: boolean;
//   // showDelete: boolean;
//   // text: string;
//   hidden: boolean;
// }

// interface DocData {
//   docsId: string;
//   title: string;
//   content: string;
//   // showEditModal: boolean;
//   // editPosition: { top: number; left: number };
//   // showInput: boolean;
//   // showDeleteModal: boolean;
//   order: number;
//   // text: string;
//   hidden: boolean;
//   // subDocs: SubDoc[];
//   subDocuments: SubDoc[];
// }

type DocListProps = {};
const DocList: React.FC<DocListProps> = ({}) => {
  let { docsId, subDocsId } = useParams();
  const [docs, setDocs] = useState<Docs[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSubModalOpen, setDeleteSubModalOpen] = useState(false);
  const [reorderModalOpen, setReorderModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [selectedSubDocId, setSelectedSubDocId] = useState<string | null>(null);
  const [onReOrderMode, setOnReOrderMode] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [headingOptionModal, setHeadingOptionModal] = React.useState<{
    [key: string]: HTMLElement | null;
  }>({});
  const [renameDocId, setRenameDocId] = useState<string|null>(null);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    docId: string
  ) => {
    setHeadingOptionModal((prev) => ({
      ...prev,
      [docId]: event.currentTarget,
    }));
  };

  const handleClose = (docId: string) => {
    setHeadingOptionModal((prev) => ({
      ...prev,
      [docId]: null,
    }));
  };

  // confirm and send to docpage
  const handleHeadingDelete = () => {
    if (selectedDocId) {
      handleDeleteDoc(selectedDocId); // เรียกฟังก์ชันลบจาก props
      setDeleteModalOpen(false);
    }
  };

  // open Modal
  const OpenSubDocDeleteModal = (subDocsId: string) => {
    setSelectedSubDocId(subDocsId); // กำหนด subDocId ที่เลือก
    setDeleteSubModalOpen(true); // เปิด Modal
  };

  const handleSubHeadingDelete = () => {
    if (selectedSubDocId) {
      // ลบ SubDocument
      handleDeleteSubDoc(selectedSubDocId);
      setDeleteSubModalOpen(false); // ปิด Modal
    }
  };

  const patchDocsTitle = async (docsId: string, newTitle: string) => {
    try {
      const updatedDoc = await updateDocsTitle(docsId, newTitle);
    } catch (error) {
      console.error("Failed to rename document:", error);
    } finally {
    }
  };



    // const {
    //   data: docs,
    //   isLoading: isLoadingDocs,
    //   error: errorDocs,
    //   refetch: refetchInvitedWorkspace, // <-- ดึง refetch ออกมา
  
    // } = useFetchQuery(
    //   ["docs"],
    //   `/workspaces/invite-workspaces`
    // );
  
    // // ตรวจสอบสถานะการโหลด
    // if (isLoadingDocs) return <div>Loading...</div>;
    // // ตรวจสอบข้อผิดพลาด
    // if (errorDocs) return <div>Error: { errorDocs?.message}</div>;
  
   
  const fetchData = async () => {
    try {
      let docsResponse;
      docsResponse = await axios.get(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/docs`,
        {
          withCredentials: true,
        }
      );
      setDocs(docsResponse.data);
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

  const handleTitleAdd = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/docs/add-title`,
        {
          title: "New Heading",
          content: "",
        },
        { withCredentials: true }
      );

      console.log("Document added successfully:", response.data);
      fetchData();
      // Add any additional logic here if necessary (e.g., updating UI)
    } catch (error) {
      console.error("Error creating document:", error.message || error);
      // Optional: Add user notification logic (e.g., toast)
    }
  };

  const handleSubTitleAdd = async (docsId: string) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_NEST_BACKEND_API_URL
        }/docs/add-subtitle/${docsId}`,
        {
          title: "New Sub Heading",
          content: "",
        },
        { withCredentials: true }
      );
      console.log("SubDocument added successfully:", response.data);
      fetchData();
    } catch (error) {
      console.error("Error creating sub document:", error.message || error);
    }
  };

  const handleDeleteDoc = async (docsId: string) => {
    try {
      // เรียก API ลบ SubDocument
      const response = await axios.delete(
        `${
          import.meta.env.VITE_NEST_BACKEND_API_URL
        }/docs/delete-docs/${docsId}`,
        { withCredentials: true } // ส่ง Cookies หากจำเป็น
      );

      if (response.status === 200) {
        console.log("SubDocument deleted successfully:", response.data);
        // เพิ่ม logic เช่นอัปเดต UI หลังจากลบสำเร็จ
        fetchData();
        // alert('SubDocument deleted successfully');
      }
    } catch (error) {
      console.error("Error deleting SubDocument:", error);
      alert("Failed to delete Document. Please try again.");
    }
  };

  const handleDeleteSubDoc = async (subDocsId: string) => {
    try {
      // เรียก API ลบ SubDocument
      const response = await axios.delete(
        `${
          import.meta.env.VITE_NEST_BACKEND_API_URL
        }/docs/delete-subdocs/${subDocsId}`,
        { withCredentials: true } // ส่ง Cookies หากจำเป็น
      );

      if (response.status === 200) {
        console.log("SubDocument deleted successfully:", response.data);
        // เพิ่ม logic เช่นอัปเดต UI หลังจากลบสำเร็จ
        fetchData();
        // alert('SubDocument deleted successfully');
      }
    } catch (error) {
      console.error("Error deleting SubDocument:", error);
      alert("Failed to delete SubDocument. Please try again.");
    }
  };

  const onchangeDocTitle = (e, docsId: string) => {
    const newTitle = e.target.value;
    const updatedDocs = docs.map((doc) => {
      if (doc.docsId === docsId) {
        return { ...doc, title: newTitle };
      }
      return doc;
    });
    setDocs(updatedDocs);
  };

  const handleInputKeyDown = (e, docsId: string) => {
    if (e.key === "Enter") {
      setRenameDocId(null); // ซ่อน input field เมื่อทำการเปลี่ยนชื่อเสร็จสิ้น
      const doc = docs.find((doc) => doc.docsId === docsId);
      if (doc) {
        patchDocsTitle(docsId, doc.title); // ส่งชื่อที่อัปเดตไปยังเซิร์ฟเวอร์เมื่อกด Enter
      }
    }
  };

  const onChangeSubTitle = (
    e,
    docsId: string,
    subDocsId: string,
    isEnterKey = false
  ) => {
    const newTitle = e.target.value;

    // อัปเดต State ทันทีเมื่อพิมพ์
    const updatedDocs = docs.map((doc) => {
      if (doc.docsId === docsId) {
        const updatedSubDocs = doc.subDocuments.map((subDoc) => {
          if (subDoc.subDocsId === subDocsId) {
            return { ...subDoc, title: newTitle }; // อัปเดต title
          }
          return subDoc;
        });
        return { ...doc, subDocuments: updatedSubDocs };
      }
      return doc;
    });
    setDocs(updatedDocs);

    // บันทึกเมื่อกด Enter
    if (isEnterKey) {
      const doc = updatedDocs.find((doc) => doc.docsId === docsId); // หา doc ที่ต้องการ
      if (doc) {
        const subDoc = doc.subDocuments.find(
          (subDoc) => subDoc.subDocsId === subDocsId
        ); // หา subDoc ที่ต้องการ
        if (subDoc) {
          patchSubDocsTitle(subDocsId, subDoc.title); // ส่งข้อมูลไปเซิร์ฟเวอร์
        }
      }
    }
  };

  const patchSubDocsTitle = async (subDocsId: string, newTitle: string) => {
    try {
      await updateSubDocsTitle(subDocsId, newTitle);
      console.log("Sub-document title updated!");
    } catch (error) {
      console.error("Failed to update sub-document title:", error);
    }
  };

  const onReorder = async (newDocsOrder: Docs[]) => {
    setDocs(newDocsOrder); // อัปเดต State
  };

  const onSubDocsReorder = async (
    docsId: string,
    newSubDocsOrder: SubDocs[]
  ) => {
    setDocs((prevDocs) =>
      prevDocs.map((doc) =>
        doc.docsId === docsId ? { ...doc, subDocuments: newSubDocsOrder } : doc
      )
    );
  };

  const handleSaveReorder = async () => {
    try {
      // จัดลำดับใหม่สำหรับเอกสาร
      const docsToSave = docs.map((doc, index) => ({
        docsId: doc.docsId,
        order: index + 1, // คำนวณลำดับใหม่ที่นี่
      }));
  
      // จัดลำดับใหม่สำหรับเอกสารย่อย
      const subDocsToSave = docs.flatMap((doc) =>
        doc.subDocuments.map((subDoc, index) => ({
          docsId: doc.docsId,
          subDocsId: subDoc.subDocsId,
          order: index + 1, // คำนวณลำดับใหม่ที่นี่
        }))
      );
      const saveDocsPromise = axios.patch(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/docs/save-docs-order`,
        { documents: docsToSave },
        { withCredentials: true }
      );
  
      const saveSubDocsPromise = axios.patch(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/docs/save-subdocs-order`,
        { subDocuments: subDocsToSave },
        { withCredentials: true }
      );
  
      await Promise.all([saveDocsPromise, saveSubDocsPromise]);
  
      console.log("Order saved successfully for docs and sub-docs");
    } catch (error) {
      console.error("Failed to save reorder:", error);
    }
    setReorderModalOpen(false)
  };
  
  const handleDocsToggleVisibility = async (docsId: string, currentHiddenState: boolean) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/docs/update-docs/${docsId}`,
        { hidden: !currentHiddenState }, // ส่งค่าตรงข้ามของ currentHiddenState
        { withCredentials: true } // ใช้สำหรับส่ง cookies หาก backend ต้องการ
      );
  
      if (response.status === 200) {
        // อัปเดต docs ใน UI หลังจากได้รับการตอบกลับสำเร็จ
        const updatedDocs = docs.map((doc) =>
          doc.docsId === docsId ? { ...doc, hidden: !currentHiddenState } : doc
        );
        setDocs(updatedDocs); // ใช้ setDocs เพื่ออัปเดต state
        console.log(`Visibility updated successfully for document: ${docsId}`);
      } else {
        console.error(`Failed to update visibility: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating document visibility:", error.message || error);
    }
  };

  const handleSubDocsToggleVisibility = async (subDocsId: string, currentHiddenState: boolean) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/docs/update-subdocs/${subDocsId}`,
        { hidden: !currentHiddenState }, 
        { withCredentials: true } 
      );
  
      if (response.status === 200) {
        fetchData();
        console.log(`Visibility updated successfully for subdocument: ${subDocsId}`);
      } else {
        console.error(`Failed to update visibility: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating subdocument visibility:", error.message || error);
    }
  };
  

  


  return (
    <div className="px-3 pt-6 pb-24 h-full w-[20%] bg-white shadow border fixed z-40 overflow-y-scroll">
      <SaveReorderModal open={reorderModalOpen} onClose={() => setReorderModalOpen(false)}  onSave={handleSaveReorder} />
      <h1 className=" w-[95%] ml-2 text-black text-3xl font-normal  ">
        Documentation
      </h1>
      <div className="flex justify-between pt-4 ">
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: "#4f46e5",
            "&:hover": {
              backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
            },
          }}
          onClick={handleTitleAdd}
        >
          <PlusCircleOutlined /> Add New Heading
        </Button>
        <Button
          variant={onReOrderMode ? "outlined" : "text"}
          style={{
            // borderRadius: "5px",
            cursor: "pointer",
            minWidth: "auto",
            padding: "4px 8px",
          }}
          sx={onReOrderMode ? { color: "#4f46e5" } : { color: "#4f46e5" }}
          onClick={() => {setOnReOrderMode(!onReOrderMode)
            fetchData();}
          }
        >
          <SwapVertOutlined /> {onReOrderMode ? "Sorting" : "Sort"}
        </Button>
      </div>
      <div className=" w-[95%]  border border-zinc-300 mx-auto my-2 mb-4" />
      <>
        {/* heading Delete Modal */}
        {selectedDocId !== null && (
          <DeleteSubDocModal
            title={`Delete this heading?`}
            open={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setSelectedDocId(null);
              setSelectedSubDocId(null);
            }}
            onDelete={handleHeadingDelete}
          />
        )}
        {/* subheading Delete Modal */}
        {selectedSubDocId !== null && (
          <DeleteDocModal
            title={`Delete this sub heading?`}
            open={deleteSubModalOpen}
            onClose={() => {
              setDeleteSubModalOpen(false);
              setSelectedDocId(null);
              setSelectedSubDocId(null);
            }}
            onDelete={handleSubHeadingDelete}
          />
        )}
        {onReOrderMode ? (
          <div className="flex justify-end">
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#4f46e5",
                "&:hover": {
                  backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                },
              }}
              onClick={() => setReorderModalOpen(true)}
            >
              <SaveOutlined /> Save Reorder
            </Button>
          </div>
        ) : null}
        <Reorder.Group
          axis="y"
          values={docs}
          onReorder={onReorder}
          className={`py-2 items-center mt-2 ${
            onReOrderMode
              ? "border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
              : ""
          }`}
        >
          {onReOrderMode ? (
            <span className="py-2 flex-1 pl-3 text-lg  text-gray-600">
              <SwapVertOutlined /> drag to reorder heading
            </span>
          ) : null}
          {docs.map((doc) => {
            const open = Boolean(headingOptionModal[doc.docsId]);
            return (
              <div key={doc.docsId} className="w-full">
                <div className="flex w-full justify-between ">
                  {/* เปลี่ยนเป็น text input เมื่อ rename */}
                  {renameDocId === doc.docsId ? (
                    <div className="w-full h-fit">
                      <TextField
                        required
                        id={`title-${doc.docsId}`}
                        label="ใส่ชื่อที่ต้องการแก้ไข"
                        inputProps={{ maxLength: 20 }}
                        value={doc.title}
                        onChange={(e) => onchangeDocTitle(e, doc.docsId)}
                        onKeyDown={(e) => handleInputKeyDown(e, doc.docsId)}
                        ref={wrapperRef}
                      />
                    </div>
                  ) : // แสดงชื่อหัวข้อ
                  onReOrderMode ? (
                    <Reorder.Item key={doc.order} value={doc}>
                      <span className="py-2 flex-1 pl-3 text-lg font-medium cursor-pointer hover:text-indigo-800">
                        {doc.title}
                      </span>
                    </Reorder.Item>
                  ) : (
                    <Link to={`/docs/${doc.docsId}`}>
                      <span className="py-2 flex-1 pl-3 text-lg font-medium cursor-pointer hover:text-indigo-800">
                        {doc.title}
                      </span>
                    </Link>
                  )}
                  <div className="mx-2 flex items-center h-full w-fit">
                    {/* แสดงปุ่มเมนู */}
                    {doc.hidden ? <VisibilityOffOutlined /> : null}
                    <Button
                      className="hover:bg-gray-100 rounded-lg gap-3 cursor-pointer "
                      id={`basic-button-${doc.docsId}`}
                      aria-controls={
                        open ? `basic-menu-${doc.docsId}` : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={(e) => handleClick(e, doc.docsId)}
                      style={{
                        cursor: "pointer",
                        minWidth: "auto",
                        padding: "4px 8px",
                      }}
                    >
                      <i className="bi bi-three-dots  text-gray-600 justify-between " />
                    </Button>

                    <Menu
                      id={`basic-menu-${doc.docsId}`}
                      anchorEl={headingOptionModal[doc.docsId]}
                      open={open}
                      onClose={() => handleClose(doc.docsId)}
                      MenuListProps={{
                        "aria-labelledby": `basic-button-${doc.docsId}`,
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          setRenameDocId(doc.docsId);
                          handleClose(doc.docsId);
                        }}
                      >
                        <EditOutlined />
                        Rename
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleDocsToggleVisibility(doc.docsId, doc.hidden);
                        }}
                      >
                        {doc.hidden ? (
                          <VisibilityOutlined />
                        ) : (
                          <VisibilityOffOutlined />
                        )}
                        {doc.hidden ? "Show Content" : "Hide Content"}
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setSelectedDocId(doc.docsId);
                          setDeleteModalOpen(true);
                          handleClose(doc.docsId);
                        }}
                      >
                        <DeleteOutlined />
                        Delete
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
                <SubDocList
                  docsId={doc.docsId}
                  subDocuments={doc.subDocuments}
                  onAddSubTitle={handleSubTitleAdd}
                  onDeleteSubDoc={OpenSubDocDeleteModal}
                  onChangeSubTitle={onChangeSubTitle}
                  onSubDocsReorder={(newSubDocsOrder) =>
                    onSubDocsReorder(doc.docsId, newSubDocsOrder)
                  }
                  onReOrderMode={onReOrderMode}
                  onSubDocToggleVisibility={handleSubDocsToggleVisibility}
                />
              </div>
            );
          })}
        </Reorder.Group>
      </>
    </div>
  );
};

export default DocList;
