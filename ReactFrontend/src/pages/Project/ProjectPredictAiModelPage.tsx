import React, { ChangeEvent, DragEvent, useEffect, useState } from 'react';
import {  useParams } from 'react-router-dom';
import MiniFooter from '../../components/MiniFooter';
import Sidebar from "../../components/Sidebar";
import { Alert, AlertTitle, Button, Skeleton } from '@mui/material';
import ImageUploader from '../../components/ImageUploader';
import axios from 'axios';

import AIDisPlayResultComponent from '../../components/aiDisplay/AIDisPlayResultComponent';
import SkeletonLayout from '../../components/SkeletonPageLayout';
import { useProjecteData } from '../../hook/projects/useProjectData';
import { useWorkspaceData } from '../../hook/workspaces/useWorksapceData';

interface PredictResult {
  ai_type: string;
  prediction: any;
  regression_params?: any | null;
}


const PredictAiModelPage: React.FC = () => {
  const { workspaceId, projectId } = useParams<{ workspaceId?: string, projectId?: string }>();
  const [uploadStep, setUploadStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [customedImageUrl, setCustomedImageUrl] = useState<string | null>(null);
  const [customImage, setCustomImage] = useState<File | null>(file);
  const [predictResult, setPredictResult] = useState<PredictResult | null>(null);

  const [alertText, setAlertText] = useState<string | null>(null);
  const [openAlert, setOpenAlert] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFile(file);
  };
  //
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      
    }
    
  };
  //
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomedImageUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setCustomedImageUrl(null);
    }
  };
  

  const handleProcessUrlChange = (url: string) => {
    setCustomedImageUrl(url); // รับ URL จากคอมโพเนนต์ลูก
  };
  const convertUrlToFile = async (url: string, fileName: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  };

  const handleToCustomStep = () => {

    setUploadStep((prevStep) => Math.min(prevStep + 1, 5));
    setCustomImage(file);
    setFile(null);


  };
  const handleUpload = async () => {
    setUploadStep(3);
    try {
      if (!customedImageUrl) {
        console.error('No image URL to upload');
        return;
      }

      // แปลง URL เป็นไฟล์
      const file = await convertUrlToFile(customedImageUrl, 'processedImage.jpg');

      // เตรียม FormData เพื่อส่งไฟล์
      const formData = new FormData();
      formData.append('file', file);

      // ยิง axios เพื่ออัปโหลดไฟล์และส่งค่าที่ได้รับจาก response กลับ
      const response = await axios.post(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/projects/predict/${projectId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful', response.data);

      // เก็บผลลัพธ์ใน state
      setPredictResult(response.data);

      // เปลี่ยน uploadStep เป็น 4 หลังจากอัปโหลดเสร็จสมบูรณ์
      setUploadStep(4);

    } catch (error: any) {
      console.error('Error uploading file', error);
      if (error.response && error.response.status === 400) {
        setAlertText(error.response.data.message); // ตั้งค่า alertText จาก response
        setOpenAlert(true); // เปิด Alert
        setUploadStep(2);
      }
    }
  };
  const handleUploadVideo = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }
  
    setUploadStep(2); 
  
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await axios.post(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/projects/predict/${projectId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("Upload successful", response.data);
      setPredictResult(response.data);
      setUploadStep(3); 
  
    } catch (error) {
      console.error("Error uploading file", error);
      setUploadStep(1);
    }
  };
  
  const startTimer = () => {
    setTimeout(() => {
      setOpenAlert(false); // ปิด Alert หลังจากเวลาที่กำหนด (เช่น 5 วินาที)
    }, 5000); // ตั้งค่าเป็น 5000 มิลลิวินาที = 5 วินาที
  };



  if (openAlert) {
    startTimer();
  }



  

      const { workspaceDetail, isLoadingWorkspace, } =
        useWorkspaceData();
      const { projectDetail, isLoadingProjectDetail,  } =
        useProjecteData();

   
  if (isLoadingProjectDetail || isLoadingWorkspace) return <SkeletonLayout />;


  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        {openAlert && (
                <div className="fixed top-24 w-full flex justify-center z-50 animate-fade-in-out">
                  <Alert severity="error" onClose={() => setOpenAlert(false)}>
                    <AlertTitle>Error</AlertTitle>
                    {alertText}
                  </Alert>
                </div>
              )}
        <Sidebar workspace={workspaceDetail}
          project={projectDetail}
        />

        <div className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32 h-full min-h-screen">
          {projectDetail?.input_type === "รูปภาพ" ? (
            <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">
              <div className="flex justify-between items-center p-5">
                <h1 className="text-3xl font-medium tracking-tight text-indigo-900 ">
                  {projectDetail.input_type === 'รูปภาพ' ? 'Upload Image' : 'Upload Video'}
                </h1>
              </div>
              <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>

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
                    อัปโหลดรูปภาพ
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
                    ปรับแต่งภาพ
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
                    ประมวลผล
                  </span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`rounded-full h-8 w-8 flex items-center justify-center 
                    ${uploadStep >= 4
                        ? "bg-green-500"
                        : uploadStep === 4
                          ? "bg-blue-500"
                          : "bg-gray-400"
                      } text-white`}
                  >
                    {uploadStep >= 4 ? <i className="bi bi-check"></i> : 4}
                  </div>
                  <span
                    className={uploadStep >= 4 ? "text-black" : "text-gray-400"}
                  >
                    เสร็จสิ้น
                  </span>
                </div>
              </div>




              <form onSubmit={handleUpload} className="m-6 space-y-4">
                {uploadStep == 1 ? (
                  <div className="form-group">

                    {/* <label>{projectDetail.input_type === 'รูปภาพ' ? 'อัปโหลดไฟล์ภาพที่นี่' : 'อัปโหลดไฟล์วิดีโอที่นี่'}</label> */}

                    {file ? (
                      <div className="relative text-center  flex flex-col items-center justify-center py-8 ">
                        <div
                          onClick={() => {
                            setFile(null);
                          }} // ฟังก์ชันสำหรับจัดการการคลิกเพื่อปิดรูปภาพ
                          className="absolute top-[1rem] right-[5rem] bg-gray-800 text-white rounded-full h-8 w-8 flex items-center justify-center p-1 hover:bg-red-500 cursor-pointer"
                        >
                          <i className="bi bi-x-lg"></i>
                        </div>
                        <img
                          src={URL.createObjectURL(file)}
                          style={{
                            maxWidth: "450px",
                            maxHeight: "450px",
                            minWidth: "150px",
                            minHeight: "150px",
                          }}
                          alt="Uploaded"
                          className="object-cover w-full h-full "
                        />
                      </div>
                    ) : (
                      <label
                        htmlFor="file-upload"
                        className="  mx-auto flex flex-col items-center justify-center  w-[90%] p-6 border-2 border-dashed border-blue-500 rounded-lg  h-96 bg-gray-50 cursor-pointer mt-10"
                      >
                        <div
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          className="flex flex-col items-center justify-center text-center w-full h-full"
                        >
                          <i className="bi bi-folder-fill text-blue-500 text-4xl mb-4 "></i>
                          <p className="text-gray-500">
                            คุณยังไม่ได้อัปโหลดรูปภาพ
                          </p>
                          <p className="text-gray-500">
                            กดเพื่อเลือก หรือ ลากไฟล์มาวางที่นี่
                          </p>
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                ) : null}
                <div>
                  {uploadStep == 2 && customImage && (
                    <ImageUploader
                      image={customImage}
                      onProcessUrlChange={handleProcessUrlChange}
                    />
                  )}
                </div>
                {uploadStep == 3 && (

                  <div className="w-full">
                    <div className="flex w-full ">
                      <div className=" w-[50%] text-center space-y-2  border rounded-[5px] p-10  flex justify-center ">
                        <Skeleton variant="rectangular" width={300} height={300} />
                      </div>
                      <div className=" w-[50%] text-center space-y-2  border rounded-[5px] p-10  flex flex-col justify-center ">
                        <Skeleton variant="text" width={"100%"} height={30} />
                        <Skeleton variant="text" width={"100%"} height={20} />
                        <Skeleton variant="text" width={"100%"} height={30} />
                        <Skeleton variant="text" width={"100%"} height={20} />

                      </div>
                    </div>
                  </div>
                )}
                {uploadStep == 4 && predictResult ? (
                  customedImageUrl ? (
                    <>
                      <AIDisPlayResultComponent
                        resultImage={customedImageUrl}
                        predictResult={predictResult}
                      />
                      {/* <AddNoteDialog /> */}


                    </>
                  ) : (null)
                ) : (null)}

                <div className="flex justify-end">
                  {uploadStep == 1 ? (
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: "#3b82f6",
                        "&:hover": {
                          backgroundColor: "#2563eb", // สีที่ต้องการเมื่อ hover
                        },
                      }}
                      onClick={handleToCustomStep}
                    >
                      {" "}
                      ถัดไป
                    </Button>
                  ) : null}

                  {uploadStep !== 1 && uploadStep !== 3 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: "#3b82f6",
                        "&:hover": {
                          backgroundColor: "#2563eb", // สีที่ต้องการเมื่อ hover
                        },
                      }}
                      onClick={handleUpload}
                    >
                      {uploadStep == 2 ? ("ประมวลผล") : ("อัพโหลดอีกครั้ง")}
                    </Button>) : null}
                </div>
              </form>
              
            </div>
          ) : (
            <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">
              <div className="flex justify-between items-center p-5">
                <h1 className="text-3xl font-medium tracking-tight text-indigo-900 ">
                  {projectDetail.input_type === 'รูปภาพ' ? 'Upload Image' : 'Upload Video'}
                </h1>
              </div>
              <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>

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
                    อัปโหลดวิดีโอ
                  </span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-300 mx-2" />
                {/* Step 2 */}

                {/* Step 3 */}
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
                    className={uploadStep > 2 ? "text-black" : "text-gray-400"}
                  >
                    ประมวลผล
                  </span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`rounded-full h-8 w-8 flex items-center justify-center 
                    ${uploadStep >= 3
                        ? "bg-green-500"
                        : uploadStep === 3
                          ? "bg-blue-500"
                          : "bg-gray-400"
                      } text-white`}
                  >
                    {uploadStep >= 3 ? <i className="bi bi-check"></i> : 3}
                  </div>
                  <span
                    className={uploadStep >= 3 ? "text-black" : "text-gray-400"}
                  >
                    เสร็จสิ้น
                  </span>
                </div>
              </div>

              <form onSubmit={handleUpload} className="m-6 space-y-4">
                {uploadStep == 1 ? (
                  <div className="form-group">

                    {file ? (
                      <div className="relative text-center  flex flex-col items-center justify-center py-8 ">
                        <div
                          onClick={() => {
                            setFile(null);
                          }} 
                          className="absolute top-[1rem] right-[5rem] bg-gray-800 text-white rounded-full h-8 w-8 flex items-center justify-center p-1 hover:bg-red-500 cursor-pointer"
                        >
                          <i className="bi bi-x-lg"></i>
                        </div>
                        <video
                        controls
                          src={URL.createObjectURL(file)}
                          style={{
                            maxWidth: "450px",
                            maxHeight: "450px",
                            minWidth: "150px",
                            minHeight: "150px",
                          }}
                          
                          className="object-cover w-full h-full "
                        />
                      </div>
                    ) : (
                      <label
                        htmlFor="file-upload"
                        className="  mx-auto flex flex-col items-center justify-center  w-[90%] p-6 border-2 border-dashed border-blue-500 rounded-lg  h-96 bg-gray-50 cursor-pointer mt-10"
                      >
                        <div
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          className="flex flex-col items-center justify-center text-center w-full h-full"
                        >
                          <i className="bi bi-folder-fill text-blue-500 text-4xl mb-4 "></i>
                          <p className="text-gray-500">
                            คุณยังไม่ได้อัปโหลดวิดีโอ
                          </p>
                          <p className="text-gray-500">
                            กดเพื่อเลือก หรือ ลากไฟล์มาวางที่นี่
                          </p>
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          accept="video/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                ) : null}
                {uploadStep == 2 && (

                  <div className="w-full">
                    <div className="flex w-full ">
                      <div className=" w-[50%] text-center space-y-2  border rounded-[5px] p-10  flex justify-center ">
                        <Skeleton variant="rectangular" width={300} height={300} />
                      </div>
                      <div className=" w-[50%] text-center space-y-2  border rounded-[5px] p-10  flex flex-col justify-center ">
                        <Skeleton variant="text" width={"100%"} height={30} />
                        <Skeleton variant="text" width={"100%"} height={20} />
                        <Skeleton variant="text" width={"100%"} height={30} />
                        <Skeleton variant="text" width={"100%"} height={20} />

                      </div>
                    </div>
                  </div>
                )}
                {uploadStep == 3 && predictResult ? (

                  <>
                  <AIDisPlayResultComponent
                        resultImage={''}
                        predictResult={predictResult}
                      />
                      {/* <DemoPredictResult   predictResult={predictResult} resultImage={customedImageUrl} aiDataProp={predictResult.ai_model}/> */}
                      {/* <AddNoteDialog /> */}
                  </>

                ) : (null)}




              </form>
              <div className="flex justify-end">
                {uploadStep === 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: "#3b82f6",
                      "&:hover": {
                        backgroundColor: "#2563eb", // สีที่ต้องการเมื่อ hover
                      },
                    }}
                    onClick={handleUploadVideo}
                  >
                    {uploadStep == 1 ? ("ประมวลผล") : ("อัพโหลดอีกครั้ง")}
                  </Button>) : null}
              </div>
            </div>

          )}
        </div>
      </div>
      <MiniFooter />
    </>
  );
};

export default PredictAiModelPage;
