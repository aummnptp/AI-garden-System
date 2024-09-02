import React, { useState } from "react";
// component
import WorkspaceCard from "../../components/card/WorkspaceCard";
import InvitedCard from "../../components/card/InvitedCard";
import CreateWorkspace from "../../components/popup/CreateWorkspace";

import {DownOutlined, UpOutlined}  from '@ant-design/icons';

// mockup data
import MyWorkspaceData from "../../data/WorkspaceData";
import { Link } from "react-router-dom";
import MiniFooter from "../../components/MiniFooter";

function Workspace() {
  // my workspace show
  const [showWorkspaceRow, setShowWorkspaceRow] = useState(false); // เริ่มต้นโชว์แถวที่ 2
  const toggleWorkspaceRow = () => {
    setShowWorkspaceRow(!showWorkspaceRow); // สลับค่าของ showSecondRow กับ true/false
  };
  // invited workspace show 
  const [showInvitedRow, setShowInvitedRow] = useState(false); 
  const toggleInvitedRow = () => {
    setShowInvitedRow(!showInvitedRow);
    console.log(showInvitedRow)
  };


  const [showModal, setShowModal] = useState(false);


  return (
    <>
      <div className=" bg-neutral-100 flex items-center justify-center h-full pb-32">

        {/* popup */}
        <CreateWorkspace showModal={showModal} setShowModal={setShowModal} />
        <div className=" flex flex-col items-center justify-center w-full ">
          {/* My Worksspace Container */}
          <div className="mt-16 h-fit w-11/12 bg-white rounded-[15px]  items-center relative ">
            
              <h1  className="  p-5 ml-5 mb-2 text-3xl font-medium tracking-tight  text-indigo-900  ">
                My Workspace
              </h1>
             
              {/* create button */}
              <button
              onClick={() => setShowModal(true)}
              type="button"
              className="h-fit w-fit text-white bg-indigo-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 
              font-medium rounded-[15px] text-sm px-5 py-2.5 me-2 mb-2 
              focus:outline-none  absolute top-0 right-0 my-6 mr-6">+ Create Workspace</button>

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
              <div className={` grid grid-cols-3 gap-4 w-fit pb-8 pt-2`}>  
                {MyWorkspaceData.map((data, index)=>(
              <div key={index} className={`mb-4 ${!showWorkspaceRow && index >= 3 ? 'hidden' : ''}`}>
                   <Link to={`/workspaces/${data.id}/project-list`}>
                  <WorkspaceCard  id={data.id} name={data.name} desc={data.desc} members={[...data.member]} createAt={data.createAt} updateAt={data.updateAt} /> 
                   </Link>
              </div>
                ))}
              </div>
          </div>
         

          {/* Invited Worksapce Container */}
          <div className="mt-16 h-fit w-11/12 bg-white rounded-[15px]  justify-self-center relative">
              <h1  className="p-5 ml-5 mb-2 text-3xl font-medium tracking-tight 
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
                <div className="w-[88%] h-[0px] border border-zinc-300"></div>
              </div>
            {/* invited wokspace Card */}
            <div className={`grid grid-cols-3 gap-4 pb-8 pt-2`}>  
                {MyWorkspaceData.map((data, index)=>(
              <div key={index} className={`mb-4 ${!showInvitedRow && index >= 3 ? 'hidden' : ''}`}>
                <Link to={`/workspaces/${data.id}/project-list`}>
                  <InvitedCard  id={data.id} name={data.name} desc={data.desc} members={[...data.member]} createAt={data.createAt} updateAt={data.updateAt} /> 
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
}

export default Workspace;
