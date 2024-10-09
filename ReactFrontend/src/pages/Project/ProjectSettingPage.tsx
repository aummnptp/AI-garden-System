import React, { ChangeEvent, DragEvent, useEffect, useState } from 'react'
import MiniFooter from '../../components/MiniFooter'
import Sidebar from '../../components/Sidebar'
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import ProjectImageInput from '../../components/input/ProjectImageInput'

const ProjectSetting = () => {
  let { workspaceId,projectId } = useParams();
  const [name, setName] = useState<string>("Medic Classification");
  const [description, setDescription] = useState<string>("Lorem ipsum dolor sit amet, consectetur adipiscing elit. ");
  const [open, setOpen] = React.useState(false);
  const [confirmText, setConfirmText] = useState(""); // สร้าง state สำหรับการเก็บค่าที่ผู้ใช้กรอก
  const [image, setImage] = useState<File | null>(null);

  // สำหรับ demo รูป *****
  const initialImageUrl = "/images/ai/dermpic.jpg"; // URL ของรูปเริ่มต้น
  useEffect(() => {
    const fetchImage = async () => {
      const response = await fetch(initialImageUrl);
      const blob = await response.blob();
      const file = new File([blob], "default-image.jpg", { type: blob.type });
      setImage(file);
    };
  
    fetchImage();
  }, []);
  // useEffect(() => {
  //   const fetchWorkspace = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:3000/workspaces/${workspaceId}/project`
  //       );
  //       const { name, description } = response.data;
  //       setName(name);
  //       setDescription(description);
  //     } catch (error) {
  //       console.error("เกิดข้อผิดพลาดในการดึงข้อมูล Workspace:", error);
  //     }
  //   };

  //   fetchWorkspace();
  // }, [workspaceId]);

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


  // ฟังก์ชันจัดการการคลิกปุ่มบันทึก
  const handleSave = async () => {
    try {
      const payload = {
        name,
        description,
      };

      // ส่งคำขอ PATCH เพื่ออัปเดต Workspace
      const response = await axios.patch(
        `http://localhost:3000/workspaces/${workspaceId}`,
        payload
      );
      window.location.href = "/workspaces";
      // จัดการเมื่ออัปเดตสำเร็จ
      console.log("อัปเดต Workspace สำเร็จ:", response.data);
      // คุณอาจต้องการนำทางไปยังหน้าต่างๆ หรือแสดงข้อความสำเร็จ
      // navigate(`/workspaces/${workspaceId}`);
    } catch (error) {
      // จัดการข้อผิดพลาด
      console.error("เกิดข้อผิดพลาดในการอัปเดต Workspace:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดต Workspace");
    }
  };

  const handleModalDelete = () => {
    setOpen(true);
  };

 
  return (
    <div className="flex h-full min-h-screen bg-neutral-100">
      {/* confirm modal delete */}
    
      {/* side bar */}
    <Sidebar workspaceName={name} />
      {/* content container */}
      <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
        <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative px-5 pt-2">
          <h1
            className="p-5  text-3xl font-medium tracking-tight 
        text-indigo-900 "
          >
          <i className="bi bi-pencil-fill"></i>  Project Setting
          </h1>
          <div className="w-full h-[0px] border border-zinc-300 mx-auto" />
          <div className="flex justify-start  ">
            {/* sticky top-[10%] bg-white w-full z-50 */}
            <ul className="flex flex-wrap -mb-px">
              <li className="me-2">
              <Link to={`/workspaces/${workspaceId}/project/${projectId}/setting`}>
                  <a
                    className="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active "
                    aria-current="page"
                  >
                    Edit
                  </a>
                </Link>
              </li>
              <li className="me-2">
                <Link to={`/workspaces/${workspaceId}/project/${projectId}/setting/access`}>
                  <a
                    href="#"
                    className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 "
                  >
                    Access Management
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div className='flex pt-8'>
            <div className='w-[30%] border rounded-[5px] border-gray-300  mx-auto  pt-8 pb-10 px-10 '>
            <label className="mx-auto flex text-black text-2xl mb-2 gap-1  ">
            <i className="bi bi-image"></i> Project image
            </label>
            
            <div className='w-full flex py-2'>
          <ProjectImageInput image={image}
              setImage={setImage}
              handleFileSelect = {handleFileSelect}
              handleDrop = {handleDrop}
              handleDragOver = {handleDragOver}/>
              </div>
              
            </div>
            <div className=" w-[70%] mx-auto items-center pt-8 pb-10   border rounded-[5px] border-gray-300 px-10">
            <label className="mx-auto flex-col flex text-black text-2xl mb-2  ">
              Project name
            </label>
            <div className="mx-auto flex-col flex text-black text-2xl mb-4">
              <TextField
                id="standard-number"
                placeholder="project name"

                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <FormControl >
            <label className=" flex-col flex text-black text-2xl mb-4 ">
              Project Type
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                >
                <FormControlLabel value="รูปภาพและวิดีโอ " control={<Radio />} label="รูปภาพ และ วิดีโอ " />
                <FormControlLabel value="รูปภาพ" control={<Radio />} label="รูปภาพ" />
                <FormControlLabel value="วิดีโอ" control={<Radio />} label="วิดีโอ" />
            </RadioGroup>
                </label>
          </FormControl>
            <label className="mx-auto flex-col flex text-black text-2xl mb-2 ">
              {" "}
             Project description
            </label>
            <div className="mx-auto flex-col flex text-black text-2xl">
              <TextField
                id="standard-number"
                placeholder="project description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

            </div>
            </div>

          </div>
        </div>
      </div>

      <div className=" pl-[20%] justify-between pr-12 w-full h-[12%]  bg-white border border-zinc-300 fixed bottom-0 right-0 flex items-center">
        <Button
          variant="contained"
          color="error"
          size="large"
          style={{ marginRight: "0.5rem" }}
          onClick={handleModalDelete}
        >
          Delete Project
        </Button>

        <Button
          size="large"
          variant="contained"
          sx={{
            backgroundColor: "#4f46e5",
            "&:hover": { backgroundColor: "#3730a3" },
          }}
          style={{ marginRight: "0.5rem" }}
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default ProjectSetting