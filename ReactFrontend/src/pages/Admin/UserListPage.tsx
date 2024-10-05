import React from 'react'
import MiniFooter from '../../components/MiniFooter'
import UserListTable from '../../components/table/UserListTable'

const UserList = () => {
  return (
    <>
    <div className=" bg-neutral-100  items-center justify-center h-full pb-32 grid grid-cols-1">
      {/* top card (create sort workspace name) */}
      <div className="mt-4 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative ">
        <h1
          className="p-5 ml-5 text-3xl font-medium tracking-tight 
          text-indigo-900 "
        >
          User List
        </h1>
        <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto "></div>
        <div className="m-6 flex justify-start">
        
        </div>
        <div className="m-6 flex justify-start gap-4">
          <input
            type="text"
            id="first_name"
            className="w-6/12 h-fit bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  "
            placeholder="ค้นหาผู้ใช้"
            required
          />
        </div>
        <div className="m-6 flex justify-start gap-4">
      <UserListTable/>
      </div>
      </div>

      {/* card container */}

    </div>
          <MiniFooter></MiniFooter>
          </>
  )
}

export default UserList