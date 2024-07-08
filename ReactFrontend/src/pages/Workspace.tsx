import React from "react";
import { Button } from "@mui/material";
import WorkspaceCard from "../components/WorkspaceCard";
import Footer from "../components/Footer";

function Workspace() {
  return (
      <div className=" bg-neutral-100 flex items-center justify-center">
        <div className=" flex flex-col items-center justify-center w-full bg">
          {/* My Worksspace Container */}
          <div className="mt-16 h-fit w-11/12 bg-white rounded-[15px]  justify-self-center relative">
              <h1  className="p-5 ml-5 mb-2 text-3xl font-medium tracking-tight 
              text-indigo-900 dark:text-white ">My Workspace
              </h1>
              {/* create button */}
              <button
              type="button"
              className="h-fit w-fit  text-white bg-indigo-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 
              font-medium rounded-2xl text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 
              focus:outline-none dark:focus:ring-blue-800 absolute top-0 right-0 my-6 mr-6">+ Create Workspace</button>
              <div className="w-11/12 h-[0px] border border-zinc-300 mx-auto"></div>
              {/* My wokspace Card */}
      
              <WorkspaceCard/>
          </div>
         

          {/* Invited Worksapce Container */}
          <div className="mt-16 h-72 w-11/12 bg-white rounded-[15px]  justify-self-center relative">
              <h1  className="p-5 ml-5 mb-2 text-3xl font-medium tracking-tight 
              text-indigo-900 dark:text-white ">Invited Workspace
              </h1>
    
              <div className="w-11/12 h-[0px] border border-zinc-300 mx-auto"></div>
            {/* invited wokspace Card */}
          </div>
        </div>
      </div>
  );
}

export default Workspace;
