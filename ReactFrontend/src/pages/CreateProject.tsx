import React from 'react'

import Sidebar from '../components/Sidebar'
import { Input } from "antd";
const { TextArea } = Input;

function CreateProject() {
  return (
    <div className='flex h-full min-h-screen bg-neutral-100'>

      <Sidebar></Sidebar>

    <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center justify-center h-full pb-32 ">
 
     
      {/* create container */}
      <div className='p-8 col-span-10 mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self relative '>
        <h1 className="text-indigo-900 text-4xl font-medium font-['Roboto'] leading-loose">สร้างโปรเจคใหม่</h1>
        <div className=" h-[0px] border border-zinc-300 mx-auto"></div>
          <label> ชื่อโปรเจค </label>
          <Input
                      placeholder="Workspace Name" 
                      variant="filled"
                      className="my-4"
                    />
          <label> คำอธิบายโปรเจค</label>
          <TextArea
                      rows={4}
                      variant="filled"
                      placeholder="คำอธิบายworkspace"
                    />
          
          {/* select ai section */}
          <label> เลือก AI ที่ต้องการใช้งาน</label>
      <Input
                      placeholder="ค้นหาด้วยชื่อ AI" 
                      variant="filled"
                      className="my-4"
                    />
      {/* card ai container */}
      {/* card */}
      <div className="mt-16 h-fit w-11/12 grid grid-cols-3  justify-self-center relative ">
        {/* card */}
        <div className="m-10 w-10/12 bg-white shadow border items-center ">
          <img
            className=" w-full h-3/6   
            object-cover"
            src="../../public/images/homeImage/puttipong.jpg"
            />

          <h1 className="mb-2 text-black text-[25px] font-semibold">
            Project Name
          </h1>
       
          <span className="mb-2 w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5  dark:bg-blue-900 dark:text-blue-300 text-white text-xs font-normal">
            AI Type
          </span>
          <p>
            Lorem Ipsum is simply dummy text of the printi ng and typesetting
            industry. Lorem Ipsum has been the ...
          </p>
          <div className='mb-2'>
              <span className="w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5  dark:bg-blue-900 dark:text-blue-300 text-white text-xs font-normal">Default</span>
              <span className="w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5  dark:bg-blue-900 dark:text-blue-300 text-white text-xs font-normal">Default</span>
              <span className="w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5  dark:bg-blue-900 dark:text-blue-300 text-white text-xs font-normal">Default</span>
            </div>
        </div>

        <div className="m-10 w-10/12 bg-white rounded-[10px] border border-zinc-400 items-center flex p-2"></div>
        <div className="m-10 w-10/12 bg-white rounded-[10px] border border-zinc-400 items-center flex p-2"></div>
      </div>

      </div>
        {/* bottom ba  */}
      <div className="w-full h-[10%] bg-white border border-zinc-300 fixed bottom-0 right-0" />
      </div>
      </div>
  )
}

export default CreateProject