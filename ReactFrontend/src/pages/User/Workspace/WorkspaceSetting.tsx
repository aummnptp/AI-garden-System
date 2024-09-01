import React, {  useState } from 'react';
import Sidebar from "../../../components/Sidebar";

import { Button, FormControl, FormHelperText, MenuItem, TextField } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Link, useParams } from 'react-router-dom';
interface memberData {
  id:number
  firstName: string;
  lastName: string;
  email:string;
  role:string;
}



const WorkspaceSetting = () => {
  let {workspaceId} = useParams();

  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        {/* side bar */}
        <Sidebar></Sidebar>
        {/* content container */}
        <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
          <div className="mt-5 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative px-5 pt-2">
            <h1
              className="p-5  text-3xl font-medium tracking-tight 
          text-indigo-900 "
            >
              Workspace Setting
            </h1>
            <div className="w-full h-[0px] border border-zinc-300 mx-auto" />
          <div className="flex justify-start  ">
          {/* sticky top-[10%] bg-white w-full z-50 */}
          <ul className="flex flex-wrap -mb-px">
            <li className="me-2">
            <Link to={`/workspaces/${workspaceId}/setting/edit`}>
              <a
                className="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active "
                aria-current="page"
              >
              Edit
              </a>
              </Link>
            </li>
            <li className="me-2">
            <Link to={`/workspaces/${workspaceId}/setting/invitation`}>
              <a
                href="#"
                className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 "
              >
              Team Member
              </a>
              </Link>
            </li>
            
          </ul>
        </div>



            {/* <div className="w-full h-[0px] border border-zinc-300 mx-auto" /> */}
            <div className=" w-[80%] mx-auto items-center pt-8 pb-10">
              <label className="mx-auto flex-col flex text-black text-2xl mb-2  ">
                Workspace name
              </label>
              <div className='mx-auto flex-col flex text-black text-2xl mb-10'>

              <TextField
                  id="standard-number"
                  placeholder='workspace name'
                  // label="Number"
                  // InputLabelProps={{
                    //   shrink: true,
                    // }}
                    />
                </div>
              <label className="mx-auto flex-col flex text-black text-2xl mb-2 ">
                {" "}
                description
                </label>
                <div className='mx-auto flex-col flex text-black text-2xl'>

                <TextField
                  id="standard-number"
                     placeholder='workspace description'
                  multiline
                  rows={4}
                  // label="Number"
                  // InputLabelProps={{
                  //   shrink: true,
                  // }}
                />
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
            save
          </button>
        </div>
      </div>
    </>
  );
};

export default WorkspaceSetting;
