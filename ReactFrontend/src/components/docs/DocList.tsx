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
import SubTitleList from "./SubList";
import { Button, Menu, MenuItem, TextField } from "@mui/material";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import SubDocList from "./subDocList";
import DeleteSubDocModal from "./modal/DeleteSubDocModal";
import { updateDocsTitle, updateSubDocsTitle } from "../../api/services/DocsService";

interface SubTitle {
  subId: string;
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

interface Props {
  docs: {
    docsId: number;
    title: string;
    // slug: string;
  }[];
}

type DocListProps = {
  // docs: any[]; // ประเภทของ `docs` ที่ส่งมา
  // onDeleteDoc: (docsId: string) => void; // ฟังก์ชันสำหรับลบหัวข้อใหญ่
  // onDeleteSubDoc: (subDocsId: string) => void; // ฟังก์ชันสำหรับลบหัวข้อย่อย
  // onchangeDocTitle: (docsId: string, title: string) => void;
  // patchDocsTitle: (docsId: string, title: string) => void;
  // addTitle: () => void;
  // addSubTitle: (docsId: string) => void;
};
const DocList: React.FC<DocListProps> = ({
  // docs,
  // onDeleteDoc,
  // onDeleteSubDoc,
  // addTitle,
  // addSubTitle,
  // onchangeDocTitle,
  // patchDocsTitle,
}) => {
   let { docsId, subDocsId } = useParams();
  const [docs, setDocs] = useState<DocData[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSubModalOpen, setDeleteSubModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [selectedSubDocId, setSelectedSubDocId] = useState<string | null>(null);
  // const [docs, setDocs] = useState([])
  const [docDatas, setDocDatas] = useState<DocData[]>([]);

  const handleTitleDelete = (index: number) => {
    const docDataList = [...docDatas];

    // ลบข้อมูลที่ตำแหน่งที่กำหนด
    docDataList.splice(index, 1);
    setDocDatas(docDataList);

    // ตรวจสอบว่า index ตรงกับข้อมูลใน editAtIndex หรือไม่
    if (editAtIndex.some((item) => item.index === index)) {
      // NavigationToContent(0);
    }
  };
  // 11
  const handleEditClick = (index: number) => {
    // show textinput === index param
    const showTextInput = [...docDatas];
    showTextInput[index].showInput = true;
    setDocDatas(showTextInput);
    // set text input to match with title
    const updatedTextInput = [...docDatas];
    updatedTextInput[index].text = docDatas[index].title;
    setDocDatas(updatedTextInput);
  };

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

  const showEditOptionModal = (
    e: React.MouseEvent<HTMLSpanElement>,
    index: number
  ) => {
    // ใช้ rect เพื่ออัพเดต editPosition
    if (showTextEditor === false) {
      const rect = e.currentTarget.getBoundingClientRect();

      const updatedDocDatas = [...docDatas];
      updatedDocDatas[index].editPosition = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      };
      updatedDocDatas[index].showEditModal = true;
      setDocDatas(updatedDocDatas);
    } else {
      setShowWarningEdit(true);
    }
  };

  const hideEditOptionModal = (
    e: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    if (e.target === e.currentTarget) {
      const updatedTitleModals = [...docDatas];
      updatedTitleModals[index].showEditModal = false;
      setDocDatas(updatedTitleModals);
    }
  };

  const showSubEditOptionModal = (
    e: React.MouseEvent<HTMLSpanElement>,
    index: number,
    subIndex: number
  ) => {
    // show title setting modal
    if (showTextEditor === false) {
      const rect = e.currentTarget.getBoundingClientRect();

      const updatedDocDatas = [...docDatas];
      updatedDocDatas[index].subTitle[subIndex].editPosition = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      };
      const UpdatedTitleModals = [...docDatas];
      UpdatedTitleModals[index].subTitle[subIndex].showEdit = true;
      setDocDatas(UpdatedTitleModals);
    } else {
      setShowWarningEdit(true);
    }
  };

  const hideSubEditOptionModal = (
    e: React.MouseEvent<HTMLElement>,
    index: number,
    subIndex: number
  ) => {
    if (e.target === e.currentTarget) {
      const updatedTitleModals = [...docDatas];
      updatedTitleModals[index].subTitle[subIndex].showEdit = false;
      setDocDatas(updatedTitleModals);
    }
  };

  const showDeleteModal = (index: number) => {
    // show title setting modal
    const UpdatedTitleModals = [...docDatas];
    UpdatedTitleModals[index].showDeleteModal = true;
    setDocDatas(UpdatedTitleModals);
  };

  const hideDeleteModal = (index: number) => {
    const UpdatedTitleModals = [...docDatas];
    UpdatedTitleModals[index].showDeleteModal = false;
    setDocDatas(UpdatedTitleModals);
  };
  const showSubDeleteModal = (index: number, subIndex: number) => {
    // show title setting modal
    const UpdatedTitleModals = [...docDatas];
    UpdatedTitleModals[index].subTitle[subIndex].showDelete = true;
    setDocDatas(UpdatedTitleModals);
  };

  const hideSubDeleteModal = (
    e: React.MouseEvent<HTMLElement>,
    index: number,
    subIndex: number
  ) => {
    if (e.target === e.currentTarget) {
      const UpdatedTitleModals = [...docDatas];
      UpdatedTitleModals[index].subTitle[subIndex].showDelete = false;
      setDocDatas(UpdatedTitleModals);
    }
  };

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const subwrapperRef = useRef<HTMLDivElement | null>(null);

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

  const handleSubTitleDelete = (docIndex: number, subIndex: number) => {
    // ตรวจสอบว่า docIndex และ subIndex ตรงกับข้อมูลใน editAtIndex หรือไม่

    const updatedDocDatas = [...docDatas];
    if (updatedDocDatas[docIndex] && updatedDocDatas[docIndex].subTitle) {
      updatedDocDatas[docIndex].subTitle.splice(subIndex, 1);
      if (updatedDocDatas[docIndex].subTitle.length === 0) {
        updatedDocDatas[docIndex].subTitle = [];
      }
      setDocDatas(updatedDocDatas);
    }
    if (
      editAtIndex.some(
        (item) => item.index === docIndex && item.subIndex === subIndex
      )
    ) {
    }
  };
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

  const handleEditSubTitleClick = (index: number, subIndex: number) => {
    // show textinput === index param
    const TextInput = [...docDatas];
    if (TextInput[index] && TextInput[index].subTitle) {
      TextInput[index].subTitle[subIndex].showInput = true;
      setDocDatas(TextInput);
      // set text input to match with title
      const updatedTextInput = [...docDatas];
      TextInput[index].subTitle[subIndex].text =
        docDatas[index].subTitle[subIndex].name;
      setDocDatas(updatedTextInput);
    }
  };

  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showWarningEdit, setShowWarningEdit] = useState(false);
  const [editAtIndex, setEditAtIndex] = useState<EditAtIndexType[]>([
    { index: 0, subIndex: null },
  ]);

  // drag n drop
  const handleSubTitleReorder = (index: number, newSubTitles: SubTitle[]) => {
    const updatedDocDatas = [...docDatas];
    updatedDocDatas[index].subTitle = newSubTitles;
    setDocDatas(updatedDocDatas);
  };

  const [headingOptionModal, setHeadingOptionModal] = React.useState<{
    [key: string]: HTMLElement | null;
  }>({});

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

  

  const [renameDocId, setRenameDocId] = useState(null);


  

  
  const patchDocsTitle  = async (docsId, newTitle) => {
    try {
      const updatedDoc = await updateDocsTitle(docsId, newTitle);
      console.log("Document renamed:", updatedDoc);
    } catch (error) {
      console.error("Failed to rename document:", error);
    } finally {

    }
    };
  const handleSubInputKeyDown = (
    event: React.KeyboardEvent,
    subDocsId: number
  ) => {
    if (event.key === "Enter") {
      alert(subDocsId);
      setRenameDocId(null);
    }
  };


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

    const handleSubTitleAdd = async (docsId: number) => {
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
          const onchangeDocTitle = (e, docsId) => {
            const newTitle = e.target.value;
            const updatedDocs = docs.map(doc => {
              if (doc.docsId === docsId) {
                return { ...doc, title: newTitle };
              }
              return doc;
            });
            setDocs(updatedDocs);    
          };
        
          const handleInputKeyDown = (e, docsId) => {
            if (e.key === "Enter") {
              setRenameDocId(null); // ซ่อน input field เมื่อทำการเปลี่ยนชื่อเสร็จสิ้น
              const doc = docs.find(doc => doc.docsId === docsId);
              if (doc) {
                patchDocsTitle(docsId, doc.title); // ส่งชื่อที่อัปเดตไปยังเซิร์ฟเวอร์เมื่อกด Enter
              }
            }
          };
        
          const onChangeSubTitle = (e, docsId, subDocsId, isEnterKey = false) => {
            const newTitle = e.target.value;
          
            // อัปเดต State ทันทีเมื่อพิมพ์
            const updatedDocs = docs.map(doc => {
              if (doc.docsId === docsId) {
                const updatedSubDocs = doc.subDocuments.map(subDoc => {
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
              const doc = updatedDocs.find(doc => doc.docsId === docsId); // หา doc ที่ต้องการ
              const subDoc = doc?.subDocuments.find(subDoc => subDoc.subDocsId === subDocsId); // หา subDoc ที่ต้องการ
              if (subDoc) {
                patchSubDocsTitle(subDocsId, subDoc.title); // ส่งข้อมูลไปเซิร์ฟเวอร์
              }
            }
          };
          
          const patchSubDocsTitle = async (subDocsId, newTitle) => {
            try {
              await updateSubDocsTitle(subDocsId, newTitle);
                console.log("Sub-document title updated!");
            } catch (error) {
              console.error("Failed to update sub-document title:", error);
            }
          };
          

          
          

  return (
    <div className="px-3 pt-6 pb-24 h-full w-[20%] bg-white shadow border fixed z-40 overflow-y-scroll">
      <h1 className=" w-[95%] ml-2 text-black text-3xl font-normal  ">
        Documentation
      </h1>

      <div className=" w-[95%]  border border-zinc-300 mx-auto my-2 mb-4" />
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
          onClick={handleTitleAdd}
        >
          <PlusCircleOutlined /> Add New Heading
        </Button>
      </div>

      <>
        {/* heading Delete Modal */}
        {selectedDocId !== null && (
          <DeleteSubDocModal
            title={`Delete this heading?${selectedDocId}`}
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
            title={`Delete this sub heading?${selectedSubDocId}`}
            open={deleteSubModalOpen}
            onClose={() => {
              setDeleteSubModalOpen(false);
              setSelectedDocId(null);
              setSelectedSubDocId(null);
            }}
            onDelete={handleSubHeadingDelete}
          />
        )}
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
                ) : (
                  // แสดงชื่อหัวข้อ
                  <Link to={`/docs/${doc.docsId}`}>
                    <span className="py-2 flex-1 pl-3  text-lg font-medium  cursor-pointer hover:text-indigo-800">
                      {doc.title}
                    </span>
                  </Link>
                )}
                <div className="mx-2 flex items-center h-full w-fit">
                  {/* แสดงปุ่มเมนู */}
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
                onShowSubEditOptionModal={showSubEditOptionModal}
                onAddSubTitle={handleSubTitleAdd}
                onDeleteSubDoc={OpenSubDocDeleteModal}
                onChangeSubTitle={onChangeSubTitle}
                parentIndex={doc.docsId}
              />
            </div>
          );
        })}
      </>
      <Reorder.Group axis="y" values={docDatas} onReorder={setDocDatas}>
        {docDatas.map((doc, index) => (
          <Reorder.Item key={doc.id} value={doc} className="">
            <div key={index} className="flex justify-between items-center mb-2">
              {docDatas[index].showInput === false ? (
                <div className="w-full">
                  <div className=" flex  justify-between">
                    <Link to={`/docs/${doc.id}`}>
                      <span
                        // onClick={() => NavigationToContent(index)}
                        className="py-2 flex-1 pl-3 whitespace-nowrap text-lg font-semibold hover:bg-gray-100 rounded-lg  gap-3 cursor-pointer"
                      >
                        {doc.title}
                      </span>
                    </Link>
                    <MoreOutlined
                      onClick={(e) => showEditOptionModal(e, index)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  {/* subtitle list */}
                  <div className="">
                    <ul>
                      <Reorder.Group
                        axis="y"
                        values={doc.subTitle}
                        onReorder={(newSubTitles) =>
                          handleSubTitleReorder(index, newSubTitles)
                        }
                      >
                        {docDatas[index]?.subTitle?.map(
                          (subTitle, subIndex) => (
                            <Reorder.Item
                              key={subTitle.subId}
                              value={subTitle}
                              className=""
                            >
                              <div>
                                {docDatas[index].subTitle[subIndex]
                                  .showInput === false ? (
                                  <div className="flex " key={subIndex}>
                                    <span
                                      // onClick={() =>
                                      //   NavigationToContent(index, subIndex)
                                      // }
                                      className="py-1 pl-14 flex w-full text-gray-600 justify-between hover:bg-gray-100 rounded-lg  gap-3 cursor-pointer"
                                    >
                                      {subTitle.name}
                                    </span>
                                    <MoreOutlined
                                      onClick={(e) =>
                                        showSubEditOptionModal(
                                          e,
                                          index,
                                          subIndex
                                        )
                                      }
                                      style={{ cursor: "pointer" }}
                                    />
                                  </div>
                                ) : (
                                  <div className="w-full h-fit bg-red ">
                                    {/* Sub title textinput */}
                                    <TextField
                                      required
                                      id={`title-${index}`}
                                      label="ใส่ชื่อที่ต้องการแก้ไข"
                                      inputProps={{ maxLength: 20 }}
                                      value={
                                        docDatas[index].subTitle[subIndex].text
                                      }
                                      onChange={(e) => {
                                        const newTitleComponentData = [
                                          ...docDatas,
                                        ];
                                        newTitleComponentData[index].subTitle[
                                          subIndex
                                        ].text = e.target.value;
                                        setDocDatas(newTitleComponentData);
                                      }}
                                      onKeyDown={(e) =>
                                        handleSubInputKeyDown(
                                          e,
                                          index,
                                          subIndex
                                        )
                                      }
                                      ref={subwrapperRef}
                                    />
                                  </div>
                                )}
                                {/* edit modal (rename ,delete) */}
                                {docDatas[index].subTitle[subIndex].showEdit ===
                                true ? (
                                  <div className="flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                    <div
                                      style={{
                                        top: docDatas[index].subTitle[subIndex]
                                          .editPosition.top,
                                        left: docDatas[index].subTitle[subIndex]
                                          .editPosition.left,
                                      }}
                                      className="  z-50 border-0 rounded-lg relative flex flex-col w-fit h-fit  py-2 bg-white "
                                    >
                                      <ul>
                                        <li
                                          className="cursor-pointer rounded-lg  hover:bg-gray-100  group focus:ring-4 focus:bg-blue-300 px-4 py-2"
                                          onClick={() => {
                                            handleEditSubTitleClick(
                                              index,
                                              subIndex
                                            );
                                            const updatedTitleModals = [
                                              ...docDatas,
                                            ];
                                            updatedTitleModals[index].subTitle[
                                              subIndex
                                            ].showEdit = false;
                                            setDocDatas(updatedTitleModals);
                                          }}
                                        >
                                          <EditOutlined />
                                          rename
                                        </li>
                                        <li
                                          onClick={() => {
                                            showSubDeleteModal(index, subIndex);
                                            // handleTitleDelete(index);
                                            // set modal to false
                                            const updatedTitleModals = [
                                              ...docDatas,
                                            ];
                                            updatedTitleModals[index].subTitle[
                                              subIndex
                                            ].showEdit = false;
                                            setDocDatas(updatedTitleModals);
                                          }}
                                          className="cursor-pointer rounded-lg  hover:bg-gray-100  group focus:ring-4 focus:bg-blue-300 px-4 py-2"
                                        >
                                          <span className="text-[#f93a37]">
                                            <DeleteOutlined />
                                            delete
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                    <div
                                      className=" opacity-25 fixed inset-0 z-40 bg-black"
                                      onClick={(e) =>
                                        hideSubEditOptionModal(
                                          e,
                                          index,
                                          subIndex
                                        )
                                      }
                                    ></div>
                                  </div>
                                ) : null}
                                {/* show delete modal */}
                                {/* edit modal (rename ,delete) */}
                                {docDatas[index].subTitle[subIndex]
                                  .showDelete === true ? (
                                  <>
                                    <div
                                      className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                                      onClick={(e) =>
                                        hideSubDeleteModal(e, index, subIndex)
                                      }
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
                                                Delete this sub headding ?
                                              </span>
                                            </h1>
                                          </div>
                                          {/*body*/}
                                          {/*footer*/}
                                          <div className=" mx-auto flex items-center justify-end p-6">
                                            <Button
                                              variant="outlined"
                                              size="large"
                                              onClick={(e) =>
                                                hideSubDeleteModal(
                                                  e,
                                                  index,
                                                  subIndex
                                                )
                                              }
                                            >
                                              Cancel
                                            </Button>

                                            <Button
                                              variant="contained"
                                              size="large"
                                              color="error"
                                              onClick={() =>
                                                handleSubTitleDelete(
                                                  index,
                                                  subIndex
                                                )
                                              }
                                            >
                                              Delete
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                                  </>
                                ) : null}
                              </div>
                            </Reorder.Item>
                          )
                        )}
                      </Reorder.Group>
                    </ul>
                    <div
                      // onClick={() => handleSubTitleAdd(index)}
                      className="py-1 pl- flex w-full    text-blue-700 whitespace-nowrap  hover:bg-gray-100 rounded-lg  cursor-pointer px-4 my-2 "
                    >
                      <span className="text-blue-700">
                        <PlusCircleOutlined />
                        Add Sub Heading
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-fit bg-red ">
                  {/* title textinput */}
                  <TextField
                    required
                    id={`title-${index}`}
                    label="ใส่ชื่อที่ต้องการแก้ไข"
                    inputProps={{ maxLength: 20 }}
                    value={docDatas[index].text}
                    onChange={(e) => {
                      const newTitleComponentData = [...docDatas];
                      newTitleComponentData[index].text = e.target.value;
                      setDocDatas(newTitleComponentData);
                    }}
                    onKeyDown={(e) => handleInputKeyDown(e, index)}
                    ref={wrapperRef}
                  />
                </div>
              )}
              {/* edit modal (rename ,delete) */}
              {docDatas[index].showEditModal === true ? (
                <EditModal
                  key={index}
                  show={doc.showEditModal}
                  position={doc.editPosition}
                  onRename={() => {
                    handleEditClick(index);
                    const updatedDatas = [...docDatas];
                    updatedDatas[index].showEditModal = false;
                    setDocDatas(updatedDatas);
                  }}
                  onDelete={() => {
                    showDeleteModal(index);
                    const updatedDatas = [...docDatas];
                    updatedDatas[index].showEditModal = false;
                    setDocDatas(updatedDatas);
                  }}
                  onClose={(e) => hideEditOptionModal(e, index)}
                />
              ) : // <div className="flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              //   <div
              //     style={{
              //       top: doc.editPosition.top,
              //       left: doc.editPosition.left,
              //     }}
              //     className="z-50 border-0 rounded-lg relative flex flex-col w-fit h-fit  py-2 bg-white "
              //   >
              //     <ul>
              //       <li
              //         className="cursor-pointer rounded-lg  hover:bg-gray-100  group focus:ring-4 focus:bg-blue-300 px-4 py-2"
              //         onClick={() => {
              //           handleEditClick(index);
              //           const updatedTitleModals = [...docDatas];
              //           updatedTitleModals[index].showEditModal = false;
              //           setDocDatas(updatedTitleModals);
              //         }}
              //       >
              //         <EditOutlined />
              //         rename
              //       </li>
              //       <li
              //         onClick={() => {
              //           showDeleteModal(index);
              //           // handleTitleDelete(index);
              //           // set modal to false
              //           const updatedTitleModals = [...docDatas];
              //           updatedTitleModals[index].showEditModal = false;
              //           setDocDatas(updatedTitleModals);
              //         }}
              //         className="cursor-pointer rounded-lg  hover:bg-gray-100  group focus:ring-4 focus:bg-blue-300 px-4 py-2"
              //       >
              //         <span className="text-[#f93a37]">
              //           <DeleteOutlined />
              //           delete
              //         </span>
              //       </li>
              //     </ul>
              //   </div>
              //   <div
              //     className=" opacity-25 fixed inset-0 z-40 bg-black"
              //     onClick={(e) => hideEditOptionModal(e, index)}
              //   ></div>
              // </div>
              null}
              {/* show delete modal */}
              {/* edit modal (rename ,delete) */}
              {docDatas[index].showDeleteModal === true ? (
                <>
                  <div
                    className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    onClick={() => hideDeleteModal(index)}
                  >
                    <div className="relative w-5/12 my-6 mx-auto">
                      {/*card */}
                      <div className="border-0 rounded-lg  shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className=" flex items-center justify-(between p-5 border-b border-solid border-blueGray-200 rounded-t ">
                          <h1
                            className=" text-3xl font-semibold text-center p-5 ml-5 mb-2 tracking-tight 
              text-indigo-900 "
                          >
                            <span className="mt-5 absolute inset-x-0 top-0 text-center">
                              Delete this heading?
                            </span>
                          </h1>
                        </div>
                        {/*body*/}
                        {/*footer*/}
                        <div className=" mx-auto flex items-center justify-end p-6">
                          <Button
                            variant="outlined"
                            size="large"
                            onClick={() => hideDeleteModal(index)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            size="large"
                            color="error"
                            onClick={() => handleTitleDelete(index)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
              ) : null}
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

export default DocList;
