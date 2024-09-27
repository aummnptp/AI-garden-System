import { DeleteOutlined, EditOutlined, MoreOutlined, PlusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Reorder } from "framer-motion"
import 'react-quill/dist/quill.snow.css'; // import styles
import { Editor } from '@tinymce/tinymce-react';

interface SubTitle {
  subId:number
  name: string;
  contentData:string;
  showEdit: boolean;
  editPosition: { top: number; left: number }; 
  showInput: boolean;
  showDelete: boolean;
  text:string;
}

interface DocData {
  id:number
  title: string;
  contentData:string;
  showEditModal: boolean;
  editPosition: { top: number; left: number }; 
  showInput: boolean;
  showDeleteModal:boolean;
  text: string;
  subTitle: SubTitle[];
}

type EditAtIndexType = {
  index: number;
  subIndex: number | null;
};

const DocsPage = () => {
  // ข้อมูลของ Docdata
  const [docDatas, setDocDatas] = useState<DocData[]>([
    {
      id: 1,
      title: "AI Garden System",
      contentData: `
<p><span style="color: #353d81;"><strong><span style="font-size: 36pt;">Welcome to AI Garden System</span></strong></span></p>
<p><span style="font-size: 18pt;">ในแต่ละส่วนของหน้านี้จะเป็นคำอธิบายเกี่ยวกับdocument ที่จะช่วยให้ข้อมูลส่วนต่างๆของเว็บไซต์<br>สามารถกดเลือกแต่ละหัวข้อทางsidebar menu เพื่อดูข้อมูลแต่ละหัวข้อ<br><br></span></p>
<p><span style="color: #353d81;">&nbsp;</span></p>
<p>Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry'sLorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry'sLorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's&nbsp;</p>
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
          editPosition: { top: 0, left: 0 }, // แก้ไขจาก array เป็น object
          showInput: false,
          showDelete: false,
          text: ``,
        },
      ],
    },
    {
      id: 2,
      title: "Workspaces",
      contentData: "Workspaces content here",
      showEditModal: false,
      editPosition: { top: 0, left: 0 }, // แก้ไขจาก array เป็น object

      showInput: false,
      showDeleteModal: false,
      text: "",
      subTitle: [],
    },
  ]);



  
  // ข้อมูลของ Title Manage component เช่น โชว์ edit โชว์ input โชว์ delete

  // console.log("docData:",docDatas);

  // Edit Title Function handler
  const handleTitleAdd = () => {
    const maxId =
      docDatas.length > 0 ? Math.max(...docDatas.map((doc) => doc.id)) : 0;
    const newId = maxId + 1;
    setDocDatas([
      ...docDatas,
      {
        id: newId,
        title: "New Heading",
        contentData: "",
        showEditModal: false,
        editPosition: { top: 0, left: 0 }, // แก้ไขจาก array เป็น object
        showInput: false,
        showDeleteModal: false,
        text: "",
        subTitle: [],
      },
    ]);
  };

  const handleTitleDelete = (index: number) => {
    const docDataList = [...docDatas];
    
    // ลบข้อมูลที่ตำแหน่งที่กำหนด
    docDataList.splice(index, 1);
    setDocDatas(docDataList);
  
    // ตรวจสอบว่า index ตรงกับข้อมูลใน editAtIndex หรือไม่
    if (editAtIndex.some(item => item.index === index)) {
      NavigationToContent(0);
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

  const handleInputKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "Enter") {
      handleTitleSave(index);
    }
  };
  const handleSubInputKeyDown = (
    event: React.KeyboardEvent,
    index: number,
    subIndex: number
  ) => {
    if (event.key === "Enter") {
      handleSubTitleSave(index, subIndex);
    }
  };



  // console.log(position)
  const showEditOptionModal = (e: React.MouseEvent<HTMLSpanElement>, index: number) => {
    // ใช้ rect เพื่ออัพเดต editPosition
    if(showTextEditor === false){
 
        const rect = e.currentTarget.getBoundingClientRect();

        const updatedDocDatas = [...docDatas];
        updatedDocDatas[index].editPosition = {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX
        };
        updatedDocDatas[index].showEditModal = true;
        setDocDatas(updatedDocDatas);
    }
    else{
      setShowWarningEdit(true)
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


  const showSubEditOptionModal = (e: React.MouseEvent<HTMLSpanElement>,index: number,subIndex: number) => {
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

  const hideDeleteModal = (e: React.MouseEvent<HTMLElement>, index: number) => {
    if (e.target === e.currentTarget) {
      const UpdatedTitleModals = [...docDatas];
      UpdatedTitleModals[index].showDeleteModal = false;
      setDocDatas(UpdatedTitleModals);
    }
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

  // sub title handle here
  const handleSubTitleAdd = (index: number) => {
    const updatedDocDatas = [...docDatas];

    if (!updatedDocDatas[index].subTitle) {
      updatedDocDatas[index].subTitle = [];
    }

    const subTitles = updatedDocDatas[index].subTitle;
    const maxSubId =
      subTitles.length > 0 ? Math.max(...subTitles.map((sub) => sub.subId)) : 0;
    const newSubId = maxSubId + 1;
    // check ข้อมูลใน title component
    updatedDocDatas[index].subTitle.push({
      subId: newSubId,
      name: "New Subtitle",
      contentData: "",
      showEdit: false,
      editPosition: { top: 0, left: 0 }, // แก้ไขจาก array เป็น object

      showInput: false,
      showDelete: false,
      text: "",
    });

    setDocDatas(updatedDocDatas);
  };

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
      if (editAtIndex.some(item => item.index === docIndex && item.subIndex === subIndex)) {
    NavigationToContent(0);
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

  // editor here
  const [value, setValue] = useState(docDatas[0].contentData);
  const [text, setText] = useState("");
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showSaveEditorModal, setShowSaveEditorModal] = useState(false);
  // const [currentHeadingId, setCurrentHeadingId] = useState(docDatas[0].id);
  const [showWarningEdit,setShowWarningEdit] = useState(false);
  const [editAtIndex, setEditAtIndex] = useState<EditAtIndexType[]>([{ index: 0, subIndex: null }]);
  const [currentPageData, setCurrentPageData] = useState(
    docDatas[0].contentData
  );
  const editorRef = useRef(null);
  const handleEditorChange = (newValue: string, editor: any) => {
    setValue(newValue);
    setText(editor.getContent());
  };
  // console.log(value)

// แก้ไขตัว content ด้วย editorใน เว็บ
const EditContent = (index: number, subIndex: number | null) => {
    if (subIndex !== null) {
      setCurrentPageData(docDatas[index].subTitle[subIndex].contentData);
      setValue(docDatas[index].subTitle[subIndex].contentData)
    } else {
      setCurrentPageData(docDatas[index].contentData);
      setValue(docDatas[index].contentData)
    }
    
    setShowTextEditor(true);
  };




  const SaveEditContent = (index: number, subIndex: number | null) => {
    if (subIndex !== null) {
      setCurrentPageData(text);
      const    updatedDocDatas = [...docDatas];
      updatedDocDatas[index].subTitle[subIndex].contentData  = text
      setDocDatas(updatedDocDatas)
      // setValue(docDatas[index].subTitle[subIndex].contentData)
    } else {
      setCurrentPageData(text);
      const    updatedDocDatas = [...docDatas];
      updatedDocDatas[index].contentData  = text
      setDocDatas(updatedDocDatas)
      // setValue(docDatas[index].contentData)
    }
    setShowTextEditor(false);
    setShowSaveEditorModal(false);
  };

  console.log( docDatas)
  const NavigationToContent = (index: number, subIndex?: number) => {
    if(showTextEditor === false){
      if (subIndex !== undefined) {
        const subTitle = docDatas[index]?.subTitle[subIndex];
        if (subTitle) {
          const ContentData = [...docDatas];
          setCurrentPageData(ContentData[index].subTitle[subIndex].contentData);
          setEditAtIndex([{ index: index, subIndex: subIndex }]);
          // setEditAtIndex(ContentData[index].subTitle[subIndex].contentData);
          // Perform navigation or search with subTitle.contentData
        }
      } else {
        const doc = docDatas[index];
        if (doc) {
          const ContentData = [...docDatas];
          setCurrentPageData(ContentData[index].contentData);
          setEditAtIndex([{ index: index, subIndex: null }]);

          // Perform navigation or search with doc.contentData
        }
      }
    }
    else{
      setShowWarningEdit(true)

    }
  };
  const AbandonEditing= () => {
    setShowWarningEdit(false)
    setShowTextEditor(false)

  }
  const hideWarningModal = (
    e: React.MouseEvent<HTMLElement>,
  ) => {
    if (e.target === e.currentTarget) {

      setShowWarningEdit(false);
    }
  };
      console.log(docDatas[0].contentData)

    const handleSaveEditorModal = () => {
      setShowSaveEditorModal(true);
    };
    const hideSaveEditorModal = (e: React.MouseEvent<HTMLElement>) => {
      if (e.target === e.currentTarget) {
        setShowSaveEditorModal(false);
  
      }
    };

// drag n drop
const handleSubTitleReorder = (index: number, newSubTitles: SubTitle[]) => {
  const updatedDocDatas = [...docDatas];
  updatedDocDatas[index].subTitle = newSubTitles;
  setDocDatas(updatedDocDatas);
};

const [items, setItems] = useState([0, 1, 2, 3])
  return (
    <div className="flex h-full min-h-screen bg-neutral-100">
      {/* Doc side bar */}
      <div className="px-3 pt-6 pb-24 h-full w-[20%] bg-white shadow border fixed z-40 overflow-y-scroll">
      <h1 className=" w-[95%] ml-2 text-black text-3xl font-normal  ">Documentation</h1>
      
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
        <Reorder.Group axis="y" values={docDatas} onReorder={setDocDatas}>
        {docDatas.map((doc, index) => (
           <Reorder.Item key={doc.id} value={doc} className="">
          <div key={index} className="flex justify-between items-center mb-2">
            {docDatas[index].showInput === false ? (
              <div className="w-full">
                <div className=" flex  justify-between">
                  <span
                    onClick={() => NavigationToContent(index)}
                    className="py-2 flex-1 pl-3 whitespace-nowrap text-lg font-semibold hover:bg-gray-100 rounded-lg  gap-3 cursor-pointer"
                  >
                    {doc.title}
                  </span>
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
            onReorder={(newSubTitles) => handleSubTitleReorder(index, newSubTitles)}
          >
                    {docDatas[index]?.subTitle?.map((subTitle, subIndex) => (
                     <Reorder.Item key={subTitle.subId} value={subTitle} className="">
                      <div>
                        {docDatas[index].subTitle[subIndex].showInput ===
                        false ? (
                          <div className="flex " key={subIndex}>
                            <span
                              onClick={() =>
                                NavigationToContent(index, subIndex)
                              }
                              className="py-1 pl-14 flex w-full text-gray-600 justify-between hover:bg-gray-100 rounded-lg  gap-3 cursor-pointer"
                            >
                              {subTitle.name}
                            </span>
                            <MoreOutlined
                              onClick={(e) =>
                                showSubEditOptionModal(e, index, subIndex)
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
                              value={docDatas[index].subTitle[subIndex].text}
                              onChange={(e) => {
                                const newTitleComponentData = [...docDatas];
                                newTitleComponentData[index].subTitle[
                                  subIndex
                                ].text = e.target.value;
                                setDocDatas(newTitleComponentData);
                              }}
                              onKeyDown={(e) =>
                                handleSubInputKeyDown(e, index, subIndex)
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
                                    handleEditSubTitleClick(index, subIndex);
                                    const updatedTitleModals = [...docDatas];
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
                                    const updatedTitleModals = [...docDatas];
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
                                hideSubEditOptionModal(e, index, subIndex)
                              }
                            ></div>
                          </div>
                        ) : null}
                        {/* show delete modal */}
                        {/* edit modal (rename ,delete) */}
                        {docDatas[index].subTitle[subIndex].showDelete ===
                        true ? (
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
                                      hideSubDeleteModal(e, index, subIndex)
                                    }
                                    >
                                  Cancel
                                  </Button>
                                 
                                  <Button
                                    variant="contained"
                                    size="large"
                                    color='error'
                                    onClick={() =>
                                      handleSubTitleDelete(index, subIndex)
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
                    ))}
                  </Reorder.Group>
                  </ul>
                  <div   onClick={() => handleSubTitleAdd(index)}
                  className="py-1 pl- flex w-full    text-blue-700 whitespace-nowrap  hover:bg-gray-100 rounded-lg  cursor-pointer px-4 my-2 ">
                    <span
                      className="text-blue-700"
                    

                    >
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
              <div className="flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div
                  style={{
                    top: doc.editPosition.top,
                    left: doc.editPosition.left,
                  }}
                  className="z-50 border-0 rounded-lg relative flex flex-col w-fit h-fit  py-2 bg-white "
                >
                  <ul>
                    <li
                      className="cursor-pointer rounded-lg  hover:bg-gray-100  group focus:ring-4 focus:bg-blue-300 px-4 py-2"
                      onClick={() => {
                        handleEditClick(index);
                        const updatedTitleModals = [...docDatas];
                        updatedTitleModals[index].showEditModal = false;
                        setDocDatas(updatedTitleModals);
                      }}
                    >
                      <EditOutlined />
                      rename
                    </li>
                    <li
                      onClick={() => {
                        showDeleteModal(index);
                        // handleTitleDelete(index);
                        // set modal to false
                        const updatedTitleModals = [...docDatas];
                        updatedTitleModals[index].showEditModal = false;
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
                  onClick={(e) => hideEditOptionModal(e, index)}
                ></div>
              </div>
            ) : null}
            {/* show delete modal */}
            {/* edit modal (rename ,delete) */}
            {docDatas[index].showDeleteModal === true ? (
              <>
                <div
                  className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                  onClick={(e) => hideDeleteModal(e, index)}
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
                        onClick={(e) => hideDeleteModal(e, index)}
                        >
                        Cancel
                      </Button>
                       <Button
                          variant="contained"
                          size="large"
                          color='error'
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

      {/* content container */}
      <div className="w-[80%] ml-auto px-2 flex flex-col items-center pb-32  h-full min-h-screen bg-white ">
        <div className="w-full justify-self-center relativ ">
          {showTextEditor === true ? (
            <div>
              <div className="pr-12 w-[80%] h-[12%]  bg-white border border-zinc-300 fixed bottom-0 right-0 flex justify-between items-center pl-2">
                <Button
                variant="contained"
                size="large"
                color='error'
                  onClick={() => {
                    if (!showTextEditor) {
                    } else {
                      setShowWarningEdit(true);
                    }
                  }}
                >
                  <SaveOutlined />
                  Discard Change
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
                    handleSaveEditorModal()
                  }
                >
                  <SaveOutlined />Save Content
                </Button>
              </div>
              <Editor
                apiKey="ncaou3be6pfqi22ceukdz7cyc2cf3nz3qhj33rqb8b5j8kxy"
                init={{
                  plugins:
                  // "" ,
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                  tinycomments_mode: "embedded",
                  tinycomments_author: "Author name",
                  mergetags_list: [
                    { value: "First.Name", title: "First Name" },
                    { value: "Email", title: "Email" },
                  ],

                  ai_request: (request, respondWith) =>
                    respondWith.string(() =>
                      Promise.reject("See docs to implement AI Assistant")
                    ),
                }}
                value={value}
                onInit={(evt, editor) => {
                  setText(editor.getContent());
                }}
                onEditorChange={handleEditorChange}
                // initialValue={value}
                
              />
            </div>
          ) : (
            <div>
              <div className="pr-12 w-full h-[12%]  bg-white border border-zinc-300 fixed bottom-0 right-0 flex justify-end items-center">
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
                      EditContent(editAtIndex[0].index, editAtIndex[0].subIndex)
                    }
                >
                <EditOutlined />
                Edit Document Content
                </Button>
              </div>
              <div
                className="pt-5 pl-8"
                dangerouslySetInnerHTML={{ __html: currentPageData }}
              />
            </div>
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
                color='error'
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
                        onClick={() =>       SaveEditContent(
                          editAtIndex[0].index,
                          editAtIndex[0].subIndex
                        )}
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