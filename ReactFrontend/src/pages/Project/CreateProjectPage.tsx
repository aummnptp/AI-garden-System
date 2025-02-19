import React, { ChangeEvent, DragEvent, useEffect, useState } from 'react'

import Sidebar from '../../components/Sidebar'
import { Input } from "antd";
import CreateProjectCard from '../../components/card/CreateProjectCard';
import {  useNavigate, useParams } from 'react-router-dom';
import { Alert, AlertTitle, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import axios from 'axios';
import ProjectImageInput from '../../components/input/ProjectImageInput';
import { AIDataType } from '../../types/Ai';
import { useAuth } from "../../context/AuthContext"; // นำเข้า useAuth
import { useWorkspaceData } from '../../hook/workspaces/useWorksapceData';
import SkeletonLayout from '../../components/SkeletonPageLayout';
import { getImageUrl } from '../../function/util';
const { TextArea } = Input;


function CreateProjectPage() {
  let { workspaceId } = useParams()
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [inputType, setInputType] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [uploadStep, setUploadStep] = useState(1);
  const [selectedAI, setSelectedAI] = useState<AIDataType | undefined>(undefined);
  const [AIData, setAIData] = useState<AIDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [alertText, setAlertText] = useState("");
  const { user } = useAuth(); // ดึง user จาก AuthContext

  

  // ฟังก์ชันที่ใช้เลือกการ์ด
  const handleSelectCard = (id: string) => {
    const selectedCard = AIData.find(data => data.aiId === id);
    setSelectedAI(selectedCard);  // เก็บข้อมูล AI ที่ถูกเลือก
    setSelectedCardId(id);  // เก็บแค่ id ถ้าจำเป็น
    // alert(`Selected AI model: ${selectedCard?.name}`);
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

  const startTimer = () => {
    setTimeout(() => {
      setOpen(false); 
    }, 5000); 
  };

  const handleClose = () => {
    setOpen(false);
  };
  if (open) {
    startTimer();
  }

  const handleToNextStep = () => {
    if (uploadStep === 1 && (projectName === '' || projectDescription === '')) {
      setOpen(true);
      setAlertText('กรุณากรอกข้อมูลให้ครบถ้วน')

    }
    else if (uploadStep === 2 && selectedAI === undefined) {
      setOpen(true);
      setAlertText('กรุณาเลือก AI ที่ต้องการใช้งาน')
    }
    else {
      setUploadStep((prevStep) => Math.min(prevStep + 1, 5));

    }

  };



  const handleSubmit = async () => {
    const projectData = {
      name: projectName,
      description: projectDescription,
      input_type: inputType,
      ai_id: selectedCardId,
      image_path: image,
    };
    try {
      const formData = new FormData();
      formData.append("name", projectData.name);
      formData.append("description", projectData.description);
      formData.append("input_type", projectData.input_type);
      if (projectData.ai_id) {
        formData.append("ai_id", projectData.ai_id);
      }
      if (projectData.image_path) {
        formData.append("file", projectData.image_path);
      }
      // formData.append("image_path", image);
      await axios.post(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/projects/create`, formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
      navigate(`/workspaces/${workspaceId}/project-list`);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return; // ถ้า user ยังไม่มีค่า ไม่ต้องโหลด

        // ตรวจสอบ role ของ user
        const isAdmin = user.role === "admin";

        // เลือก API AI Models ตาม role
        const aiModelsUrl = isAdmin
          ? `${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models`
          : `${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/my_approved`;

        // เรียก API ทั้งสองอย่างพร้อมกัน
        const [aiModelsResponse] = await Promise.all([
          axios.get(aiModelsUrl, { withCredentials: true })
        ]);

        // ตั้งค่า State
        setAIData(aiModelsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, workspaceId]);

  const { workspaceDetail, isLoadingWorkspace } =
  useWorkspaceData();
  if (loading||isLoadingWorkspace) {
    return <SkeletonLayout />;
  }
  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        {open && (
          <div className="fixed top-24 w-full flex justify-center z-50 animate-fade-in-out">
            <Alert severity="error" onClose={handleClose}>
              <AlertTitle>Error</AlertTitle>
              {alertText}
            </Alert>
          </div>
        )}
        <Sidebar workspace={workspaceDetail} />

        <div
          onSubmit={handleSubmit}
          className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen "
        >
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
                  ${uploadStep > 1
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
                    ${uploadStep > 2
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
                    ${uploadStep > 3
                      ? "bg-green-500"
                      : uploadStep === 3
                        ? "bg-blue-500"
                        : "bg-gray-400"
                    } text-white`}
                >
                  {uploadStep > 3 ? <i className="bi bi-check"></i> : 3}
                </div>
                <span
                  className={uploadStep > 3 ? "text-black" : "text-gray-400"}
                >
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
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    variant="filled"
                    className="my-4"
                  />
                  <label className="text-black text-2xl font-medium">
                    {" "}
                    Project description
                  </label>
                  <TextArea
                    rows={4}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
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
                  {AIData.map((data:AIDataType) => (
                    <CreateProjectCard
                      id={data.aiId}
                      name={data.name}
                      aiDesc={data.description}
                      tags={data.ai_tag}
                      // img={`/images/ai/healthAi.webp`}
                      img={getImageUrl(data.imagePath)}
                      type={data.ai_type}
                      isSelected={data.aiId === selectedCardId} // เช็คว่าการ์ดถูกเลือกหรือไม่
                      onSelect={() => handleSelectCard(data.aiId)} // ส่งฟังก์ชัน onClick
                    ></CreateProjectCard>
                  ))}
                </div>
              </div>
            ) : uploadStep === 3 && selectedAI ? (
              <div className="mx-auto my-5 w-[30%] h-fit bg-white  border rounded-[15px] p-4 cursor-pointer border-1 border-gray-300 shadow-md">
                <img
                  className="w-full h-48 object-cover"
                  src={
                    getImageUrl(selectedAI.imagePath ||
                    "/images/ai/healthAi.webp")
                  } // แสดงรูปจาก selectedAI หรือรูป default
                  alt={selectedAI.name}
                />
                <h1 className="py-2 text-black text-[25px] font-semibold">
                  {selectedAI.name}
                </h1>
                <span className="mb-2 w-fit bg-sky-500 rounded-[15px] me-2 px-2.5 py-0.5 text-white text-sm font-normal">
                  {selectedAI.ai_type}
                </span>
                <p className="px-4 py-2">{selectedAI.description}</p>
                <div className="mb-4">
                  {selectedAI.ai_tag.map((tag, index) => (
                    <span
                      key={index}
                      className="w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5 text-white text-sm font-normal"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    ประเภท Project
                  </FormLabel>
                  <RadioGroup
                    row
                    value={inputType}
                    onChange={(e) => setInputType(e.target.value)}
                    defaultValue={"รูปภาพและวิดีโอ"}
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="รูปภาพและวิดีโอ"
                      control={<Radio />}
                      label="รูปภาพ และ วิดีโอ"
                    />
                    <FormControlLabel
                      value="รูปภาพ"
                      control={<Radio />}
                      label="รูปภาพ"
                    />
                    <FormControlLabel
                      value="วิดีโอ"
                      control={<Radio />}
                      label="วิดีโอ"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            ) : null}
            {/* select ai section */}
          </div>
          {/* bottom ba  */}
          <div
            className={`pr-12 w-[100%] pl-[20%] h-[12%] bg-white border border-zinc-300 fixed bottom-0 right-0 flex ${uploadStep > 1 ? "justify-between" : "justify-end"
              } items-center`}
          >
            {uploadStep > 1 ? (
              <Button

                size="large"
                variant="contained"
                sx={{
                  backgroundColor: "#4f46e5",
                  "&:hover": { backgroundColor: "#3730a3" },
                }}
                style={{ marginRight: "0.5rem" }}
                onClick={() => {
                  setUploadStep((prevStep) => Math.max(prevStep - 1, 1));
                }}
              >
                Back
              </Button>
            ) : null}
            {uploadStep == 3 ? (
              <Button
                onClick={handleSubmit}

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
            ) : (
              <Button

                size="large"
                variant="contained"
                sx={{
                  backgroundColor: "#4f46e5",
                  "&:hover": { backgroundColor: "#3730a3" },
                }}
                style={{ marginRight: "0.5rem" }}
                onClick={() => {
                  handleToNextStep();
                }}
              >
                Next Step
              </Button>
            )}
          </div>
        </div >
      </div>
    </>
  );
}

export default CreateProjectPage