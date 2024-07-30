import React from "react";
import { Link } from "react-router-dom";
import { SendOutlined } from '@ant-design/icons';
import AiData from "../data/AiData";
import AiCard from "../components/AiCard";
import { ControlOutlined, SortAscendingOutlined } from "@ant-design/icons";
import MiniFooter from "../components/MiniFooter";

function AdminAi() {
  return (
    <>
      <div className="flex bg-neutral-100 h-full pb-32">
        {/* Slidebar placeholder */}
        <div className="w-1/5 bg-neutral-200 h-full"></div>

        {/* Main content */}
        <div className="w-4/5 items-center justify-center h-full grid grid-cols-1">
          {/* Top card (create sort workspace name) */}
          <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">
          <div className="flex justify-between items-center p-5">
              <h1 className="text-3xl font-medium tracking-tight text-indigo-900 dark:text-black">
                AI List
              </h1>
              <Link to="/admin/createai" className="p-2  text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-800 rounded-[15px]">
                + New AI Project
              </Link>
            </div>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>
            <div className="m-6 flex justify-between items-center gap-4">
              <input
                type="text"
                id="first_name"
                className="w-6/12 h-fit bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="ค้นหาชื่อโปรเจค"
                required
              />
              <div>
              <button
                type="button"
                className="rounded-[25px] bg-white border-2 border-gray-200 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 text-black text-lg font-normal px-5 py-2.5 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              >
                ประเภท <SortAscendingOutlined />
              </button>
              <button
                type="button"
                className="rounded-[25px] bg-white border-2 border-gray-200 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 text-black text-lg font-normal px-5 py-2.5 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              >
                tag <ControlOutlined />
              </button></div>
            </div>
          </div>

          {/* Card container */}
          <div className="mt-16 h-fit w-11/12 grid grid-cols-3 gap-6 bg-white rounded-[15px] justify-self-center relative">
            {/* Card */}
            {AiData.map((data) => (
              <AiCard
                key={data.id}
                id={data.id}
                name={data.name}
                aiDesc={data.aiDesc}
                tags={data.tags}
                img={data.img}
                type={data.type}
              />
            ))}
            
          </div>
        </div>
      </div>
      <MiniFooter />
    </>
  );
}

export default AdminAi;
