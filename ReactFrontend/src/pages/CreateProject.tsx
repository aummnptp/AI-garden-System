import React from 'react'

import Sidebar from '../components/Sidebar'
import { Input } from "antd";
import AiData from '../data/AiData';
import CreateProjectCard from '../components/CreateProjectCard';
import { Link, useParams } from 'react-router-dom';
import Workspace from './Workspace';
const { TextArea } = Input;


function CreateProject() {
  let {workspaceId} = useParams()

  return (
    <div className='flex h-full min-h-screen bg-neutral-100'>

      <Sidebar></Sidebar>

    <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center justify-center h-full pb-32 ">
 
     
      {/* create container */}
      <div className='p-8 col-span-10 mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self relative '>
        <h1 className="text-indigo-900 text-4xl font-medium font-['Roboto'] leading-loose">สร้างโปรเจคใหม่</h1>
        <div className="mb-10 h-[0px] border border-zinc-300 mx-auto"/>
          <label className='mt-10 text-black text-2xl font-medium'> ชื่อโปรเจค </label>
          <Input
                      placeholder="Workspace Name" 
                      variant="filled"
                      className="my-4"
                    />
          <label className='text-black text-2xl font-medium'> คำอธิบายโปรเจค</label>
          <TextArea
                      rows={4}
                      variant="filled"
                      placeholder="คำอธิบายworkspace"
                         className="my-4 mb-16"
                    />
          
          {/* select ai section */}
          <p className='ml-4 mb-6 text-black text-2xl font-medium'> เลือก AI ที่ต้องการใช้งาน</p>
          
          <label className='ml-4  text-zinc-400 text-sm font-normal'> ค้นหาด้วยชื่อ Ai</label>
          <div className='ml-4 flex justify-between'>
            <Input
                      placeholder="ค้นหาด้วยชื่อ AI" 
                      variant="filled"
                      className=" w-4/12"
                      />

            </div>
      {/* card ai container */}
      {/* card */}
      <div className=" h-fit  grid grid-cols-3  justify-self-center relative">
        {/* card */}
        {AiData.map((data)=>(
        <CreateProjectCard id={data.id} name={data.name} aiDesc={data.aiDesc} tags={data.tags} img={data.img} type={data.type}></CreateProjectCard>
      ))}
       
      </div>

      </div>
        {/* bottom ba  */}
      <div className="pr-12 w-full h-[12%]  bg-white border border-zinc-300 fixed bottom-0 right-0 flex justify-end items-center" >
      <Link to={`/workspaces/${workspaceId}/project-list`}>
            <button
              type="button"
              className=" w-fit  bg-indigo-600 hover:bg-blue-800
              focus:ring-4 focus:ring-blue-300 rounded-lg px-5 py-2.5 me-2 
              dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800
              text-center text-white text-xl font-light"
              >
             สร้างโปรเจค
            </button>
      </Link>
      </div>

      </div>
      </div>
  )
}

export default CreateProject