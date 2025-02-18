import { useState } from "react";
import MiniFooter from "../../components/MiniFooter";
import UserListTable from "../../components/table/UserListTable";
import AdminSidebar from "../../components/AdminSidebar";

const UserList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        <AdminSidebar />
        <div className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32 h-full min-h-screen">
          <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative">
            <h1 className="p-5 ml-5 text-3xl font-medium tracking-tight text-indigo-900">
              รายชื่อของผู้ใช้
            </h1>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>
            <div className="m-6 flex justify-start">
              <input
                type="text"
                className="w-6/12 h-fit bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                placeholder="ค้นหาผู้ใช้"
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
            <div className="m-6 flex justify-start gap-4">
              <UserListTable searchQuery={searchQuery} /> 
            </div>
          </div>
        </div>
      </div>
      <MiniFooter />
    </>
  );
};

export default UserList;
