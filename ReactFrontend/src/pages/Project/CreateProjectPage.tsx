import React, { useEffect, useState } from 'react'

import Sidebar from '../../components/Sidebar'
import { Input } from "antd";
import AiData from '../../data/AiData';
import CreateProjectCard from '../../components/card/CreateProjectCard';
import { Link, useParams } from 'react-router-dom';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import axios from 'axios';
const { TextArea } = Input;


function CreateProjectPage() {
  let {workspaceId} = useParams()
  const [workspaceDetail, setWorkspaceDetail] = useState([]); 
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);


  const fetchData = () => {
    axios.all([
      axios.get(`http://localhost:3000/workspaces/${workspaceId}`),
  
    ])
    .then(axios.spread((workspaceResponse) => {
      setWorkspaceDetail(workspaceResponse.data);
   
    }))
    .catch(error => {
      console.error("There was an error fetching the data!", error);
    });
  };
  useEffect(() => {
    fetchData(); // ดึงข้อมูล workspace เมื่อ component โหลดครั้งแรก
  }, []);

  // ฟังก์ชันที่ใช้เลือกการ์ด
  const handleSelectCard = (id: number) => {
    setSelectedCardId(id);
  };

  return (
    <div className='flex h-full min-h-screen bg-neutral-100'>

      <Sidebar workspaceName={workspaceDetail.name} />

      <div className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen ">
 
      {/* ml-5 mb-5 text-3xl font-medium tracking-tight 
      text-indigo-900  */}
      {/* create container */}
      <div className='px-8 py-2 col-span-10 mt-4 pb-5 h-fit  w-[95%] bg-white rounded-[15px] justify-self relative '>
        <h1 className="text-indigo-900 text-4xl font-medium  leading-loose">สร้างโปรเจคใหม่</h1>
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
      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">ประเภท</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
        >
          <FormControlLabel value="รูปภาพและวิดีโอ " control={<Radio />} label="รูปภาพ และ วิดีโอ " />
          <FormControlLabel value="รูปภาพ" control={<Radio />} label="รูปภาพ" />
          <FormControlLabel value="วิดีโอ" control={<Radio />} label="วิดีโอ" />
        </RadioGroup>
      </FormControl>
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
      <div className=" h-fit  grid grid-cols-3 justify-self-center relative">
        {/* card */}
        {AiData.map((data)=>(
        <CreateProjectCard id={data.id} name={data.name} aiDesc={data.aiDesc} tags={data.tags} img={data.img} type={data.type}
        isSelected={data.id === selectedCardId} // เช็คว่าการ์ดถูกเลือกหรือไม่
        onSelect={() => handleSelectCard(data.id)} // ส่งฟังก์ชัน onClick

        ></CreateProjectCard>
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
                focus:outline-none 
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

export default CreateProjectPage