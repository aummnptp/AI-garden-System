import React from "react";
import MiniFooter from "../../components/MiniFooter";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function AdminDashboard() {
  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        {/* Sidebar */}
        <Sidebar></Sidebar>
        
        {/* Main Content */}
        <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
          {/* Header with Cards */}
          <div className="flex justify-center ">
          <Link to="/admin/admin-ai">
          <div className="mx-auto  relative bg-white rounded-[5px] border border-zinc-400 grid grid-cols-12 hover:bg-gray-50 ">
              <div className="title">User lists</div>
            </div>
            </Link>
            <Link to="/admin/admin-ai">
            <div className="mx-auto  relative bg-white rounded-[5px] border border-zinc-400 grid grid-cols-12 hover:bg-gray-50 ">
              <div className="title">AI lists</div>
            </div>
            </Link>
            <Link to="/admin/admin-ai">
            <div className="mx-auto  relative bg-white rounded-[5px] border border-zinc-400 grid grid-cols-12 hover:bg-gray-50 ">
              <div className="title">Workspaces</div>
            </div>
            </Link>
          </div>
          
          {/* Other content can go here */}
        </div>
      </div>
      <MiniFooter />
    </>
  );
}

export default AdminDashboard;
