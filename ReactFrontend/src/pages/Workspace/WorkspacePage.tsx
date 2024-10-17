import React, { useEffect, useState } from "react";

import WorkspaceCard from "../../components/card/WorkspaceCard";
import InvitedCard from "../../components/card/InvitedCard";
import CreateWorkspace from "../../components/popup/CreateWorkspace";

import {DownOutlined, UpOutlined}  from '@ant-design/icons';

// mockup data
import MyWorkspaceData from "../../data/WorkspaceData";
import { Link } from "react-router-dom";
import MiniFooter from "../../components/MiniFooter";
import axios from "axios";
import { Button } from "@mui/material";

function WorkspacePage() {
  // my workspace show
  const [myWorkspace, setMyWorkspace] = useState([]); 
  const [invitedWorkspace, setInvitedWorkspace]= useState([]); 
  const [showWorkspaceRow, setShowWorkspaceRow] = useState(false); // เริ่มต้นโชว์แถวที่ 2
  const [showModal, setShowModal] = useState(false);
  const toggleWorkspaceRow = () => {
    setShowWorkspaceRow(!showWorkspaceRow); // สลับค่าของ showSecondRow กับ true/false
  };
  // invited workspace show 
  const [showInvitedRow, setShowInvitedRow] = useState(false); 
  const toggleInvitedRow = () => {
    setShowInvitedRow(!showInvitedRow);
    console.log(showInvitedRow)
  };


  const fetchWorkspaces = () => {
    axios.get("http://localhost:3000/workspaces/")
      .then(response => {
        setMyWorkspace(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the workspace data!", error);
      });
  };

  useEffect(() => {
    fetchWorkspaces(); // ดึงข้อมูล workspace เมื่อ component โหลดครั้งแรก
  }, []);



  console.log(myWorkspace)

  return (
      <>
      <div className=" bg-neutral-100 flex items-center justify-center h-full pb-32">
        {/* popup */}
        <CreateWorkspace showModal={showModal} setShowModal={setShowModal} fetchWorkspaces={fetchWorkspaces} />
        <div className=" flex flex-col items-center justify-center w-full ">
          {/* My Worksspace Container */}
          <div className="mt-4 h-fit w-11/12 bg-white rounded-[15px]  items-center relative  p-6 ">
            <div className="flex  justify-between  mb-5">
              <h1  className="ml-5  text-3xl font-medium tracking-tight  text-indigo-900">
                My Workspace
              </h1> 
              <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#4f46e5",
                "&:hover": {
                  backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                },
              }}
              onClick={() => setShowModal(true)}
              >
             + สร้าง Workspace
                </Button>
              </div>

              <div className=" w-[95%] h-[0px] border border-zinc-300 mx-auto" />
              {/* show more bar */}
              <div onClick={toggleWorkspaceRow} className=" mx-auto my-2 w-[95%] flex items-center space-x-2 px-2 hover:bg-gray-100 rounded-[5px]" >
                {showWorkspaceRow ?(
                  <div className="">
                  <DownOutlined style={{color:'#999',fontSize:"24px"}}/>
                  </div>
                ):( <UpOutlined style={{color:'#999',fontSize:"24px"}}/>)
                }
                <p className="text-center text-zinc-500 text-xl leading-[49px]">  {showWorkspaceRow ? 'ย่อรายละเอียด' : 'แสดงเพิ่มเติม'}</p>
                <div className="w-[85%] h-[0px] border border-zinc-300"/>
              </div>
              {/* My wokspace Card group */}
              <div className={` grid grid-cols-3 pb-8 pt-2 `}>  
                {myWorkspace.map((data, index)=>(
              <div key={index} className={`mb-4 ${!showWorkspaceRow && index >= 3 ? 'hidden' : ''}`}>
             
                   <Link to={`/workspaces/${data.id}/project-list`}>
                  <WorkspaceCard  id={data.id} name={data.name} desc={data.description} 
                  members={data.members} updatedAt={data.updatedAt} createAt={data.createdAt} /> 
                   </Link>
              </div>
                ))}
              </div>
          </div>
         

          {/* Invited Worksapce Container */}
          <div className="mt-8 h-fit w-11/12 bg-white rounded-[15px]  justify-self-center relative p-6">
              <h1  className="ml-5 mb-5 text-3xl font-medium tracking-tight 
              text-indigo-900  ">Invited Workspace
              </h1>
    
              <div className="w-11/12 h-[0px] border border-zinc-300 mx-auto"></div>
              <div onClick={toggleInvitedRow} className="mx-auto my-2 w-[95%] flex items-center space-x-2 px-2 hover:bg-gray-100 rounded-[5px]" >
              {showInvitedRow ?(
                  <div className="">
                  <DownOutlined style={{color:'#999',fontSize:"24px"}}/>
                  </div>
                ):( <UpOutlined style={{color:'#999',fontSize:"24px"}}/>)
                }
                <p className="text-center text-zinc-500 text-xl leading-[49px]">  {showInvitedRow ? 'ย่อรายละเอียด' : 'แสดงเพิ่มเติม'}</p>
                <div className="w-[85%] h-[0px] border border-zinc-300"></div>
              </div>
            {/* invited wokspace Card */}
            <div className={`grid grid-cols-3 pb-8 pt-2`}>  
                {MyWorkspaceData.map((data, index)=>(
              <div key={index} className={`mb-4 ${!showInvitedRow && index >= 3 ? 'hidden' : ''}`}>
                <Link to={`/workspaces/${data.id}/project-list`}>
                  <InvitedCard  id={data.id} name={data.name} desc={data.description} members={[...data.member]} createAt={data.createAt} updateAt={data.updateAt} /> 
                </Link>
              </div>
                ))}
              </div>

          </div>
        </div>
      </div>
      <MiniFooter></MiniFooter>
    </>
  );
};

export default WorkspacePage;
