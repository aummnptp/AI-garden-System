import React, { useEffect, useState } from "react";

import WorkspaceCard from "../../components/card/WorkspaceCard";
import InvitedCard from "../../components/card/InvitedCard";
import CreateWorkspace from "../../components/popup/CreateWorkspace";

import {DownOutlined, UpOutlined}  from '@ant-design/icons';

// mockup data
import MyWorkspaceData from "../../data/WorkspaceData";
import { Link, useParams } from "react-router-dom";
import MiniFooter from "../../components/MiniFooter";
import axios from "axios";
import { Button } from "@mui/material";
import { useFetchQuery } from "../../hook/useFetchQuery";


interface WorkspaceProps {
  workspaceId: number;
  name: string;
  description: string;
  updatedAt: string;
  createdAt: string;
  members: {
    id: number;
    role: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: number;
      googleId: string;
      email: string;
      name: string;
      picture: string;
    };
  }[];
}
function WorkspacePage() {
  // my workspace show
  const [showWorkspaceRow, setShowWorkspaceRow] = useState(false); // เริ่มต้นโชว์แถวที่ 2
  const [showModal, setShowModal] = useState(false);
  const toggleWorkspaceRow = () => {
    setShowWorkspaceRow(!showWorkspaceRow); // สลับค่าของ showSecondRow กับ true/false
  };
  // invited workspace show 
  const [showInvitedRow, setShowInvitedRow] = useState(false); 
  const toggleInvitedRow = () => {
    setShowInvitedRow(!showInvitedRow);
  };

  const {
    data: myWorkspace,
    isLoading: isLoadingMyWorkspace,
    error: errorMyWorkspace,
    refetch: refetchMyWorkspace,
  } = useFetchQuery(
    ["my-workspace",],
    `/workspaces/my-workspaces`
  );

//   // ดึงข้อมูล workspace detail
  const {
    data: invitedWorkspace,
    isLoading: isLoadingInvitedWorkspace,
    error: errorInvitedWorkspace,
    refetch: refetchInvitedWorkspace, // <-- ดึง refetch ออกมา

  } = useFetchQuery(
    ["invited-workspace"],
    `/workspaces/invite-workspaces`
  );

  // ตรวจสอบสถานะการโหลด
  if (isLoadingMyWorkspace || isLoadingInvitedWorkspace) return <div>Loading...</div>;
  // ตรวจสอบข้อผิดพลาด
  if (errorMyWorkspace || errorInvitedWorkspace) return <div>Error: {errorMyWorkspace?.message || errorInvitedWorkspace?.message}</div>;

 


  return (
    <>
      <div className=" bg-neutral-100 flex items-center justify-center h-full pb-32">
        {/* popup */}
        <CreateWorkspace
          showModal={showModal}
          setShowModal={setShowModal}
          fetchWorkspaces={() => {
            refetchMyWorkspace();
            refetchInvitedWorkspace();
          }}
          // fetchWorkspaces={fetchData}
        />
        <div className=" flex flex-col items-center justify-center w-full ">
          {/* My Worksspace Container */}
          <div className="mt-4 h-fit w-11/12 bg-white rounded-[15px] items-center relative p-6">
            <div className="flex justify-between mb-5">
              <h1 className="ml-5 text-3xl font-medium tracking-tight text-indigo-900">
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

            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto" />

            {/* ตรวจสอบเงื่อนไข */}
            {myWorkspace.length === 0 ? (
               <div className=" my-6 mx-10 flex justify-center items-center h-24 
               border-2 border-dashed border-gray-300 rounded-lg bg-gray-50
               ">
               <div className="text-center text-zinc-500 text-lg md:text-xl px-4">
                 <p> No workspace here</p>
         
               </div>
             </div>
            ) : (
              <>
                {/* แสดงปุ่ม "แสดงเพิ่มเติม" เมื่อ workspace > 3 */}
                {myWorkspace.length > 3 ? (
                  <div
                    onClick={toggleWorkspaceRow}
                    className="mx-auto my-2 w-[95%] flex items-center space-x-2 px-2 hover:bg-gray-100 rounded-[5px]"
                  >
                    {showWorkspaceRow ? (
                      <div>
                        <DownOutlined
                          style={{ color: "#999", fontSize: "24px" }}
                        />
                      </div>
                    ) : (
                      <UpOutlined style={{ color: "#999", fontSize: "24px" }} />
                    )}
                    <p className="text-center text-zinc-500 text-xl leading-[49px]">
                      {showWorkspaceRow ? "ย่อรายละเอียด" : "แสดงเพิ่มเติม"}
                    </p>
                    <div className="w-[85%] h-[0px] border border-zinc-300" />
                  </div>
                ) : (
                  // เพิ่มพื้นที่เว้นว่างเมื่อไม่มีปุ่มแสดงเพิ่มเติม
                  <div className="my-2 w-[95%] flex items-center px-2">
                    <div className="w-full h-[20px]" />
                  </div>
                )}

                {/* My Workspace Card Group */}
                <div className={`grid grid-cols-3 pb-8 pt-2`}>
                  {myWorkspace.map((data, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${
                        !showWorkspaceRow && index >= 3 ? "hidden" : ""
                      }`}
                    >
                      <Link to={`/workspaces/${data.workspaceId}/project-list`}>
                        <WorkspaceCard
                          id={data.workspaceId}
                          name={data.name}
                          description={data.description}
                          members={data.members}
                          updatedAt={data.updatedAt}
                          createdAt={data.createdAt}
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Invited Worksapce Container */}
          <div className="mt-8 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative p-6">
  <h1 className="ml-5 mb-5 text-3xl font-medium tracking-tight text-indigo-900">
    Invited Workspace
  </h1>

  <div className="w-11/12 h-[0px] border border-zinc-300 mx-auto"></div>

  {invitedWorkspace.length === 0 ? (
      <div className=" my-6 mx-10 flex justify-center items-center h-24 
      border-2 border-dashed border-gray-300 rounded-lg bg-gray-50
      ">
      <div className="text-center text-zinc-500 text-lg md:text-xl px-4">
        <p> No invited workspace here</p>

      </div>
    </div>
  ) : (
    <>
      {invitedWorkspace.length > 3 ? (
        <div
          onClick={toggleInvitedRow}
          className="mx-auto my-2 w-[95%] flex items-center space-x-2 px-2 hover:bg-gray-100 rounded-[5px]"
        >
          {showInvitedRow ? (
            <div>
              <DownOutlined style={{ color: "#999", fontSize: "24px" }} />
            </div>
          ) : (
            <UpOutlined style={{ color: "#999", fontSize: "24px" }} />
          )}
          <p className="text-center text-zinc-500 text-xl leading-[49px]">
            {showInvitedRow ? "ย่อรายละเอียด" : "แสดงเพิ่มเติม"}
          </p>
          <div className="w-[85%] h-[0px] border border-zinc-300"></div>
        </div>
      ) : (
        <div className="my-2 w-[95%] flex items-center px-2">
          <div className="w-full h-[20px]" />
        </div>
      )}

      {/* invited workspace Card */}
      <div className={`grid grid-cols-3 pb-8 pt-2`}>
        {invitedWorkspace.map((data, index) => (
          <div key={index} className={`mb-4 ${!showInvitedRow && index >= 3 ? "hidden" : ""}`}>
            <Link to={`/workspaces/${data.workspaceId}/project-list`}>
              <InvitedCard
                id={data.id}
                name={data.name}
                desc={data.description}
                members={data.members}
                createAt={data.createAt}
                updateAt={data.updateAt}
              />
            </Link>
          </div>
        ))}
      </div>
    </>
  )}
</div>

        </div>
      </div>
      <MiniFooter></MiniFooter>
    </>
  );
};

export default WorkspacePage;
