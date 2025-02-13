import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import MiniFooter from '../../components/MiniFooter'
import CustomizedTables from '../../components/table/Table'
import EnhancedTable from '../../components/table/WorkspaceTable'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useFetchQuery } from '../../hook/useFetchQuery'

const WorkspaceHistoryPage = () => {
  let {workspaceId} = useParams()

    const {
      data: workspaceDetail,
      isLoading: isLoadingWorkspaceDetail,
      error: errorWorkspaceDetail,
    } = useFetchQuery(
      ["workspace-detail", workspaceId ?? ""],
      `/workspaces/detail/${workspaceId}`
    );
  
  return (
    <>
    <div className="flex h-full min-h-screen bg-neutral-100">
      {/* side bar */}
      <Sidebar workspace={workspaceDetail} />   
      <div className=" w-10/12 ml-auto  flex flex-col items-center pb-32  h-full min-h-screen">
      <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative ">
        <h1
          className="p-5 ml-5 text-3xl font-medium tracking-tight 
          text-indigo-900  "
        >
          Workspace History
        </h1>
        <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>
        {/* seach filter group */}
        <div className="m-6 flex justify-start gap-4">
         
      
        </div>
        {/* table content */}
        <div className='px-6'>
        {/* <CustomizedTables/> */}
        </div>
        <div className='px-6'>
        <EnhancedTable></EnhancedTable>
        </div>
       
      </div>
      </div>
      
    </div>
    <MiniFooter></MiniFooter>
  </>
  )
}

export default WorkspaceHistoryPage