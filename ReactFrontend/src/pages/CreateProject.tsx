import React from 'react'

import Sidebar from '../components/Sidebar'
import { Input } from "antd";
const { TextArea } = Input;

function CreateProject() {
  return (
    <div className=" bg-neutral-100  items-center justify-center h-full pb-32 grid grid-cols-12">
 
      <Sidebar></Sidebar>
    
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
          <label> คำอธิบายโปรเจค</label>

      </div>
        {/* bottom ba  */}
      <div className="w-full h-[10%] bg-white border border-zinc-300 fixed bottom-0 right-0" />

      </div>
  )
}

export default CreateProject