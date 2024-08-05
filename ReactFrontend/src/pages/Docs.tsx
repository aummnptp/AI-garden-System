import { EditFilled, MoreOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, TextField } from '@mui/material';
import { Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles


interface SubTitle {
  name: string;
  showEdit: boolean;
  showInput: boolean;
  showDelete: boolean;
  text:string;
}

interface SubTitleComponent {
  name: string;
  showEdit: boolean;
  showInput: boolean;
  showDelete: boolean;
  text:string;
}

interface DocData {
  title: string;
  showEditModal: boolean;
  showInput: boolean;
  showDeleteModal:boolean;
  text: string;
  subTitle: SubTitle[];
}
interface titleComponentData {
  name: string;
  showEditModal: boolean;
  showInput: boolean;
  showDeleteModal:boolean;
  text: string;
  subTitle: SubTitleComponent[] | null;
}


const Docs = () => {
  // ข้อมูลของ Docdata
  // const [docDatas, setDocDatas] = useState<DocData[]>([
  //   { title: "AI System Garden", subTitle: null },
  //   { title: "Workspaces", subTitle: null }
  // ]);


  const [docDatas, setDocDatas] = useState<DocData[]>([
    { title: "AI System Garden",
      showEditModal: false,
      showInput: false,
      showDeleteModal: false,
      text: "", subTitle: [] },
    { title: "Workspaces",
      showEditModal: false,
      showInput: false,
      showDeleteModal: false,
      text: "",subTitle: [] }
  ]);
   // ข้อมูลของ Title Manage component เช่น โชว์ edit โชว์ input โชว์ delete 
  const [titleComponentData, setTitleComponentData] = useState<titleComponentData[]>(
    Array(docDatas.length).fill(null).map(() => ({
      showEditModal: false,
      showInput: false,
      showDeleteModal: false,
      text: "",
      name: "", 
      subTitle: [] 
    }))
  );


  console.log("docData:",docDatas);
  console.log("TitleComponen:",titleComponentData);

  // Edit Title Function handler
  const handleTitleAdd = () => {
    setDocDatas([...docDatas, { title: "New Heading",showEditModal: false,
      showInput: false,
      showDeleteModal: false,
      text: "", subTitle: [] }]);
  };
  
  const handleTitleDelete =(index:number) =>{
    const docDataList = [...docDatas]
    docDataList.splice(index,1)
    setDocDatas(docDataList)

  }
  // 11
    const handleEditClick = (index: number) => {
      // show textinput === index param
      const showTextInput = [...docDatas];
      showTextInput[index].showInput = true;
      setDocDatas(showTextInput);
      // set text input to match with title
      const updatedTextInput = [...docDatas];
      updatedTextInput[index].text = docDatas[index].title;
      setDocDatas( updatedTextInput);
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

   const handleInputKeyDown = (event: React.KeyboardEvent,index:number) => {
    if (event.key === 'Enter') {
      handleTitleSave(index);

    }
  };
  const handleSubInputKeyDown = (event: React.KeyboardEvent,index:number,subIndex:number) => {
    if (event.key === 'Enter') {
      handleSubTitleSave(index, subIndex);

    }
  };
 

  const showEditOptionModal = (index :number)=>{
    // show title setting modal
    const UpdatedTitleModals = [...docDatas];
    UpdatedTitleModals[index].showEditModal = true;
    setDocDatas(UpdatedTitleModals);
  }
  
  const hideEditOptionModal = (e: React.MouseEvent<HTMLElement>, index: number)=>{
    if (e.target === e.currentTarget) {
    const updatedTitleModals = [...docDatas];
    updatedTitleModals[index].showEditModal = false;
    setDocDatas(updatedTitleModals);

    }
  }


  
  const showSubEditOptionModal = (index :number,subIndex:number)=>{
    // show title setting modal
    const UpdatedTitleModals = [...docDatas];
    UpdatedTitleModals[index].subTitle[subIndex].showEdit = true;
    setDocDatas(UpdatedTitleModals);
  }
  
  const hideSubEditOptionModal = (e: React.MouseEvent<HTMLElement>, index: number,subIndex :number)=>{
    if (e.target === e.currentTarget) {
    const updatedTitleModals = [...docDatas];
    updatedTitleModals[index].subTitle[subIndex].showEdit = false;
    setDocDatas(updatedTitleModals);

    }
  }

  const showDeleteModal = (index :number)=>{
    // show title setting modal
    const UpdatedTitleModals = [...docDatas];
    UpdatedTitleModals[index].showDeleteModal = true;
    setDocDatas(UpdatedTitleModals);
  }

  const hideDeleteModal =  (e: React.MouseEvent<HTMLElement>, index: number) => {
    if (e.target === e.currentTarget) {
   const UpdatedTitleModals = [...docDatas];
    UpdatedTitleModals[index].showDeleteModal = false;
    setDocDatas(UpdatedTitleModals);
  };
};
const showSubDeleteModal = (index :number,subIndex:number)=>{
  // show title setting modal
  const UpdatedTitleModals = [...docDatas];
  UpdatedTitleModals[index].subTitle[subIndex].showDelete = true;
  setDocDatas(UpdatedTitleModals);
}

const hideSubDeleteModal =  (e: React.MouseEvent<HTMLElement>, index: number,subIndex:number) => {
  if (e.target === e.currentTarget) {
 const UpdatedTitleModals = [...docDatas];
  UpdatedTitleModals[index].subTitle[subIndex].showDelete = false;
  setDocDatas(UpdatedTitleModals);
};
};

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const subwrapperRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {

    
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      docDatas.forEach((data, index) => {
        if (data.showInput) {
          handleTitleSave(index);
        }
      });
    }
    if (subwrapperRef.current && !subwrapperRef.current.contains(event.target as Node)) {
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [docDatas]);

  // sub title handle here
  const handleSubTitleAdd = (index: number) => {
    const updatedDocDatas = [...docDatas];
    // check ข้อมูลใน docdata
    if (updatedDocDatas[index].subTitle === null) {
      updatedDocDatas[index].subTitle = [];
    }
    // check ข้อมูลใน title component
    updatedDocDatas[index].subTitle.push({ name: "New Subtitle" ,  
      showEdit: false,
      showInput: false,
      showDelete: false,
      text:"",});
 
  setDocDatas(updatedDocDatas);
  };



  const handleSubTitleDelete = (docIndex: number, subIndex: number) => {

    const updatedDocDatas = [...docDatas];
    if (updatedDocDatas[docIndex] && updatedDocDatas[docIndex].subTitle) {
      updatedDocDatas[docIndex].subTitle.splice(subIndex, 1);
      if (updatedDocDatas[docIndex].subTitle.length === 0) {
        updatedDocDatas[docIndex].subTitle =  [];
      }
      setDocDatas(updatedDocDatas);
    }
    
  };
  const handleSubTitleSave = (index: number, subIndex: number) => {
    // Create copies of the state arrays
    const updatedTitles = [...docDatas];

    
    // Check if the necessary data exists
    if (updatedTitles[index] &&updatedTitles[index].subTitle) {
      updatedTitles[index].subTitle[subIndex].name =  updatedTitles[index].subTitle[subIndex].text;
      setDocDatas(updatedTitles);
      console.log ("save As:", updatedTitles[index].subTitle[subIndex].name)
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
    TextInput[index].subTitle[subIndex].text = docDatas[index].subTitle[subIndex].name;
    setDocDatas(updatedTextInput);
  }
  };


  return (
    <div className="flex h-full min-h-screen bg-neutral-100">
      {/* Doc side bar */}
      <div className="px-3 pt-6 pb-24 h-full w-[20%] bg-white shadow border fixed z-40 overflow-y-scroll">
        <div className="flex justify-end">
          <Button variant="contained" onClick={handleTitleAdd}>
            Add Heading
          </Button>
        </div>
        {docDatas.map((doc, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            {docDatas[index].showInput === false ? (
              <div className="w-full">
                <div className="flex w-full py-2 justify-between hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800 gap-3">
                  <div className="mr-2">
                    <a href="#"className="flex-1 ms-3 whitespace-nowrap text-lg font-medium">
                      {doc.title}
                    </a>
                  </div>
                  <MoreOutlined
                    onClick={() => showEditOptionModal(index)}
                    style={{ cursor: "pointer" }}

                  />
                </div>
                {/* subtitle list */}
                <div className="">
                  <ul>
                    {docDatas[index]?.subTitle?.map(
                      (subTitle, subIndex) =>
                      <div>
                      {docDatas[index].subTitle[subIndex].showInput === false ? (
                          <div className="flex" key={subIndex} >
                            <a
                              href="#"
                              className="py-1 pl-14 flex w-full justify-between hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800 gap-3"
                            >
                              {subTitle.name}
                            </a>
                            <MoreOutlined
                              onClick={() =>
                                showSubEditOptionModal(index, subIndex)
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
                              newTitleComponentData[index].subTitle[subIndex].text = e.target.value;
                              setDocDatas(newTitleComponentData);
                            }}
                            onKeyDown={(e) => handleSubInputKeyDown(e, index,subIndex)}
                            ref={subwrapperRef}
                          />
                        </div>
                        )}
                             {/* edit modal (rename ,delete) */}
            {docDatas[index].subTitle[subIndex].showEdit === true ? (
              <div className="flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div
              
                  className="z-50 border-0 rounded-lg relative flex flex-col w-fit h-fit  py-2 bg-white "
                >
                  <ul>
                    <li
                      className="cursor-pointer rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group focus:ring-4 focus:bg-blue-300 px-4 py-2"
                      onClick={() => {
                        handleEditSubTitleClick(index,subIndex);
                        const updatedTitleModals = [...docDatas];
                        updatedTitleModals[index].subTitle[subIndex].showEdit = false;
                        setDocDatas(updatedTitleModals);
                      }}
                    >
                      rename
                    </li>
                    <li
                      onClick={() => {
                        showSubDeleteModal(index,subIndex);
                        // handleTitleDelete(index);
                        // set modal to false
                        const updatedTitleModals = [...docDatas];
                        updatedTitleModals[index].subTitle[subIndex].showEdit = false;
                        setDocDatas(updatedTitleModals);
                      }}
                      className="cursor-pointer rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group focus:ring-4 focus:bg-blue-300 px-4 py-2"
                    >
                      delete
                    </li>
                  </ul>
                </div>
                <div
                  className=" opacity-25 fixed inset-0 z-40 bg-black"
                  onClick={(e) => hideSubEditOptionModal(e, index,subIndex)}
                ></div>
              </div>
            ) : null}
            {/* show delete modal */}
            {/* edit modal (rename ,delete) */}
            {docDatas[index].subTitle[subIndex].showDelete === true ? (
              <>
                <div
                  className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                  onClick={(e) => hideSubDeleteModal(e, index,subIndex)}
                >
                  <div className="relative w-5/12 my-6 mx-auto">
                    {/*card */}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/*header*/}
                      <div className=" flex items-center justify-between p-5 border-b border-solid border-blueGray-200 rounded-t ">
                        <h1
                          className=" text-3xl font-semibold text-center p-5 ml-5 mb-2 tracking-tight 
                  text-indigo-900 dark:text-white"
                        >
                          <span className="mt-5 absolute inset-x-0 top-0 text-center">
                            คุณยืนยันที่จะลบหัวข้อย่อยนี้ใช่ไหม
                          </span>
                        </h1>
                    
                      </div>
                      {/*body*/}
                      {/*footer*/}
                      <div className=" mx-auto flex items-center justify-end p-6">
                        <button
                          className="bg-indigo-600 text-white hover:bg-indigo-700  font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => handleSubTitleDelete(index,subIndex)}
                        >
                          ยืนยัน
                        </button>

                        <button
                          className="bg-indigo-600 text-white hover:bg-indigo-700  font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={(e) => hideSubDeleteModal(e, index,subIndex)}
                        >
                          ไม่
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
              </>
            ) : null}
                    </div>
                    )}
                  </ul>
                  <a href="#" onClick={() => handleSubTitleAdd(index)}  className="flex-1 ms-3 text-blue-700 whitespace-nowrap text-lg font-normal hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800">
                  <PlusCircleOutlined />
                    Add SubHeading
                </a>
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
                  className="z-50 border-0 rounded-lg relative flex flex-col w-fit h-fit  py-2 bg-white "
                >
                  <ul>
                    <li
                      className="cursor-pointer rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group focus:ring-4 focus:bg-blue-300 px-4 py-2"
                      onClick={() => {
                        handleEditClick(index);
                        const updatedTitleModals = [...docDatas];
                        updatedTitleModals[index].showEditModal = false;
                        setDocDatas(updatedTitleModals);
                      }}
                    >
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
                      className="cursor-pointer rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group focus:ring-4 focus:bg-blue-300 px-4 py-2"
                    >
                      delete
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
                  text-indigo-900 dark:text-white"
                        >
                          <span className="mt-5 absolute inset-x-0 top-0 text-center">
                            คุณยืนยันที่จะลบหัวข้อนี้ใช่ไหม
                          </span>
                        </h1>
                        <button
                          className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                          onClick={() => console.log("hello")}
                        ></button>
                      </div>
                      {/*body*/}
                      {/*footer*/}
                      <div className=" mx-auto flex items-center justify-end p-6">
                        <button
                          className="bg-indigo-600 text-white hover:bg-indigo-700  font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => handleTitleDelete(index)}
                        >
                          ยืนยัน
                        </button>

                        <button
                          className="bg-indigo-600 text-white hover:bg-indigo-700  font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={(e) => hideDeleteModal(e, index)}
                        >
                          ไม่
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
              </>
            ) : null}
          </div>
        
        ))}
        
      </div>

      {/* content container */}
      <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen"></div>
    </div>
  );
};

export default Docs;