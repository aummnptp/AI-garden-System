import { BarsOutlined, FileDoneOutlined, FileImageOutlined, HistoryOutlined, LaptopOutlined, PlaySquareOutlined, ProfileOutlined, ProjectOutlined, SettingOutlined} from '@ant-design/icons'
import React from 'react'



const AdminSidebar = () => {

  
  return (
    <div className="px-3 pt-6 pb-24 h-full w-2/12 bg-white shadow border  fixed z-40 overflow-y-scroll ">
      <div className="flex items-center">
        <div className="mx-1 w-[45px] h-[45px] bg-blue-100 rounded-full flex items-center justify-center ">
          <LaptopOutlined style={{ color: "#353D81", fontSize: "2em" }} />
        </div>
        <div className="ml-3">
          <h1 className="text-indigo-900 text-2xl font-semibold mt-[-10px]">Admin</h1>
        </div>
      </div>
      
      <div className="mt-6 w-full border border-zinc-300"/>
      {/* workspace menu */}
      <div className=" text-neutral-400 text-lg font-normal  leading-loose">
        Admin Menu
      </div>
      
      <div className="my-3 w-full border border-zinc-300"/>
      
    </div>
  );
}

export default AdminSidebar