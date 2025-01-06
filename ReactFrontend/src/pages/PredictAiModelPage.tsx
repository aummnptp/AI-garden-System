import React, { ChangeEvent, DragEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MiniFooter from '../components/MiniFooter';
import Sidebar from "../components/Sidebar";
import ProjectData from "../data/ProjectData";
import { Button, Skeleton } from '@mui/material';
import ImageUploader from '../components/ImageUploader';
import axios from 'axios';
import DemoPredictResult from '../components/aiDisplay/DemoPredictResult';
import { CloseOutlined, EditOutlined, SaveOutlined } from '@mui/icons-material';
import AddNoteDialog from '../components/ืNoteDialog';

interface PredictResult {
  ai_type: string;
  prediction: any;
  regression_params?: any | null;
}
const PredictAiModelPage: React.FC = () => {
  const { workspaceId, projectId } = useParams<{ workspaceId?: string, projectId?: string }>();
  const { modelId } = useParams<{ modelId: string }>();
  const [uploadStep, setUploadStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [customedImageUrl, setCustomedImageUrl] = useState<string | null>(null);
  const [customImage, setCustomImage] = useState<File | null>(file);
  const [predictResult, setPredictResult] = useState<PredictResult | null>(null);

  const [note, setNote] = useState(''); // State for note
  const [isEditing, setIsEditing] = useState(false); // State for editing mode
  const [savedNote, setSavedNote] = useState(''); // State for saved note

  const navigate = useNavigate();

  if (typeof workspaceId === 'undefined' || typeof projectId === 'undefined') {
    return <div>ไม่มี ID ของพื้นที่ทำงานหรือ ID ของโครงการ</div>;
  }

  const workspaceIdNum = parseInt(workspaceId, 10);
  const projectIdNum = parseInt(projectId, 10);

  const workspace = ProjectData.find(ws => ws.workspaceId === workspaceIdNum);

  if (!workspace) {
    return <div>ไม่พบรายละเอียดโปรเจก</div>;
  }

  const detail = workspace.details.find(d => d.id === projectIdNum);

  if (!detail) {
    return <div>ไม่พบรายละเอียดโปรเจก</div>;
  }

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
      const response = await axios.post(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/predict/1`, formData, {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      console.log(file.size);
      try {
        const response = await fetch(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/predict/${modelId}`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();

          // ดึงค่า prediction, regression_params และ ai_type จาก data
          const { prediction, regression_params, ai_type, response_keys } = data;

          navigate(`/workspaces/${workspaceId}/project/${projectId}/detail/test/${modelId}/result`, {
            state: {
              prediction: prediction,   // ผลลัพธ์การพยากรณ์
              regression_params: regression_params,  // ค่า regression_params สำหรับพล็อตกราฟ
              ai_type: ai_type,         // ประเภท AI เพื่อใช้แสดงผล
              file: customedImageUrl,            // ไฟล์ที่อัปโหลด
              fileName: file.name,
              response_keys: response_keys       // ชื่อไฟล์ที่อัปโหลด
            }
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  
  const handleSaveNote = () => {
    setSavedNote(note);
    setIsEditing(false);
  };

  // Handle cancel editing
  const handleCancel = () => {
    setNote(savedNote); // Revert to saved note
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        <Sidebar />

        <div className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32 h-full min-h-screen">
          <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">
            <div className="flex justify-between items-center p-5">
              <h1 className="text-3xl font-medium tracking-tight text-indigo-900 ">
                {detail.inputType === 'รูปภาพ' ? 'Upload Image' : 'Upload Video'}
              </h1>
            </div>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>

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




            <form onSubmit={handleSubmit} className="m-6 space-y-4">
            {  uploadStep == 1 ? (
              <div className="form-group">
               
                {/* <label>{detail.inputType === 'รูปภาพ' ? 'อัปโหลดไฟล์ภาพที่นี่' : 'อัปโหลดไฟล์วิดีโอที่นี่'}</label> */}
                
                {   file ? (
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
                {/* <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  accept={detail.inputType === 'รูปภาพ' ? 'image/*' : 'video/*'}
                /> */}
              </div>
            ):null}
              <div>
              {uploadStep == 2 && customImage && (
                  <ImageUploader 
                    image={customImage} 
                    onProcessUrlChange={handleProcessUrlChange} 
                  />
                )}
              </div>
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
                <>
              <DemoPredictResult   predictResult={predictResult} resultImage={customedImageUrl}/>
              <AddNoteDialog/>


                     </>
              ):(null)
              ):(null)}
              
              {/* {customedImageUrl && (
                <div className="w-1/2 mx-auto mt-4">
                  {detail.inputType === 'รูปภาพ' ? (
                    <img src={customedImageUrl} alt="Preview" className="w-full h-auto" />
                  ) : (
                    <video controls className="w-full">
                      <source src={customedImageUrl} type="video/mp4" />
                      <source src={customedImageUrl} type="video/webm" />

                      <p>เบราว์เซอร์ของคุณไม่รองรับการแสดงวิดีโอ <a href={customedImageUrl}>ดาวน์โหลดวิดีโอที่นี่</a>.</p>
                    </video>
                  )}
                </div>
              )} */}

              <div className="flex justify-end">
              {uploadStep == 1 ?(
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
                ):null}

                {uploadStep !==1 && uploadStep!==3 ?(
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
                  {uploadStep == 2 ?(   "ประมวลผล" ):("อัพโหลดอีกครั้ง")}
                </Button>):null}
              </div>
            </form>
          </div>
        </div>
      </div>
      <MiniFooter />
    </>
  );
};

export default PredictAiModelPage;
