import React from 'react'
import Sidebar from '../components/Sidebar'
import MiniFooter from '../components/MiniFooter'
import CustomizedTables from '../components/Table'
import EnhancedTable from '../components/WorkspaceTable'

const WorkspaceHistory = () => {
  return (
    <>
    <div className="flex h-full min-h-screen bg-neutral-100">
      {/* side bar */}
      <Sidebar></Sidebar>
      {/* content container */}
      <div className=" w-10/12 ml-auto  flex flex-col items-center pb-32  h-full min-h-screen">
      <div className="mt-5 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative ">
        <h1
          className="p-5 ml-5 text-3xl font-medium tracking-tight 
          text-indigo-900 dark:text-white "
        >
          Workspace History
        </h1>
        <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>
        {/* seach filter group */}
        <div className="m-6 flex justify-start gap-4">
          {/* <input
            type="text"
            id="first_name"
            className="w-6/12 h-fit bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="ค้นหาชื่อโปรเจค"
            required
          /> */}
          {/* <button
            type="button"
            className=" rounded-[25px] bg-white border-2  border-gray-200 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200  text-black text-lg font-normal px-5 py-2.5 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
          >
            ประเภท 
          </button>
          <button
            type="button"
            className=" rounded-[25px] bg-white border-2 border-gray-200 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200  t ext-black text-lg font-normal  px-5 py-2.5 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
          >
            tag 
          </button> */}
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

export default WorkspaceHistory