import React from "react";
import MiniFooter from "../components/MiniFooter";
import Sidebar from "../components/Sidebar";

function Admin() {
  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        {/* side bar */}
        <Sidebar></Sidebar>
        {/* content container */}
        <div className=" w-10/12 ml-auto bg-red-100 flex flex-col items-center pb-32  h-full min-h-screen">
        <div className=" w-full h-fit  bg-white flex ">
          <div className="m-10 w-8/12 h-[184px] relative bg-white rounded-[15px] border border-zinc-400 grid grid-cols-12 hover:bg-gray-50">
            <div className="w-2.5 h-[184px] bg-indigo-600 rounded-tl-[15px] rounded-bl-[15px]" />
          </div>
          <div className="m-10 w-8/12 h-[184px] relative bg-white rounded-[15px] border border-zinc-400 grid grid-cols-12 hover:bg-gray-50"></div>
          <div className="m-10 w-8/12 h-[184px] relative bg-white rounded-[15px] border border-zinc-400 grid grid-cols-12 hover:bg-gray-50"></div>
        </div>
        </div>
        
      </div>
      <MiniFooter></MiniFooter>
    </>
  );
}

export default Admin;
