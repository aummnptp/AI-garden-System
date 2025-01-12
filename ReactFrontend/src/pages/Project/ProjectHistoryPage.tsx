import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProjectCard from "../../components/card/ProjectCard";
import ProjectData from "../../data/ProjectData";
import MiniFooter from "../../components/MiniFooter";
import Sidebar from "../../components/Sidebar";
import ImageUploader from "../../components/ImageUploader";
import { NoteAltOutlined, SpeakerNotesOffOutlined, SpeakerNotesOutlined, UploadFile } from "@mui/icons-material";
import axios from "axios";
import projectNoteData from "../../data/ProjectNoteData";

const ProjectHistoryPage = () => {
  const [historyTab, setHistoryTab] =useState<string>("Upload");
  const [workspaceDetail, setWorkspaceDetail] = useState([]); 
    const { workspaceId } = useParams<{ workspaceId?: string }>();
    if (typeof workspaceId === 'undefined') {
      // Handle the case where workspaceId is undefined
      return <div>No workspace ID provided</div>;
    }
    const id = parseInt(workspaceId, 10);
    const workspace = ProjectData.find(ws => ws.workspaceId === id);
    const fetchData = () => {
      axios.all([
        axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}`,
          {
            withCredentials: true,}
        ),
  
      ])
      .then(axios.spread((workspaceResponse) => {
        setWorkspaceDetail(workspaceResponse.data);
     
      }))
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
    };
    useEffect(() => {
      fetchData(); // ดึงข้อมูล workspace เมื่อ component โหลดครั้งแรก
    }, []);
    return (
      <>
        <div className="flex h-full min-h-screen bg-neutral-100">
          {/* side bar */}
          <Sidebar workspaceName={workspaceDetail.name}></Sidebar>
          {/* content container */}
          <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
            <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative">
              <h1 className="p-5 ml-5 mb-2 text-3xl font-medium tracking-tight text-indigo-900 ">
               Project History
              </h1>
              <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto" />
            <div className="mt-6 flex justify-start px-6 ">
              <a
                onClick={() => setHistoryTab("Upload")}
                className={`w-[50%]  border-b-2   inline-block  rounded-t-lg cursor-pointer px-4 py-2 text-center font-medium  ${
                  historyTab === "Upload"
                    ? "text-indigo-600 border-indigo-600  "
                    : " border-transparent text-gray-600 hover:border-gray-300"
                }`}
              >
               <UploadFile/>  ประวัติ Upload
              </a>

              <a
                onClick={() => setHistoryTab("Note")}
                className={`w-[50%]  border-b-2   inline-block  rounded-t-lg cursor-pointer px-4 py-2 text-center font-medium ${
                  historyTab === "Note"
                    ? "text-indigo-600 border-indigo-600"
                    : "  border-transparent text-gray-600  hover:border-gray-300"
                }`}
              >
               <NoteAltOutlined/>  ประวัติ Note
              </a>
            </div>
            </div>

            <div className="py-10  mt-4 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative pt-10 px-10 ">
            {historyTab === "Upload" ? (
              <div>
                <h1 className=" text-2xl font-normal  ">วันที่ 1 มกราคม 2024</h1>
                <div className="flex  items-center space-x-2 px-2 rounded-[5px]">
                  <text className=" text-lg font-normal  ">13.00 น.</text>
                  <div className="w-[80%] h-[0px] border border-zinc-300 mx-auto" />
                </div>

                <div className="flex items-center my-4 w-fit">
                  <img
                    className="w-10 h-10 rounded-full border-2"
                    src="/images/homeImage/profile.webp"
                  />
                  <div className="ml-2">
                    <text className="text-black text-lg font-normal">
                      John Doe
                    </text>
                    <text className="text-black text-lg font-normal"> 1 รูปภาพ</text>
                  </div>
                </div>

                <div className="flex flex-wrap">
                  <div  className=" mb-8">
                    <img
                      className="w-28 h-28 mr-6  border-2 object-cover"
                      src="/images/ai/dermatophyte.jpg"
                      />
                      <p>image_name</p>
                  </div>
                </div>


{/* row 2 ขึ้นไป */}
                <h1 className=" text-2xl font-normal  ">วันที่ 1 มกราคม 2024</h1>
                <div className="flex  items-center space-x-2 px-2 rounded-[5px]">
                  <text className=" text-lg font-normal  ">12.00 น.</text>
                  <div className="w-[80%] h-[0px] border border-zinc-300 mx-auto" />
                </div>

                <div className="flex items-center my-4 w-fit">
                  <img
                    className="w-10 h-10 rounded-full border-2"
                    src="/images/homeImage/profile.webp"
                  />
                  <div className="ml-2">
                    <text className="text-black text-lg font-normal">
                      John Doe
                    </text>
                    <text className="text-black text-lg font-normal"> 3 รูปภาพ</text>
                  </div>
                </div>

                <div className="flex flex-wrap">
                  <div  className=" mb-8">
                    <img
                      className="w-28 h-28 mr-6  border-2"
                      src="\images\testphoto.avif"
                      />
                      
                      <p>image_name</p>
                  </div>
                  <div  className=" mb-8">
                    <img
                      className="w-28 h-28 mr-6  border-2"
                      src="\images\testphoto.avif"
                      />
                      
                      <p>image_name</p>
                  </div>
                  <div  className=" mb-8">
                    <img
                      className="w-28 h-28 mr-6  border-2"
                      src="\images\testphoto.avif"
                      />
                      
                      <p>image_name</p>
                  </div>
                </div>
              </div>
                ):historyTab === "Note" ?(
                  <div>
                  <div className="flex  items-center space-x-2 px-2 rounded-[5px]">
                  <h1 className=" text-2xl font-normal  ">วันที่ 1 มกราคม 2024</h1>
                    <div className="w-[80%] h-[0px] border border-zinc-300 mx-auto" />
                  </div>
                  {/* card */}
                  {projectNoteData.map(note => (
                  <div className="px-4 border-2 rounded-lg w-[75%] my-4  h-fit  ">
                    <div className="flex justify-between w-full items-center  ">
                      <div className="flex items-center my-4 w-fit  ">
                        <img
                          className="w-10 h-10 rounded-full border-2"
                          src="/images/homeImage/profile.webp"
                          />
                        <div className="ml-2 ">
                          <text className="text-black text-lg font-normal">
                            John Doe
                          </text>
                        </div>
                      </div>
                        <text className=" text-lg font-normal  ">13.00 น.</text>
                    </div>
                  <div className="flex w-full   ">
                    <div  className="w-[20%]  mb-8 px-auto items-center ">
                      <img
                        className="w-36 h-36 object-cover"
                        src="/images/ai/dermatophyte.jpg"
                        />
                        <p>image_name</p>
                    </div>
                    <div className="  p-4 h-full w-[80%]   ">
                      <p className="text-indigo-800 text-2xl font-medium  "> 
                      < SpeakerNotesOutlined/>     หัวข้อ Note Example 
                          </p>
                          <text className="text-black text-lg font-normal"> 
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                          Nam eget vehicula felis, sit amet porta eros. 
                          Nunc vulputate nulla orci, vitae ultricies ante dapibus quis.
                       
                          </text>
                    </div>
                  </div>
                  </div>)
                  )}
                  
                  <div className="flex  items-center space-x-2 px-2 rounded-[5px]">
                  <h1 className=" text-2xl font-normal  ">วันที่ 1 มกราคม 2024</h1>
                    <div className="w-[80%] h-[0px] border border-zinc-300 mx-auto" />
                  </div>
                  {projectNoteData.map(note => (
                  <div className="px-4 border-2 rounded-lg w-[75%] my-4  h-fit  ">
                    <div className="flex justify-between w-full items-center  ">
                      <div className="flex items-center my-4 w-fit  ">
                        <img
                          className="w-10 h-10 rounded-full border-2"
                          src="/images/homeImage/profile.webp"
                          />
                        <div className="ml-2 ">
                          <text className="text-black text-lg font-normal">
                            John Doe
                          </text>
                        </div>
                      </div>
                        <text className=" text-lg font-normal  ">13.00 น.</text>
                    </div>
                  <div className="flex w-full   ">
                    <div  className="w-[20%]  mb-8 px-auto items-center ">
                      <img
                        className="w-36 h-36 "
                        src="\images\testphoto.avif"
                        />
                        <p>image_name</p>
                    </div>
                    <div className="  p-4 h-full w-[80%]   ">
                      <p className="text-indigo-800 text-2xl font-medium  "> 
                      < SpeakerNotesOutlined/>     หัวข้อ Note Example 
                          </p>
                          <text className="text-black text-lg font-normal"> 
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                          Nam eget vehicula felis, sit amet porta eros. 
                          Nunc vulputate nulla orci, vitae ultricies ante dapibus quis.
                       
                          </text>
                    </div>
                  </div>
                  </div>)
                  )}




                </div>

                ):null}
              </div>
          </div>
        </div>
        <MiniFooter />
      </>
    );
}

export default ProjectHistoryPage