import React, { ChangeEvent, DragEvent, useEffect, useState } from 'react'

import Sidebar from '../../components/Sidebar'
import { Input } from "antd";
import AiData from '../../data/AiData';
import CreateProjectCard from '../../components/card/CreateProjectCard';
import { Link, useParams } from 'react-router-dom';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import axios from 'axios';
import ProjectImageInput from '../../components/input/ProjectImageInput';
const { TextArea } = Input;


function CreateProjectPage() {
  let {workspaceId} = useParams()
  const [workspaceDetail, setWorkspaceDetail] = useState([]); 
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [uploadStep, setUploadStep] = useState(1);
  const [seletedAI, setSelectedAI] = useState();
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

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setImage(file);
  };
  //
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };
  //
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex h-full min-h-screen bg-neutral-100">
      <Sidebar workspaceName={workspaceDetail.name} />

      <div className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen ">
        {/* ml-5 mb-5 text-3xl font-medium tracking-tight 
      text-indigo-900  */}
        {/* create container */}
        <div className="px-8 py-2 col-span-10 mt-4 pb-5 h-fit  w-[95%] bg-white rounded-[15px] justify-self relative ">
          <h1 className="text-indigo-900 text-4xl font-medium  leading-loose">
            Create New Project
          </h1>
          <div className="mb-10 h-[0px] border border-zinc-300 mx-auto" />

          {/* upload step */}
          <div className="flex items-center justify-between w-full px-20 py-4 my-4  ">
            {/* Step 1 */}
            <div className="flex items-center space-x-2">
              <div
                className={`rounded-full h-8 w-8 flex items-center justify-center 
                  ${
                    uploadStep > 1
                      ? "bg-green-500"
                      : uploadStep === 1
                      ? "bg-blue-500"
                      : "bg-gray-400"
                  } text-white`}
              >
                {uploadStep > 1 ? <i className="bi bi-check"></i> : 1}
              </div>
              <span
                className={uploadStep >= 1 ? "text-black" : "text-gray-400"}
              >
                ใส่ข้อมูล
              </span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-2" />
            {/* Step 2 */}
            <div className="flex items-center space-x-2">
              <div
                className={`rounded-full h-8 w-8 flex items-center justify-center 
                    ${
                      uploadStep > 2
                        ? "bg-green-500"
                        : uploadStep === 2
                        ? "bg-blue-500"
                        : "bg-gray-400"
                    } text-white`}
              >
                {uploadStep > 2 ? <i className="bi bi-check"></i> : 2}
              </div>
              <span
                className={uploadStep >= 2 ? "text-black" : "text-gray-400"}
              >
                เลือก AI
              </span>
            </div>
            {/* Line between Step 2 and Step 3 */}
            <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
            {/* Step 3 */}
            <div className="flex items-center space-x-2">
              <div
                className={`rounded-full h-8 w-8 flex items-center justify-center 
                    ${
                      uploadStep > 3
                        ? "bg-green-500"
                        : uploadStep === 3
                        ? "bg-blue-500"
                        : "bg-gray-400"
                    } text-white`}
              >
                {uploadStep > 3 ? <i className="bi bi-check"></i> : 3}
              </div>
              <span className={uploadStep > 3 ? "text-black" : "text-gray-400"}>
                เลือกประเภท Project
              </span>
            </div>
          </div>
          {uploadStep == 1 ? (
            <div className="flex pt-8">
              <div className="w-[30%] border rounded-[5px] border-gray-300  mx-auto  pt-8 pb-10 px-10 ">
                <ProjectImageInput
                  image={image}
                  setImage={setImage}
                  handleFileSelect={handleFileSelect}
                  handleDrop={handleDrop}
                  handleDragOver={handleDragOver}
                />
              </div>
              <div className="w-[70%] border rounded-[5px] border-gray-300  mx-auto  pt-8 pb-10 px-10 ">
                <label className="mt-10 text-black text-2xl font-medium">
                  {" "}
                  Project name{" "}
                </label>
                <Input
                  placeholder="Project name"
                  variant="filled"
                  className="my-4"
                />
                <label className="text-black text-2xl font-medium">
                  {" "}
                  Project description
                </label>
                <TextArea
                  rows={4}
                  variant="filled"
                  placeholder="Projet description"
                  className="my-4 mb-16"
                />
              </div>
            </div>
          ) : uploadStep == 2 ? (
          <div>
            <p className="ml-4 mb-6 text-black text-2xl font-medium">
              เลือก AI ที่ต้องการใช้งาน
            </p>

            <label className="ml-4  text-zinc-400 text-sm font-normal">
              ค้นหาด้วยชื่อ Ai
            </label>
            <div className="ml-4 flex justify-between">
              <Input
                placeholder="ค้นหาด้วยชื่อ AI"
                variant="filled"
                className=" w-4/12"
              />
            </div>

            <div className=" h-fit  grid grid-cols-3 justify-self-center relative">
            
              {AiData.map((data) => (
                <CreateProjectCard
                  id={data.id}
                  name={data.name}
                  aiDesc={data.aiDesc}
                  tags={data.tags}
                  img={data.img}
                  type={data.type}
                  isSelected={data.id === selectedCardId} // เช็คว่าการ์ดถูกเลือกหรือไม่
                  onSelect={() => handleSelectCard(data.id)} // ส่งฟังก์ชัน onClick
                ></CreateProjectCard>
              ))}
            </div>
          </div>

          ) : uploadStep == 3 ?(

             <div
    className={`mx-auto my-5 w-[30%] h-fit bg-white shadow border rounded-[15px] p-4 cursor-pointer ${
   'border-1 border-gray-300 shadow-md'
    }`}
// เรียกฟังก์ชันเมื่อการ์ดถูกคลิก
  >
          <img
            className=" w-full h-48  
            object-cover"
            src={"/images/ai/healthAi.webp"}
            />

          <h1 className=" py-2 text-black text-[25px] font-semibold">
            {`Health Example AI`}
          </h1>
       
          <span className="  mb-2 w-fit bg-sky-500 rounded-[15px] me-2 px-2.5 py-0.5   text-white text-sm font-normal">
          {`Classification`}
          </span>
          <p className=" px-4 py-2">
          {`Lorem Ipsum is simply dummy text of the printi ng and typesetting industry. Lorem Ipsum has been the`}
          </p>
         <span  className="w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5   text-white text-sm font-normal">tag1</span>
         <span  className="w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5   text-white text-sm font-normal">tag2</span>

          <FormControl>
         <FormLabel id="demo-row-radio-buttons-group-label">ประเภท Project</FormLabel>
         <RadioGroup
           row
           aria-labelledby="demo-row-radio-buttons-group-label"
           name="row-radio-buttons-group"
           defaultValue={"รูปภาพและวิดีโอ"}
         >
           <FormControlLabel value="รูปภาพและวิดีโอ" control={<Radio />} label="รูปภาพ และ วิดีโอ " />
           <FormControlLabel value="รูปภาพ" control={<Radio />} label="รูปภาพ" />
           <FormControlLabel value="วิดีโอ" control={<Radio />} label="วิดีโอ" />
         </RadioGroup>
       </FormControl> 
          <div className='  mb-4'>
          {/* {props.tags.map((tag) => (
            ))} */}
            </div>
        </div>
          ) : null}
          {/* select ai section */}




     
        </div>
        {/* bottom ba  */}
        <div className="pr-12 w-full h-[12%]  bg-white border border-zinc-300 fixed bottom-0 right-0 flex justify-end items-center">
          {uploadStep ==3?(
            <Link to={`/workspaces/${workspaceId}/project-list`}>
            <Button
            size="large"
            variant="contained"
            sx={{
              backgroundColor: "#4f46e5",
              "&:hover": { backgroundColor: "#3730a3" },
            }}
            style={{ marginRight: "0.5rem" }}
            >
            Create
          </Button>
          </Link>
          ):(<Button
            size="large"
            variant="contained"
            sx={{
              backgroundColor: "#4f46e5",
              "&:hover": { backgroundColor: "#3730a3" },
            }}
            style={{ marginRight: "0.5rem" }}
            onClick={() => {
              setUploadStep((prevStep) => Math.min(prevStep + 1, 5));
            }}
          >
            Next Step
          </Button>)}

          {/* <Link to={`/workspaces/${workspaceId}/project-list`}>
      </Link> */}
        </div>
      </div>
    </div>
  );
}

export default CreateProjectPage