import React, { ChangeEvent, DragEvent, useEffect, useState } from "react";
import {
  ExclamationCircleOutlined,
  PictureOutlined,
  ScheduleOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import MiniFooter from "../../components/MiniFooter";
import {
  Alert,
  AlertTitle,
  Button,
  Skeleton,

} from "@mui/material";
import ImageCustomer from "../../components/ImageUploader";
import axios from "axios";
import DemoPredictResult from "../../components/DemoPredictResult";

interface Prediction {
  class_name: string;
  confidence: number;
}

interface PredictResult {
  ai_type: string;
  prediction: any;
  regression_params?: any | null;
}
const AIDemo = () => {
  const [uploadStep, setUploadStep] = useState(1);
  const [image, setImage] = useState<File | null>(null);
  // first step of customimage for rotate grayscale
  const [customImage, setCustomImage] = useState<File | null>(image);
  const [open, setOpen] = React.useState(false);
  const [customedImageUrl, setCustomedImageUrl] = useState<string | null>(null); // URL ของรูปที่กำลังแสดง
  const [predictResult, setPredictResult] = useState<PredictResult | null>(null);


  // ปิด alert หลังจากเวลาที่กำหนด (เช่น 5 วินาที)

  const startTimer = () => {
    setTimeout(() => {
      setOpen(false); // ปิด Alert หลังจากเวลาที่กำหนด (เช่น 5 วินาที)
    }, 5000); // ตั้งค่าเป็น 5000 มิลลิวินาที = 5 วินาที
  };

  const handleClose = () => {
    setOpen(false);
  };

  // เริ่มทำงาน timer เมื่อ Alert ถูกแสดง
  if (open) {
    startTimer();
  }

  //
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleToCustomStep = () => {
    if(uploadStep===1){
      if (image === null) {
        handleClickOpen(); // เรียกฟังก์ชันเปิด dialog หรือ popup
      } 
      else {
        setUploadStep((prevStep) => Math.min(prevStep + 1, 5));
        setCustomImage(image);
        setImage(null);
      }
    }    
    else {
      setUploadStep((prevStep) => Math.min(prevStep + 1, 5));
      setCustomImage(image);
      setImage(null);
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
      const response = await axios.post('http://localhost:5000/predict/1', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Upload successful', response.data);
  
      // เก็บผลลัพธ์ใน state
      setPredictResult(response.data);
  
      // เปลี่ยน uploadStep เป็น 4 หลังจากอัปโหลดเสร็จสมบูรณ์
      setUploadStep(4);
  
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        {open && (
          <div className="fixed top-24 w-full flex justify-center z-50 animate-fade-in-out">
            <Alert severity="error" onClose={handleClose}>
              <AlertTitle>Error</AlertTitle>
              กรุณาอัปโหลดภาพก่อน
            </Alert>
          </div>
        )}
        {/* content container */}
        <div className=" w-full ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
          {/* top card (create sort workspace name) */}
          <div className="mt-4 pb-5 h-full w-11/12 bg-white rounded-[15px] justify-self-center relative ">
            <h1 className="p-5 ml-5 text-3xl font-medium tracking-tight  text-indigo-900 ">
              ทดลองใช้
            </h1>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto" />

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
                  อัปโหลดรูปภาพ
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
                  ปรับแต่งภาพ
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
                  {uploadStep >3 ? <i className="bi bi-check"></i> : 3}
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
                    ${
                      uploadStep >= 4
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
            {/*
             */}
            <div className="w-full h-full px-10">
              {uploadStep == 1 ? (
                <>
                  <div className="flex  ">
                    <div className=" px-10 mx-auto w-[50%] h-fit pb-10  ">
                      <div className=" text-center  h-full flex flex-col items-center justify-center ">
                        {image ? (
                          <div className="relative text-center  flex flex-col items-center justify-center  ">
                            <div
                              onClick={() => {
                                setImage(null);
                              }} // ฟังก์ชันสำหรับจัดการการคลิกเพื่อปิดรูปภาพ
                              className="absolute top-[-1rem] right-[-1rem] bg-gray-800 text-white rounded-full h-8 w-8 flex items-center justify-center p-1 hover:bg-red-500 cursor-pointer"
                            >
                              <i className="bi bi-x-lg"></i>
                            </div>
                            <img
                              src={URL.createObjectURL(image)}
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
                            className="  flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-500 rounded-lg w-96 h-96 bg-gray-50 cursor-pointer mt-10"
                          >
                            <div
                              onDrop={handleDrop}
                              onDragOver={handleDragOver}
                              className="flex flex-col items-center justify-center text-center w-full h-full"
                            >
                              <i className="bi bi-folder-fill text-blue-500 text-4xl mb-4"></i>
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
                    </div>

                    <div className=" p-6 w-[50%]">
                      <div>
                        <div className="flex items-center">
                          <h1
                            className=" mb-2 text-3xl font-medium tracking-tight 
                text-indigo-900  "
                          >
                          Example Healh AI
                          </h1>

                          <span className=" ml-3 w-fit bg-indigo-600 rounded-[5px] me-2 px-2.5 py-0.5   text-white text-lg font-normal">
                            Classification
                          </span>
                        </div>
                        <div className=" w-full border border-zinc-300" />
                      </div>
                      {/* ai creater */}
                      <div className="flex items-center my-4">
                        <img
                          className="w-10 h-10 rounded-full border-2 "
                          src="/images/homeImage/puttipong.jpg"
                        />
                        <div className="ml-2">
                          <p className="text-black text-lg font-normal">
                            putthipong Chobngam
                          </p>
                          <p className="text-indigo-900 text-base font-medium">
                            ผู้สร้าง
                          </p>
                        </div>
                      </div>
                      <p className=" text-neutral-700 text-lg font-normal">
                        รายละเอียด
                      </p>
                      <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's Lorem Ipsum is simply dummy text of the
                        printing and typesetting industry. Lorem Ipsum has been
                        the industry's{" "}
                      </p>
                      <div className="mb-2 mt-4">
                        <span className=" w-fit bg-indigo-400 rounded-[5px] me-2 px-2.5 py-0.5   text-white text-lg font-normal">
                          tag1
                        </span>
                        <span className=" w-fit bg-indigo-400 rounded-[5px] me-2 px-2.5 py-0.5   text-white text-lg font-normal">
                          tag2
                        </span>
                        <span className=" w-fit bg-indigo-400 rounded-[5px] me-2 px-2.5 py-0.5   text-white text-lg font-normal">
                          tag3
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="  ml-3  ">
                    <ExclamationCircleOutlined style={{ color: "#404040" }} />
                    <span className="text-neutral-700 text-lg font-normal">
                      เกี่ยวกับรูปภาพและวิดีโอที่จะนำไปประมวลผล
                    </span>
                  </div>
                  <p className="ml-3">
                  ต้องเป็นรูปภาพเกี่ยวกับโรค ที่จัดอยู่ในกลุ่มคลอบคลุมดังนี้
                  ตัวอย่างชื่อโรค , ตัวอย่างชื่อโรค{" "}
                  </p>
                </>
              ) : null}
              {/* upload step 2 customimaage */}
              {uploadStep == 2 && customImage && (
                <ImageCustomer
                  image={customImage}
                  onProcessUrlChange={handleProcessUrlChange}
                />
              )}
              {uploadStep == 3 &&(
  
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
              <DemoPredictResult   predictResult={predictResult} resultImage={customedImageUrl}/>
              ):(null)
              ):(null)}

           
              <div className="mt-4 flex justify-end ">
                {uploadStep == 2 && (
                  <Button
                    variant="outlined"
                    size="large"
                    color="warning"
                    sx={{ mr: 2 }}
                    onClick={() => {

                        setUploadStep((prevStep) => Math.min(prevStep - 1, 4));
                        setImage(customImage);
                        setCustomImage(null);
                     
                    }
                  }
                  >
                    {" "}
                    ย้อนกลับ
                  </Button>
                )}
                {uploadStep < 2 && (
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#4f46e5",
                    "&:hover": {
                      backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                    },
                  }}
                  onClick={handleToCustomStep}
                >
                  {" "}
                  ถัดไป
                </Button>
                 )}
                     {uploadStep == 2 && (
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#4f46e5",
                    "&:hover": {
                      backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                    },
                  }}
                  onClick={handleUpload}
                >
                  {" "}
                  ประมวลผล
                </Button>

                  )}
                {uploadStep == 4 && (
                  <div className=" w-full flex  justify-between">
                    <div className=" w-[50%] justify-center flex">
                     <Button
                     variant="outlined"
                       size="large"
                  onClick={() => {
                    setUploadStep(1);
                    setImage(null);
                    setPredictResult(null);
                    setCustomImage(null);}
                  }
                  >
                  {" "}
                  ลองอีกครั้ง
                </Button>
                  <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#4f46e5",
                    "&:hover": {
                      backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                    },
                  }}
               
                  >
                  {" "}
                  ขอใช้งาน
                </Button>
                </div>
                    <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#4f46e5",
                    "&:hover": {
                      backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                    },
                  }}
                
                  >
                  {" "}
                  กลับไปยังหน้ารายชื่อ AI
                </Button>
                  </div>
                
                      )}
              </div>
            </div>
          </div>

          {/* detail conatiner */}
          <div className="mt-4 pb-5 h-full w-11/12 bg-white rounded-[15px] justify-self-center relative   ">
       
          </div>
        </div>
      </div>
      <MiniFooter></MiniFooter>
    </>
  );
};

export default AIDemo;
