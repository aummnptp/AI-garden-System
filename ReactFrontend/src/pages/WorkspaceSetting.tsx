import React from "react";
import Sidebar from "../components/Sidebar";
import { Input } from "antd";

const WorkspaceSetting = () => {
  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        {/* side bar */}
        <Sidebar></Sidebar>
        {/* content container */}
        <div className=" w-10/12 ml-auto bg-red-100 flex flex-col items-center pb-32  h-full min-h-screen">
          <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative ">
            <h1
              className="p-5 ml-5 text-3xl font-medium tracking-tight 
          text-indigo-900 "
            >
              Workspace Setting
            </h1>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>
            <div className="flex flex-col items-center">
                <label className="mx-auto"> Workspace name
                <Input
                placeholder="Workspace Name"
                variant="outlined"
                className="my-4 w-9/12 mx-auto"
                
                />
                </label>
                <label className="mx-auto"> Description
               <Input
                placeholder="Workspace Name"
                variant="outlined"
                className="my-4 w-9/12 mx-auto"
                />
                </label>
                <div className="w-[733px] h-[626px] bg-white rounded-[15px] border border-zinc-300" >

                </div>
            </div>
          </div>
        </div>

        <div className="pr-12 w-full h-[12%]  bg-white border border-zinc-300 fixed bottom-0 right-0 flex justify-end items-center">
          <button
            type="button"
            className=" w-fit  bg-indigo-600 hover:bg-blue-800
              focus:ring-4 focus:ring-blue-300 rounded-lg px-5 py-2.5 me-2 
              focus:outline-none 
              text-center text-white text-xl font-light"
          >
            บันทึก
          </button>
        </div>
      </div>
    </>
  );
};

export default WorkspaceSetting;
