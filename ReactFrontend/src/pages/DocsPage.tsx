import { DeleteOutlined, EditOutlined, MoreOutlined, PlusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Reorder } from "framer-motion"
import 'react-quill/dist/quill.snow.css'; // import styles
import { Editor } from '@tinymce/tinymce-react';
import DocList from '../components/docs/DocList';
import ContentViewer from '../components/docs/ContentViewer';
import ContentEditor from '../components/docs/ContentEditor';
import axios from 'axios';

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
  const [showWarningEdit,setShowWarningEdit] = useState(false);
  const [editAtIndex, setEditAtIndex] = useState<EditAtIndexType[]>([{ index: 0, subIndex: null }]);
  const [currentPageData, setCurrentPageData] = useState(
    docDatas[0].contentData
  );
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
    } else {
      setCurrentPageData(text);
      const    updatedDocDatas = [...docDatas];
      updatedDocDatas[index].contentData  = text
      setDocDatas(updatedDocDatas)
    }
    setShowTextEditor(false);
    setShowSaveEditorModal(false);
  };


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

       const [loading, setLoading] = useState(true);
        const fetchData = async () => {
          try {
            // เรียก API หลายตัวพร้อมกัน
            const [myWorkspacesResponse,inviteWorkspacesResponse] = await Promise.all([
              axios.get(
                `${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/my-workspaces`,
                {
                  withCredentials: true,
                }
              ),
              axios.get(
                `${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/invite-workspaces`,
                {
                  withCredentials: true,
                }
              ),
            ]);
            setMyWorkspace(myWorkspacesResponse.data);
            setInvitedWorkspace(inviteWorkspacesResponse.data);
          } catch (error) {
            console.error("Error fetching data!", error);
          } finally {
            setLoading(false);
          }
        };
      
        useEffect(() => {
          fetchData();
        }, []);
      
        if (loading) {
          return <div>Loading...</div>;
        }
        

  return (
    <div className="flex h-full min-h-screen bg-neutral-100">
  

        {/* Doc SideBar Left */}
        <DocList/>
    

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
        <ContentViewer currentPageData={currentPageData} onEdit={handleEdit} />
      )}
    </div>
        {/* <div className="w-full justify-self-center relative">
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
                  "" ,
                  // "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
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
        </div> */}

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