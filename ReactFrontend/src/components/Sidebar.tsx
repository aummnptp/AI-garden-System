import {
  BarsOutlined,
  FileDoneOutlined,
  HistoryOutlined,
  LaptopOutlined,
  ProfileOutlined,
  ProjectOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Workspace } from "../types/Workspace";

import { useAuth } from "../context/AuthContext";
import { ProjectDataType } from "../types/Project";

interface SidebarProps {
  workspace: Workspace;
  project?: ProjectDataType;
}
const Sidebar: React.FC<SidebarProps> = ({ workspace, project }) => {
  let { workspaceId, projectId } = useParams();
  const { isAdmin, isOwner } = useAuth();
  const location = useLocation();
  const isProjectPage = location.pathname.includes("/project/");
  const isActive = (path: string) => location.pathname === path;

  const [isWorkspaceOwner, setIsWorkspaceOwner] =  useState<boolean | null>(null);
  useEffect(() => {
    if (workspaceId) {
      isOwner(workspaceId).then(setIsWorkspaceOwner);
    }
  }, [workspaceId, isOwner]);
  const ProjectMenu = useMemo(
    () =>
      isProjectPage &&
      project && (
        <>
          <div className="flex items-center ">
            <div className="mx-1 w-[45px] h-[45px] bg-blue-100 rounded-full flex items-center justify-center">
              <ProjectOutlined style={{ color: "#353D81", fontSize: "2em" }} />
            </div>

            <div className="ml-3 mt-4">
              <div className="text-neutral-400 text-base font-medium  leading-loose mt-[-12px]">
                In project
              </div>
              <h1 className="text-indigo-900 text-2xl font-semibold mt-[-10px]">
                {project?.name}
              </h1>
            </div>
          </div>
          {/* <div className='flex'> */}
          <span className="w-fit  text-indigo-600 text-base font-semibold">
            {project.ai_model.name}
          </span>
          {/* </div> */}
          <span className="text-indigo-900 text-base font-medium "> | </span>
          <span className="text-indigo-900 text-base font-medium ">
            {" "}
            {project.ai_model.ai_type}{" "}
          </span>
          <div className="mt-6 w-full border border-zinc-300" />
          {/* project menu */}
          <div className="text-neutral-400 text-lg font-normal leading-loose">
            Project Menu
          </div>
          <ul className="font-medium">
            <li>
              <Link
                to={`/workspaces/${workspaceId}/project/${projectId}/detail`}
              >
                <div
                  className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 ${
                    isActive(
                      `/workspaces/${workspaceId}/project/${projectId}/detail`
                    )
                      ? "bg-blue-100"
                      : ""
                  }`}
                >
                  <ProfileOutlined />
                  <span className="flex-1 ms-3 whitespace-nowrap">detail</span>
                </div>
              </Link>
            </li>
            <li>
              <Link
                to={`/workspaces/${workspaceId}/project/${projectId}/history`}
              >
                <div
                  className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 ${
                    isActive(
                      `/workspaces/${workspaceId}/project/${projectId}/history`
                    )
                      ? "bg-blue-100"
                      : ""
                  }`}
                >
                  <FileDoneOutlined />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    project history
                  </span>
                </div>
              </Link>
            </li>
            {(isAdmin ||isWorkspaceOwner) && (
            <li>
              <Link
                to={`/workspaces/${workspaceId}/project/${projectId}/setting`}
              >
                <div
                  className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 ${
                    isActive(
                      `/workspaces/${workspaceId}/project/${workspaceId}/setting`
                    )
                      ? "bg-blue-100"
                      : ""
                  }`}
                >
                  <SettingOutlined />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    project setting
                  </span>
                </div>
              </Link>
            </li>
            )}
          </ul>
        </>
      ),
      [workspaceId, projectId, location.pathname, project, isWorkspaceOwner]
  );

  return (
    <div className="px-3 pt-6 pb-[12%] h-full min-w-[250px] w-full md:w-3/12 lg:w-2/12 bg-white shadow border md:fixed z-40 overflow-y-auto">
    <div className="flex items-center">
      <div className="mx-1 w-[45px] h-[45px] bg-blue-100 rounded-full flex items-center justify-center">
        <LaptopOutlined style={{ color: "#353D81", fontSize: "2em" }} />
      </div>
      <div className="ml-3">
        <div className="text-neutral-400 text-base font-medium leading-loose mt-[-12px]">
          In workspace
        </div>
        <h1 className="text-indigo-900 text-2xl font-semibold mt-[-10px]">
          {workspace.name}
        </h1>
      </div>
    </div>
  
    <div className="ml-[7.5%] w-fit">
      <span className="text-neutral-400 text-base font-medium">You are </span>
      <span className="text-indigo-600 text-lg font-semibold">
        {isAdmin ? "Administrator" : isWorkspaceOwner ? "Owner" : "Member"}
      </span>
    </div>
  
    <div className="mt-6 w-full border border-zinc-300" />
  
    {/* Workspace Menu */}
    <div className="text-neutral-400 text-lg font-normal leading-loose">
      Workspace Menu
    </div>
    <ul className="font-medium">
      <li>
        <Link to={`/workspaces/${workspaceId}/project-list`}>
          <div
            className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 ${
              isActive(`/workspaces/${workspaceId}/project-list`)
                ? "bg-blue-100"
                : ""
            }`}
          >
            <BarsOutlined />
            <span className="flex-1 ms-3 whitespace-nowrap">Project List</span>
          </div>
        </Link>
      </li>
  
      <li>
        <Link to={`/workspaces/${workspaceId}/history`}>
          <div
            className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 ${
              isActive(`/workspaces/${workspaceId}/history`) ? "bg-blue-100" : ""
            }`}
          >
            <HistoryOutlined />
            <span className="flex-1 ms-3 whitespace-nowrap">
              Workspace history
            </span>
          </div>
        </Link>
      </li>
  
      {(isAdmin || isWorkspaceOwner) && (
        <li>
          <Link to={`/workspaces/${workspaceId}/setting/edit`}>
            <div
              className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group focus:ring-4 focus:bg-blue-300 ${
                isActive(`/workspaces/${workspaceId}/setting/edit`)
                  ? "bg-blue-100"
                  : ""
              }`}
            >
              <SettingOutlined />
              <span className="flex-1 ms-3 whitespace-nowrap">
                Workspace setting
              </span>
            </div>
          </Link>
        </li>
      )}
    </ul>
  
    <div className="my-3 w-full border border-zinc-300" />
  
    {/* Project Section */}
    {ProjectMenu}
  </div>
  
  );
};

export default Sidebar;
