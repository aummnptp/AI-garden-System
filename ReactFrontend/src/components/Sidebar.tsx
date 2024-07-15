import { BarsOutlined, FileDoneOutlined, FileImageOutlined, HistoryOutlined, LaptopOutlined, PlaySquareOutlined, ProfileOutlined, ProjectOutlined, SettingOutlined} from '@ant-design/icons'
import React from 'react'

import { Link, useParams, useLocation } from 'react-router-dom'

const Sidebar = () => {
  let {workspaceId} = useParams()
  const location = useLocation();
  const isProjectPage = location.pathname.includes('/detail');
  
  return (
    <div className="px-3 pt-6 pb-24 h-full w-2/12 bg-white shadow border  fixed z-40 overflow-y-scroll ">
      <div className="flex items-center">
        <div className="mx-1 w-[45px] h-[45px] bg-blue-100 rounded-full flex items-center justify-center ">
          <LaptopOutlined style={{ color: "#353D81", fontSize: "2em" }} />
        </div>
        <div className="ml-3">
          <div className="text-neutral-400 text-base font-medium font-['Roboto'] leading-loose mt-[-12px]">
            In workspace
          </div>
          <h1 className="text-black text-2xl font-semibold mt-[-10px]">h1 and icon</h1>
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
      <div className=" text-neutral-400 text-lg font-normal font-['Roboto'] leading-loose">
        Workspace Menu
      </div>
      <ul className="font-medium">
        <li>
          <Link to={`/workspaces/${workspaceId}/project-list`}>
            <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group  focus:ring-4 focus:bg-blue-300  ">
          <BarsOutlined />
              <span className="flex-1 ms-3 whitespace-nowrap">
                Project List
              </span>
            </div>
          </Link>
        </li>

        <li>
          <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
          <HistoryOutlined />
            <span className="flex-1 ms-3 whitespace-nowrap">
              Workspace history
            </span>
          </div>
        </li>
        <li>
          <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
          <SettingOutlined />
            <span className="flex-1 ms-3 whitespace-nowrap">
              Workspace setting
            </span>
          </div>
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
          <div className="text-neutral-400 text-base font-medium font-['Roboto'] leading-loose mt-[-12px]">
            In project
          </div>
          <h1 className="text-black text-2xl font-semibold mt-[-10px]">ProjectName</h1>
        </div>
      </div>
      <span className="ml-[5%] w-fit  text-indigo-600 text-lg font-semibold">
        AI name
      </span>
      <span className="text-indigo-900 text-base font-medium "> | </span>
      <span className="text-indigo-900 text-base font-medium "> ai type </span>
      <div className="mt-6 w-full border border-zinc-300"/>
      {/* project menu */}
      <div className="text-neutral-400 text-lg font-normal font-['Roboto'] leading-loose">
        Project Menu
      </div>
      <ul className="font-medium">
        <li>
          <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
          <ProfileOutlined />
            <span className="flex-1 ms-3 whitespace-nowrap">detail</span>
          </div>
        </li>
        <li>
          <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
          <FileImageOutlined />
            <span className="flex-1 ms-3 whitespace-nowrap">upload image</span>
          </div>
        </li>
        <li>
          <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
          <PlaySquareOutlined />
            <span className="flex-1 ms-3 whitespace-nowrap">upload video</span>
          </div>
        </li>
        <li>
          <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
          <FileDoneOutlined />
            <span className="flex-1 ms-3 whitespace-nowrap">
              project history
            </span>
          </div>
        </li>
        <li>
          <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <SettingOutlined />
            <span className="flex-1 ms-3 whitespace-nowrap">
              project setting
            </span>
          </div>
        </li>
        
      </ul>
      </>
          )}
    </div>
  );
}

export default Sidebar