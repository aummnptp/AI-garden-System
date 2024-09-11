import React, { ChangeEvent, DragEvent, useState } from 'react'
import { ExclamationCircleOutlined, PictureOutlined, ScheduleOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import MiniFooter from '../../components/MiniFooter'
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'
import ImageUploader from '../../components/ImageUploader'
import PaddingThenResizeUploader from '../../components/PaddingThenResizeUploader'
import ResizeThenPaddingUploader from '../../components/ResizeThenPaddingUploader'




const AIDemo = () => {
  const [uploadStep,setUploadStep] =useState(1);
  const [image, setImage] = useState<File | null>(null);
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [open, setOpen] = React.useState(false);
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

  const handleClose = () => {
    setOpen(false);
  };
  const handleToCustomStep = () => {
    if (image === null) {
      handleClickOpen();  // เรียกฟังก์ชันเปิด dialog หรือ popup
    } else {
      setUploadStep((prevStep) => Math.min(prevStep + 1, 4));
      setCustomImage(image);
      setImage(null);
    }
  };
  

  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
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
                  ${uploadStep > 1 ? 'bg-green-500' : uploadStep === 1 ? 'bg-blue-500' : 'bg-gray-400'} text-white`}
                  >{uploadStep > 1 ? (<i className="bi bi-check"></i> ) : ( 1 )}
                </div>
                <span className={uploadStep >= 1 ? 'text-black' : 'text-gray-400'}>อัปโหลดรูปภาพ</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300 mx-2"/>
              {/* Step 2 */}
              <div className="flex items-center space-x-2">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center 
                    ${uploadStep > 2 ? 'bg-green-500' : uploadStep === 2 ? 'bg-blue-500' : 'bg-gray-400'} text-white`}>
                    {uploadStep > 2 ? (<i className="bi bi-check"></i>) : (2)}
                </div>
                <span className={uploadStep >= 2 ? 'text-black' : 'text-gray-400'}>ปรับแต่ง</span>
              </div>
              {/* Line between Step 2 and Step 3 */}
              <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
              {/* Step 3 */}
              <div className="flex items-center space-x-2">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center 
                    ${uploadStep >= 3 ? 'bg-green-500' :uploadStep === 3 ? 'bg-blue-500' : 'bg-gray-400'} text-white`}
                >
                  {uploadStep >= 3 ? (<i className="bi bi-check"></i>) : (3)}
                </div>
                <span className={uploadStep >= 3 ? 'text-black' : 'text-gray-400'}>เสร็จสิ้น</span>
              </div>
            </div>       
            {/* 
             */}
            <div className='w-full h-full px-10 '>
            {uploadStep == 1 ? (
              <>
            <div className="flex  ">
            <div className=" px-10 mx-auto w-[50%] h-fit pb-10 ">
          
                <div className='w-96 h-96 text-center  flex flex-col items-center justify-center '>

                {image ? (
                  <div className="relative text-center  flex flex-col items-center justify-center  ">
                <div
                onClick={() =>{  setImage(null)}
            }// ฟังก์ชันสำหรับจัดการการคลิกเพื่อปิดรูปภาพ
                  className="absolute top-[-1rem] right-[-1rem] bg-gray-800 text-white rounded-full h-8 w-8 flex items-center justify-center p-1 hover:bg-red-500 cursor-pointer"
                >
                  <i className="bi bi-x-lg"></i>
                  </div>
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Uploaded"
                      className="object-cover w-full h-full "
                      />

                  </div>
                ) : (
                  <label htmlFor="file-upload"         
                  className="  flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-500 rounded-lg w-96 h-96 bg-gray-50 cursor-pointer">
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver} 
                    className="flex flex-col items-center justify-center text-center w-full h-full" 
           
                    >
                    <i className="bi bi-folder-fill text-blue-500 text-4xl mb-4"></i>
                    <p className="text-gray-500">คุณยังไม่ได้อัปโหลดรูปภาพ</p>
                    <p className="text-gray-500">กดเพื่อเลือก หรือ ลากไฟล์มาวางที่นี่</p>
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
                    ชื่อ AI
                  </h1>

                  <span className=" ml-3 w-fit bg-indigo-600 rounded-[5px] me-2 px-2.5 py-0.5   text-white text-lg font-normal">
                    Object Detection
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
                typesetting industry. Lorem Ipsum has been the industry's
                Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry's{" "}
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
            รูปภาพที่นำมาอัพโหลด ให้ประมวลผลต้องเป็นรูปภาพเกี่ยวกับสัตว์เลี้ยง
            ได้แก่สุนัข แมว นก กระต่าย เต่า เท่านั้น{" "}
          </p>
     
            
           
          </>
          ) : null}
          {customImage && <ImageUploader image={customImage} />}
          <div className='mt-4 flex justify-end '>
          {uploadStep >=2 &&  <Button variant='outlined' size='large' color='warning'   sx={{ mr: 2 }}   onClick={() =>{ setUploadStep((prevStep) => Math.min(prevStep - 1, 4));
              setImage(customImage);
              setCustomImage(null)}
              
            }> ย้อนกลับ</Button>}
              <Button variant='contained' size='large'    
              sx={{
                      backgroundColor: "#4f46e5",
                      "&:hover": {
                        backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                      },
              }}  onClick={handleToCustomStep}>    {uploadStep == 2 ? ("ประมวลผล") : ("ถัดไป")}</Button>
            </div>
            
            <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                          >
                            <DialogTitle id="alert-dialog-title">
                              {"กรุณาอัปโหลดภาพก่อน"}
                            </DialogTitle>
                  
                            <DialogActions>

                              <Button variant="contained"  size='large'    sx={{
                      my: "5px",
                      backgroundColor: "#4f46e5",
                      "&:hover": {
                        backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                      },
              
              }}   onClick={() => {
                               handleClose();
                              }}autoFocus >ตกลง</Button>
                            </DialogActions>
                          </Dialog>
          </div>
               
          </div>

          {/* detail conatiner */}
          <div className="mt-4 pb-5 h-full w-11/12 bg-white rounded-[15px] justify-self-center relative  ">
          {customImage && 
          
          <div>
          {/* <PaddingThenResizeUploader image={customImage} /> */}
          <ResizeThenPaddingUploader image={customImage} />
          </div>}
          </div>
        </div>
      </div>
      <MiniFooter></MiniFooter>
    </>
  );
}

export default AIDemo