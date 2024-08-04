import { EditFilled, MoreOutlined } from '@ant-design/icons';
import { Button, TextField } from '@mui/material';
import { Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles


interface SubTitle {
  name: string;
}

interface DocData {
  title: string;
  subTitle: SubTitle[] | null;
}

const Docs = () => {
  const [docDatas, setDocDatas] = useState<DocData[]>([
    { title: "AI System Garden", subTitle: [{ name: "tutorial" }] },
    { title: "Workspaces", subTitle: null }
  ]);
  const [titleDocData, setTitleDocData] = useState(Array(docDatas.length).fill(false).map(() => ({showEditModal:false, showInput: false, text: "" ,showDeleteModal:false,subTitle:[null]})));
 
  const buttonRefs = useRef<(HTMLElement | null)[]>([]);
  const getStyle = (index: number) => {
    const element = buttonRefs.current[index];
    if (!element) return {}; // Return empty object if element is not available
  
    const rect = element.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    };
  };
  // console.log("docData:",docDatas,"Title:",titleDocData);

  // Edit Title Function handler
  const handleTitleAdd =()=>{
    setDocDatas([...docDatas,{title:"New Heading" ,subTitle:null }])
    setTitleDocData((titleDocData) => [...titleDocData, { showEditModal:false,showInput: false, text: "" ,showDeleteModal:false,subTitle:[null]}]);
  };
  
  const handleTitleDelete =(index:number) =>{
    const docDataList = [...docDatas]
    docDataList.splice(index,1)
    setDocDatas(docDataList)
    const titleDatalist = [...titleDocData]
    titleDatalist.splice(index,1)
    setTitleDocData(titleDatalist)

  }
    const handleEditClick = (index: number) => {
      // show textinput === index param
      const showTextInput = [...titleDocData];
      showTextInput[index].showInput = true;
      setTitleDocData(showTextInput);
      // set text input to match with title
      const updatedTextInput = [...titleDocData];
      updatedTextInput[index].text = docDatas[index].title;
      setTitleDocData(updatedTextInput);
    };

    const handleTitleSave = (index: number) => {
      // save title input to docdata
      const updatedTitles = [...docDatas];
      const updatedTitleDocData = [...titleDocData];
      updatedTitles[index].title = updatedTitleDocData[index].text;
      setDocDatas(updatedTitles);
      setTitleDocData(updatedTitleDocData);
      // clear txt input 
      updatedTitleDocData[index].text = "";
      // set input show to false
      const updatedTitleModals = [...titleDocData];
      updatedTitleModals[index].showInput = false;
      setTitleDocData(updatedTitleModals);

    };

   const handleKeyDown = (event: React.KeyboardEvent,index:number) => {
    if (event.key === 'Enter') {
      handleTitleSave(index);

    }
  };
 

  const showModal = (index :number)=>{
    // show title setting modal
    const UpdatedTitleModals = [...titleDocData];
    UpdatedTitleModals[index].showEditModal = true;
    setTitleDocData(UpdatedTitleModals);
  }
  
  const hideModal = (e: React.MouseEvent<HTMLElement>, index: number)=>{
    if (e.target === e.currentTarget) {
    const updatedTitleModals = [...titleDocData];
    updatedTitleModals[index].showEditModal = false;
    setTitleDocData(updatedTitleModals);

    }
  }

  const showDeleteModal = (index :number)=>{
    // show title setting modal
    const UpdatedTitleModals = [...titleDocData];
    UpdatedTitleModals[index].showDeleteModal = true;
    setTitleDocData(UpdatedTitleModals);
  }

  const hideDeleteModal =  (e: React.MouseEvent<HTMLElement>, index: number) => {
    if (e.target === e.currentTarget) {
   const UpdatedTitleModals = [...titleDocData];
    UpdatedTitleModals[index].showDeleteModal = false;
    setTitleDocData(UpdatedTitleModals);
  };
};


  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      titleDocData.forEach((data, index) => {
        if (data.showInput) {
          handleTitleSave(index);
        }
      });
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [titleDocData]);

  // sub title handle here
  const handleSubTitleAdd = (index: number) => {
    // Create a new array with the new subtitle added
    const updatedDocDatas = [...docDatas];
  
    // Check if subTitle is null or not, if null, initialize it as an empty array
    if (updatedDocDatas[index].subTitle === null) {
      updatedDocDatas[index].subTitle = [];
    }
  
    // Add the new subtitle
    updatedDocDatas[index].subTitle.push({ name: "New Subtitle" });
  
    // Update state with the new array
    setDocDatas(updatedDocDatas);
  };

  const handleSubTitleDelete = (docIndex: number, subIndex: number) => {
    // Create a new array with the updated subtitle list
    const updatedDocDatas = [...docDatas];
  
    // Check if the document index is valid and has subTitles
    if (updatedDocDatas[docIndex] && updatedDocDatas[docIndex].subTitle) {
      // Remove the subtitle at the given subIndex
      updatedDocDatas[docIndex].subTitle.splice(subIndex, 1);
  
      // If subTitle becomes empty, you might want to set it to null
      if (updatedDocDatas[docIndex].subTitle.length === 0) {
        updatedDocDatas[docIndex].subTitle = null;
      }
  
      // Update state with the new array
      setDocDatas(updatedDocDatas);
    }
  };
  



  return (
    <div className="flex h-full min-h-screen bg-neutral-100">
      {/* Doc side bar */}
      <div className="px-3 pt-6 pb-24 h-full w-[20%] bg-white shadow border fixed z-40 overflow-y-scroll">
        {docDatas.map((doc, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            {titleDocData[index].showInput === false ? (
                <div className='w-full'>
              <div className="flex w-full py-2 justify-between hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800 gap-3" >
                <div className="mr-2">
                  <a href='#' className='flex-1 ms-3 whitespace-nowrap text-lg font-medium'>{doc.title}</a>
                </div>
                <MoreOutlined
                  onClick={() => showModal(index)}
                  style={{ cursor: "pointer" }}
                />
              </div>
                <div className=''>
                    <ul>
                    {doc.subTitle && doc.subTitle.length > 0 && (
                      doc.subTitle
                      .filter((subDoc): subDoc is { name: string } => subDoc !== null).map((subDoc, subIndex) => (
                    <div className='grop relative rounded-lg active:opacity-90 bg-token-sidebar-surface-secondary'>
                      <a key={subIndex}  href='#'  className="py-1 pl-14 flex w-fulljustify-between hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800 gap-3">{subDoc.name}</a>
                      <Button variant="contained" onClick={()=>handleSubTitleDelete(index, subIndex)}> delete sub </Button>        
                    </div>
                  ))   
                    )}
        
                  </ul>
                  <Button variant="contained" onClick={()=>handleSubTitleAdd(index)}>
          Add SubHeading
        </Button>
                </div>
              </div>
              
            ) : (
              <div className="w-full h-fit bg-red ">
                <TextField
                  required
                  id={`title-${index}`}
                  label="ใส่ชื่อที่ต้องการแก้ไข"
                  inputProps={{ maxLength: 20 }}
                  value={titleDocData[index].text}
                  onChange={(e) => {
                    const newTitleDocData = [...titleDocData];
                    newTitleDocData[index].text = e.target.value;
                    setTitleDocData(newTitleDocData);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={wrapperRef}/>
              </div>
            )}
              {/* edit modal (rename ,delete) */}
            {titleDocData[index].showEditModal === true ? (
              <div className="flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div
                  style={getStyle(index)} 
                  className="z-50 border-0 rounded-lg relative flex flex-col w-fit h-fit  py-2 bg-white "
                >
                  <ul>
                    <li
                      className="cursor-pointer rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group focus:ring-4 focus:bg-blue-300 px-4 py-2"
                      onClick={() => {
                        handleEditClick(index);
                        const updatedTitleModals = [...titleDocData];
                        updatedTitleModals[index].showEditModal = false;
                        setTitleDocData(updatedTitleModals);
                      }}
                    >
                      rename
                    </li>
                    <li
                      onClick={() => {
                        showDeleteModal(index)
                        // handleTitleDelete(index);
                        // set modal to false
                        const updatedTitleModals = [...titleDocData];
                        updatedTitleModals[index].showEditModal = false;
                        setTitleDocData(updatedTitleModals);
                        
                      }}
                      className="cursor-pointer rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group focus:ring-4 focus:bg-blue-300 px-4 py-2"
                    >
                      delete
                    </li>
                  </ul>
                </div>
                <div
                  className=" opacity-25 fixed inset-0 z-40 bg-black"
                  onClick={(e) => hideModal(e, index)}
                ></div>
              </div>
            ) : null}
          {/* show delete modal */}
             {/* edit modal (rename ,delete) */}
             {titleDocData[index].showDeleteModal === true ? (
              <>
              <div
                className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                onClick={(e)=>hideDeleteModal(e,index)}
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
                      onClick={(e)=>hideDeleteModal(e,index)}
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
        <Button variant="contained" onClick={handleTitleAdd}>
          Add Heading
        </Button>
      </div>

      {/* content container */}
      <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
      </div>
    </div>
  );
};

export default Docs;