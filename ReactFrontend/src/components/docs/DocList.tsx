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

  addSubtitleService,
  addTitleService,
  changeDocsVisiblityService,
  changeSubDocsVisiblityService,
  deleteSubTitleService,
  deleteTitleService,
  saveDocsOrderService,
  saveSubDocsOrderService,
  updateDocsTitleService,
  updateSubDocsTitleService,
} from "../../api/services/DocsService";
import {
  SaveOutlined,
  SwapVertOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import SaveReorderModal from "./modal/SaveReorderModal";
import { Docs, SubDocListProps, SubDocs, DocListProps } from "../../types/Docs";
import { useFetchQuery } from "../../hook/useFetchQuery";



const DocList: React.FC<DocListProps> = ({refetchDocsData}) => {
  let { docsId, subDocsId } = useParams();


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

  const [docs, setDocs] = useState<Docs[]>([]);
    
  const {
    data: headingData,
    isLoading: isLoadingHeading,
    error: errorHeading,
    refetch: refetchHeading,
  } = useFetchQuery(["heading"], "/docs");
        
          // Sync ข้อมูลจาก fetchedDocs -> docs
  useEffect(() => {
    if (headingData && Array.isArray(headingData)) {
      setDocs(headingData);
    }
  }, [headingData]); // ทำงานเมื่อ fetchedDocs เปลี่ยน
    
    // ตรวจสอบสถานะการโหลด
    if (isLoadingHeading) return <div>Loading...</div>;
    // ตรวจสอบข้อผิดพลาด
    if (errorHeading) return <div>Error: {errorHeading?.message}</div>;
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

  const handleDocsTitleUpdate = async (docsId: string, newTitle: string) => {
    try {
      await updateDocsTitleService(docsId, newTitle);
      refetchHeading();
    } catch (error) {
      console.error("Failed to rename document:", error);
    }
  };





  const handleTitleAdd = async () => {
    try {
      await addTitleService();
      refetchHeading();
    } catch (error) {
      console.error("Failed to update sub-document title:", error);
    }
  };

  const handleSubTitleAdd = async (docsId:string) => {
    try {
      await addSubtitleService(docsId);
      refetchHeading();
    } catch (error) {
      console.error("Failed to update sub-document title:", error);
    }
  };

  const handleDeleteDoc = async (docsId: string) => {
    try {
      await deleteTitleService(docsId);
      refetchHeading();
    } catch (error) {
      console.error("Failed to update sub-document title:", error);
    }
  };

  const handleDeleteSubDoc = async (subDocsId: string) => {
    try {
      await deleteSubTitleService(subDocsId);
      refetchHeading();
    } catch (error) {
      console.error("Failed to update sub-document title:", error);
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
        handleDocsTitleUpdate(docsId, doc.title); // ส่งชื่อที่อัปเดตไปยังเซิร์ฟเวอร์เมื่อกด Enter
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
      await updateSubDocsTitleService(subDocsId, newTitle);
      refetchHeading();
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

      // เรียกใช้ service เพื่อบันทึกลำดับของเอกสาร
      await saveDocsOrderService(docsToSave);

      // เรียกใช้ service เพื่อบันทึกลำดับของเอกสารย่อย
      await saveSubDocsOrderService(subDocsToSave);
      refetchHeading();

      console.log("Order saved successfully for docs and sub-docs");
    } catch (error) {
      console.error("Failed to save reorder:", error);
    }

    setReorderModalOpen(false);
  };
  
  const handleDocsToggleVisibility = async (docsId: string, currentHiddenState: boolean) => {
   try {
      await changeDocsVisiblityService(docsId, !currentHiddenState);
      refetchHeading();
      console.log("Sub-document title updated!");
    } catch (error) {
      console.error("Failed to update sub-document title:", error);
    }
  };

  const handleSubDocsToggleVisibility = async (subDocsId: string, currentHiddenState: boolean) => {
    try {
      await changeSubDocsVisiblityService(subDocsId, !currentHiddenState);
      refetchHeading();
      console.log("Sub-document title updated!");
    } catch (error) {
      console.error("Failed to update sub-document title:", error);
    }
  };
  

  
  if (!Array.isArray(docs)) {
    return <div>Error: docs is not an array</div>;
  }

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
            refetchHeading();}
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
                    <Link to={`/docs/${doc.docsId}`}
                    onClick={() => {
                    }}
                    >
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
