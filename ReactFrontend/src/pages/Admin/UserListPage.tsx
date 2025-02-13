
import MiniFooter from '../../components/MiniFooter'
import UserListTable from '../../components/table/UserListTable'
import AdminSidebar from '../../components/AdminSidebar'

const UserList = () => {
  return (
    <>
    <div className=" flex h-full min-h-screen bg-neutral-100">
    <AdminSidebar></AdminSidebar>
      {/* top card (create sort workspace name) */}
      <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
      <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative">
     
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
          />
        </div>
        <div className="m-6 flex justify-start gap-4">
      <UserListTable/>
      </div>
      </div>
      </div>
      {/* card container */}

    </div>
          <MiniFooter></MiniFooter>
          </>
  )
}

export default UserList