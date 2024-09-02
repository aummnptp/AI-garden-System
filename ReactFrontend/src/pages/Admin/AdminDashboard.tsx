import React from "react";
import MiniFooter from "../../components/MiniFooter";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import AiRequestTable from "../../components/table/AiRequestTable";

function AdminDashboard() {
  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        {/* Sidebar */}
        <Sidebar></Sidebar>

        {/* Main Content */}
        <div className=" w-10/12 ml-auto bg-neutral-100 items-center pb-32  h-full min-h-screen">
          {/* Header with Cards */}
          <div className="">
      
            <div className="pt-10 pb-5 h-fit w-full flex justify-self-center relative px-40">
            <Link to={`#`} className="w-[30%] mx-auto">
              <div className=" h-fit w-full flex py-20 justify-center relative bg-white rounded-[5px] border border-zinc-400  hover:bg-gray-50 ">
                <h1 className="font-medium text-indigo-800 text-2xl my-5">User List</h1>
              </div>
              </Link>
              <Link to={`/admin/admin-ai`} className="w-[30%] mx-auto">
              <div className=" h-fit w-full flex py-20 justify-center relative bg-white rounded-[5px] border border-zinc-400  hover:bg-gray-50 ">
                <h1 className="font-medium text-indigo-800 text-2xl my-5">AI List</h1>
              </div>
              </Link>
              <Link to={`#`} className="w-[30%] mx-auto">
              <div className=" h-fit w-full flex py-20 justify-center relative bg-white rounded-[5px] border border-zinc-400  hover:bg-gray-50 ">
                <h1 className="font-medium text-indigo-800 text-2xl my-5">Workspace</h1>
              </div>
              </Link>
            </div>
            <div className=" pb-5 h-fit w-[90%]  relative bg-white rounded-[15px]  mx-auto">
              <div className="w-full h-[7.5px] bg-indigo-600 rounded-tl-[15px] rounded-tr-[15px]" />
              <div className="w-full px-5">
              <h1 className="font-semibold text-indigo-800 text-2xl my-5">AI Request Notification</h1>
              <AiRequestTable/>
              </div>
            </div>
          </div>

          {/* Other content can go here */}
        </div>
      </div>
      <MiniFooter />
    </>
  );
}

export default AdminDashboard;
