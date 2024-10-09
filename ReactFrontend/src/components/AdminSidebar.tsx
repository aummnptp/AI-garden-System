import { BarsOutlined, FileDoneOutlined, FileImageOutlined, HistoryOutlined, LaptopOutlined, PlaySquareOutlined, ProfileOutlined, ProjectOutlined, SettingOutlined} from '@ant-design/icons'
import { AdminPanelSettings, Assessment, AssessmentOutlined, Desk, Monitor, PeopleAltOutlined, Psychology, PsychologyOutlined, Shield } from '@mui/icons-material';
import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom';



const AdminSidebar = () => {

  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="px-3 pt-6 pb-24 h-full w-2/12 bg-white shadow border  fixed z-40 overflow-y-scroll ">
      <div className="flex items-center">
        <div className="mx-1 w-[45px] h-[45px] bg-blue-100 rounded-full flex items-center justify-center ">
          <Monitor style={{ color: "#353D81", fontSize: "2em" }} />
        </div>
        <div className="ml-3">
          <h1 className="text-indigo-900 text-2xl font-semibold">Admin</h1>
        </div>
      </div>
      
      <div className="mt-6 w-full border border-zinc-300"/>
      {/* workspace menu */}
      <div className=" text-neutral-400 text-lg font-normal  leading-loose">
        Admin Menu
      </div>
      <ul className="font-medium">
        <li>
          <Link to={`/admin/dashboard`}>
            <div   className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 ${
                isActive(`/admin/dashboard`) ? 'bg-blue-100' : ''
              }`}>
          <AssessmentOutlined />
              <span className="flex-1 ms-3 whitespace-nowrap">
                dashboard
              </span>
            </div>
          </Link>
        </li>

        <li>
          <Link to={`/admin/admin-ai`}>
            <div   className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 ${
                isActive(`/admin/admin-ai`) ? 'bg-blue-100' : ''
              }`}>
          < PsychologyOutlined />
              <span className="flex-1 ms-3 whitespace-nowrap">
                AI list
              </span>
            </div>
          </Link>
        </li>

        <li>
          <Link to={`/admin/userlist`}>
            <div   className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 ${
                isActive(`/admin/userlist`) ? 'bg-blue-100' : ''
              }`}>
          <PeopleAltOutlined />
              <span className="flex-1 ms-3 whitespace-nowrap">
                user list
              </span>
            </div>
          </Link>
        </li>

        
        <li>
          <Link to={`/admin/workspaces`}>
            <div   className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 ${
                isActive(`/admin/workspaces`) ? 'bg-blue-100' : ''
              }`}>
          <Desk />
              <span className="flex-1 ms-3 whitespace-nowrap">
                workspace list
              </span>
            </div>
          </Link>
        </li>

        </ul>


      
  
      
    </div>
  );
}

export default AdminSidebar