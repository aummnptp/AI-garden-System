import { BarsOutlined, FileDoneOutlined, FileImageOutlined, HistoryOutlined, LaptopOutlined, PlaySquareOutlined, ProfileOutlined, ProjectOutlined, SettingOutlined} from '@ant-design/icons'
import React from 'react'

import { Link, useParams, useLocation } from 'react-router-dom'

interface SidebarProps {
  workspaceName: string; // เพิ่ม props สำหรับ workspaceName
  projectName:string;
  aiName:string;
  aiType:string;
}
const Sidebar: React.FC<SidebarProps> = ({ workspaceName ,projectName,aiName,aiType})=> {
  let {workspaceId,projectId} = useParams()
  const location = useLocation();
  const isProjectPage = location.pathname.includes('/project/');

  const isActive = (path: string) => location.pathname === path;
  return (
    <div className="px-3 pt-6 pb-24 h-full w-2/12 bg-white shadow border  fixed z-40 overflow-y-scroll ">
      <div className="flex items-center">
        <div className="mx-1 w-[45px] h-[45px] bg-blue-100 rounded-full flex items-center justify-center ">
          <LaptopOutlined style={{ color: "#353D81", fontSize: "2em" }} />
        </div>
        <div className="ml-3">
          <div className="text-neutral-400 text-base font-medium leading-loose mt-[-12px]">
            In workspace
          </div>
          <h1 className="text-indigo-900 text-2xl font-semibold mt-[-10px]">{workspaceName}</h1>
        </div>
      </div>
      <div className="ml-[7.5%] w-fit ">
        <span className=" text-neutral-400 text-base font-medium">
          you are {" "}
        </span>
        <span className="text-indigo-600 text-lg font-semibold ">
          Project Owner
        </span>
      </div>
      <div className="mt-6 w-full border border-zinc-300"/>
      {/* workspace menu */}
      <div className=" text-neutral-400 text-lg font-normal  leading-loose">
        Workspace Menu
      </div>
      <ul className="font-medium">
        <li>
          <Link to={`/workspaces/${workspaceId}/project-list`}>
            <div   className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 ${
                isActive(`/workspaces/${workspaceId}/project-list`) ? 'bg-blue-100' : ''
              }`}>
          <BarsOutlined />
              <span className="flex-1 ms-3 whitespace-nowrap">
                Project List
              </span>
            </div>
          </Link>
        </li>

        <li>
        <Link to={`/workspaces/${workspaceId}/history`}>
          <div   className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 ${
                isActive(`/workspaces/${workspaceId}/history`) ? 'bg-blue-100' : ''
              }`}>
          <HistoryOutlined />
            <span className="flex-1 ms-3 whitespace-nowrap">
              Workspace history
            </span>
          </div>
          </Link>
        </li>
        <li>
        <Link to={`/workspaces/${workspaceId}/setting/edit`}>
          <div   className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 ${
                isActive(`/workspaces/${workspaceId}/setting/edit`) ? 'bg-blue-100' : ''
              }`}>
          <SettingOutlined />
            <span className="flex-1 ms-3 whitespace-nowrap">
              Workspace setting
            </span>
          </div>
        </Link>
        </li>
      </ul>
      <div className="my-3 w-full border border-zinc-300"/>
      {/* project section */}
      {isProjectPage && (
        <>
      
      <div className="flex items-center ">
        <div className="mx-1 w-[45px] h-[45px] bg-blue-100 rounded-full flex items-center justify-center">
          <ProjectOutlined style={{ color: "#353D81", fontSize: "2em" }} />
        </div>

        <div className="ml-3 mt-4">
          <div className="text-neutral-400 text-base font-medium  leading-loose mt-[-12px]">
            In project
          </div>
          <h1 className="text-indigo-900 text-2xl font-semibold mt-[-10px]">{projectName}</h1>
        </div>
      </div>
      {/* <div className='flex'> */}
      <span className="w-fit  text-indigo-600 text-base font-semibold">
        {aiName}
      </span>
      {/* </div> */}
      <span className="text-indigo-900 text-base font-medium "> | </span>
      <span className="text-indigo-900 text-base font-medium "> {aiType} </span>
      <div className="mt-6 w-full border border-zinc-300"/>
      {/* project menu */}
      <div className="text-neutral-400 text-lg font-normal leading-loose">
        Project Menu
      </div>
      <ul className="font-medium">
        <li>
        <Link to={`/workspaces/${workspaceId}/project/${projectId}/detail`}>
          <div   className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 ${
                isActive(`/workspaces/${workspaceId}/project/${projectId}/detail`) ? 'bg-blue-100' : ''
              }`}>
          <ProfileOutlined />
            <span className="flex-1 ms-3 whitespace-nowrap">detail</span>
          </div>
          </Link>
        </li>
        {/* <li>
          <div   className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 ${
                isActive(`/workspaces/${workspaceId}/project-list`) ? 'bg-blue-100' : ''
              }`}>
          <FileImageOutlined />
            <span className="flex-1 ms-3 whitespace-nowrap">upload image</span>
          </div>
        </li>
        <li>
          <div   className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 ${
                isActive(`/workspaces/${workspaceId}/project-list`) ? 'bg-blue-100' : ''
              }`}>
          <PlaySquareOutlined />
            <span className="flex-1 ms-3 whitespace-nowrap">upload video</span>
          </div>
        </li> */}
        <li>
        <Link to={`/workspaces/${workspaceId}/project/${projectId}/history`}>
          <div   className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 ${
                isActive(`/workspaces/${workspaceId}/project/${projectId}/history`) ? 'bg-blue-100' : ''
              }`}>
          <FileDoneOutlined />
            <span className="flex-1 ms-3 whitespace-nowrap">
              project history
            </span>
          </div>
          </Link>
        </li>
        <li>
        <Link to={`/workspaces/${workspaceId}/project/${projectId}/setting`}>
          <div   className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 ${
                isActive(`/workspaces/${workspaceId}/project/${workspaceId}/setting`) ? 'bg-blue-100' : ''
              }`}>
            <SettingOutlined />
            <span className="flex-1 ms-3 whitespace-nowrap">
              project setting
            </span>
          </div>
          </Link>
        </li>
        
      </ul>
      </>
          )}
    </div>
  );
}

export default Sidebar