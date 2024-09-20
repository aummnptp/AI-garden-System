import { Box, Button, Tab, TextField } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import {Crop, FormatSize, Rotate90DegreesCcw, RotateLeft, RotateRight, SwapHoriz,SwapVert, ThreeSixty, ZoomOutMap} from '@mui/icons-material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
interface ImageUploaderProps {
    image: File;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ image }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [onProcessUrl, setOnProcessUrl] = useState<string | null>(null);
    const [imageBfResize, setImageBfResize] = useState<string | null>(null); // State for storing original image before resize
    const [rotation, setRotation] = useState<number>(0); // state for rotation
    const [imageBfPadding, setImageBfPadding] = useState<string | null>(null); // State for storing original image before resize
    const [isGrayscale, setIsGrayscale] = useState<boolean>(false); // state for grayscale
    const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false); // state for flip left-right
    const [flipVertical, setFlipVertical] = useState<boolean>(false); // state for flip top-bottom
    const [isResizing, setIsResizing] = useState<boolean>(false); // state for resizing
    const [resizeWidth, setResizeWidth] = useState<number>(300); // width for resizing
    const [resizeHeight, setResizeHeight] = useState<number>(300); // height for resizing
    const [imageWidthValue, setImageWidthValue] = useState<number>(300); // width for resizing
    const [imageHeightValue, setIMageHeightValue] = useState<number>(300); // height for resizing
    const [isPadding, setIsPadding] = useState<boolean>(false); // state for resizing
    const [padding, setPadding] = useState<number>(0); // width for resizing
    

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      setValue(newValue);
    };

    const handleRotateLeft = () => {    
        setRotation((prev) => prev - 90);
    };

    const handleRotateRight = () => {
        setRotation((prev) => prev + 90);
    };

    const toggleFlipHorizontal = () => {
        setFlipHorizontal((prev) => !prev);
      };
    
      const toggleFlipVertical = () => {
        setFlipVertical((prev) => !prev);
      };
    const toggleGrayscale = () => {
        setIsGrayscale((prev) => !prev);
    };
    const handleResize = () => {
        setImageBfResize(selectedImage);
        // handleCanclePadding();
        setIsResizing(true); // เข้าสู่โหมด Resize
      };
      const handlePadding = () => {
        setImageBfPadding(selectedImage);
        // handleCancleResize();
        setIsPadding(true); // เข้าสู่โหมด Resize
      };
    
    const handleResizeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResizeWidth(parseInt(e.target.value, 10));
      };
    
      const handleResizeHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResizeHeight(parseInt(e.target.value, 10));
      };



      useEffect(() => {
        if (image) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const img = new Image(); // สร้างออบเจ็กต์ Image
            img.src = reader.result as string; // ตั้ง src ให้กับ base64 string จาก FileReader
            img.onload = () => {
              setResizeWidth(img.width); // ตั้งค่า width เป็นขนาดของรูปภาพ
              setResizeHeight(img.height); // ตั้งค่า height เป็นขนาดของรูปภาพ
              setImageWidthValue(img.width)
              setIMageHeightValue(img.height)
              setSelectedImage(reader.result as string); // เก็บ base64 string ไว้ใน selectedImage หลังจากตั้งค่า width/height เสร็จแล้ว
            };
          };
          reader.readAsDataURL(image); // อ่านไฟล์ภาพจาก props
        }
      }, [image]); // useEffect จะทำงานเมื่อ image เปลี่ยนแปลง

      useEffect(() => {
        if (selectedImage && canvasRef.current && !isResizing && !isPadding) {
          
          const image = new Image();
          image.src = selectedImage;
          image.onload = () => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext('2d');
      
            const angleInRadians = (rotation * Math.PI) / 180;
            const absCos = Math.abs(Math.cos(angleInRadians));
            const absSin = Math.abs(Math.sin(angleInRadians));
      
            // คำนวณขนาดของ canvas หลังจากการหมุน
            const newCanvasWidth = image.width * absCos + image.height * absSin;
            const newCanvasHeight = image.width * absSin + image.height * absCos;
      
            canvas.width = newCanvasWidth;
            canvas.height = newCanvasHeight;
      
            ctx?.clearRect(0, 0, canvas.width, canvas.height); // ล้าง canvas เดิม
      
            ctx?.save();
            ctx?.translate(canvas.width / 2, canvas.height / 2); // ย้ายจุดศูนย์กลาง canvas ไปตรงกลาง
      
            // การ Flip ต้องทำก่อนการหมุน
            if (flipHorizontal) {
              ctx?.scale(-1, 1); // Flip แนวนอน
            }
      
            if (flipVertical) {
              ctx?.scale(1, -1); // Flip แนวตั้ง
            }
      
            // หมุนภาพตามค่าที่ได้
            ctx?.rotate(angleInRadians);
      
            // วาดภาพที่ Flip และหมุนแล้ว
            ctx?.drawImage(image, -image.width / 2, -image.height / 2);
            ctx?.restore();
      
            // ตรวจสอบว่าต้องทำ Grayscale หรือไม่
            if (isGrayscale) {
              const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
              if (imageData && ctx) {
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                  const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                  data[i] = avg;     // Red
                  data[i + 1] = avg; // Green
                  data[i + 2] = avg; // Blue
                }
                ctx.putImageData(imageData, 0, 0);
              }
            }
      
            // เก็บ URL ของภาพที่ประมวลผลแล้ว
            const onProcessUrl = canvas.toDataURL('image/png');
            setOnProcessUrl(onProcessUrl);
          };
        }
      }, [selectedImage, rotation, isGrayscale, flipHorizontal, flipVertical, isResizing, isPadding, imageBfResize, imageBfPadding]);
      

   
      useEffect(() => {
        if (isResizing && onProcessUrl && canvasRef.current) {
          const image = new Image();
          image.src = onProcessUrl;
          image.onload = () => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext('2d');
    
            canvas.width = resizeWidth;
            canvas.height = resizeHeight;
    
            ctx?.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
            ctx?.drawImage(image, 0, 0, resizeWidth, resizeHeight); // draw resized image
          };
        }
      }, [resizeWidth, resizeHeight, isResizing ]);

      useEffect(() => {
        if (isPadding && onProcessUrl && canvasRef.current) {
  
          const image = new Image();
          image.src = onProcessUrl;
          image.onload = () => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext('2d');

            const paddedWidth = image.width + padding * 2;
            const paddedHeight = image.height + padding * 2;
            canvas.width = paddedWidth;
            canvas.height = paddedHeight;

            ctx?.clearRect(0, 0, canvas.width, canvas.height);
      
            ctx?.drawImage(image, padding, padding);
          };
        }
      }, [padding, isPadding ]);

      
      const handleSaveResize = () => {
        if (selectedImage && canvasRef.current) {
          const resizedImageUrl = canvasRef.current.toDataURL('image/png');
          setSelectedImage(resizedImageUrl); // อัปเดตรูปที่ถูก resize ลงใน selectedImage
          setIsResizing(false); // ออกจากโหมด Resize
          setOnProcessUrl(resizedImageUrl); // อัปเดต URL สำหรับดาวน์โหลด
          setFlipHorizontal(false)
          setFlipVertical(false)
          setRotation(0)
          setPadding(0)
          setImageWidthValue(resizeWidth)
          setIMageHeightValue(resizeHeight)
        }
      };
      const handleSavePadding = () => {
        if (selectedImage && canvasRef.current) {
          const paddedImageURL = canvasRef.current.toDataURL('image/png');
          setSelectedImage(paddedImageURL); // อัปเดตรูปที่ถูก resize ลงใน selectedImage
          setIsPadding(false); // ออกจากโหมด Resize
          setOnProcessUrl(paddedImageURL); // อัปเดต URL สำหรับดาวน์โหลด
          setFlipHorizontal(false)
          setFlipVertical(false)
          setRotation(0)
          setPadding(0)
        }
      };
     
      const handleCancleResize = () => {
        if(isResizing ==true){
            setOnProcessUrl(imageBfResize);
            setIsResizing(false); // ออกจากโหมด Resize
            setSelectedImage(imageBfResize)
        }
      };
      const handleCanclePadding = () => {
        if(isPadding ==true){
            setOnProcessUrl(imageBfPadding);
            setIsPadding(false); // ออกจากโหมด Resize
            setSelectedImage(imageBfPadding)
       
        }
      };
      const handleCancleCustomState = () => {
          handleCancleResize();
          handleCanclePadding();

      };

    return (
      <div className="flex w-full ">
        {selectedImage && (
          <div className="  mx-auto w-full ">
            {/* Display Processed Image */}
            <div className=" px-10 mx-auto w-full h-fit pb-10 flex ">
            <div className=' w-[60%] flex   h-fit pt-20'>
                <canvas   className=" mx-auto max-w-[500px] max-h-[500px] border-2 border-dashed border-black  justify-center " 
                  ref={canvasRef}
                  style={{ maxWidth: "500px", maxHeight: "500px" }}
                ></canvas>
              </div>
              
              {onProcessUrl && (
                <div className="pt-4  w-[40%] ">
                    <div className=' w-full px-2 '>
                    <TabContext value={value} >
                    <Box sx={{ borderBottom: 1, borderColor: 'divider '}}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab   icon={<ThreeSixty />}  label="Flip & Rotation" value="1"    onClick={handleCancleCustomState}/>
                        <Tab  icon={<FormatSize />} label="Resize" value="2"  onClick={handleResize} />
                        <Tab  icon={<ZoomOutMap />} label="Padding" value="3"  onClick={handlePadding} />
                        <Tab  icon={<Crop />} label="Crop" value="4"  onClick={handlePadding} />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                    <div className="">
                        {/* flip zone */}
                        <p className='text-2xl'>Rotate Image</p>
                        <hr className='my-2'></hr>
                        <div className=' flex gap-10 py-4 '>
                            {/* ปุ่ม Flip ซ้าย */}
                            <div className="flex flex-col items-center justify-center space-y-2 w-fit">
                                <div  onClick={handleRotateLeft}  className="flex items-center justify-center w-28 h-20 rounded-lg border border-gray-300 shadow-lg  hover:bg-gray-100 cursor-pointer  hover:text-blue-700">
                                <RotateLeft fontSize="large" />
                                </div>
                                <p className="text-center text-sm font-medium">  Rotate -90° (Left)</p>
                                </div>
                                {/* ปุ่ม Flip ขวา */}
                            <div className="flex flex-col items-center justify-center space-y-2 w-fit">
                                <div  onClick={handleRotateRight}  className="flex items-center justify-center w-28 h-20 rounded-lg border border-gray-300 shadow-lg  hover:bg-gray-100 cursor-pointer  hover:text-blue-700">
                                     <RotateRight fontSize="large" />
                                </div>
                                <p className="text-center text-sm font-medium">  Rotate +90° (Right)</p>
                            </div>
                        </div>
                      
                      <div className="py-4">
                        <p className='text-2xl'>Flip Image</p>
                        <hr className='my-2'></hr>
                        <div className=' flex gap-10 py-4 '>
                            {/* ปุ่ม Flip ซ้าย */}
                            <div className="flex flex-col items-center justify-center space-y-2 w-fit">
                                <div onClick={toggleFlipHorizontal}  className="flex items-center justify-center w-28 h-20 rounded-lg border border-gray-300 shadow-lg  hover:bg-gray-100 cursor-pointer  hover:text-blue-700">
                                <SwapHoriz fontSize="large" />
                                </div>
                                <p className="text-center text-sm font-medium">  flip Horizontal</p>
                                </div>
                            {/* ปุ่ม Flip ขวา */}
                            <div className="flex flex-col items-center justify-center space-y-2 w-fit">
                                <div onClick={toggleFlipVertical}  className="flex items-center justify-center w-28 h-20 rounded-lg border border-gray-300 shadow-lg  hover:bg-gray-100 cursor-pointer  hover:text-blue-700">
                                <SwapVert fontSize="large" />
                                </div>
                                <p className="text-center text-sm font-medium"> flip Vertical</p>
                            </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#4f46e5",
                          "&:hover": { backgroundColor: "#3730a3" },
                        }}
                        style={{ marginRight: "0.5rem" }}
                        onClick={toggleGrayscale}
                      >
                        {isGrayscale ? "ลบ Grayscale" : "ปรับ Grayscale"}
                      </Button>

                  

                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#4f46e5",
                          "&:hover": { backgroundColor: "#3730a3" },
                        }}
                        href={onProcessUrl}
                        download="customImage.png"
                      >
                        ดาวน์โหลด รูปภาพ
                      </Button>
                    </div>
                    </TabPanel>
                    <TabPanel value="2">
                    <div>
                        <p className='text-2xl'>Resize Image</p>
                        <hr className='my-2'></hr>
                      {/* โหมดการปรับขนาด (Resize Mode) */}
                      <text>From:</text>
                        <p className='text-xl bg-slate-100 text-indigo-600 font-medium rounded-md w-fit px-4 text-brow my-4'>width:{imageWidthValue} x height:{imageHeightValue} (px)</p>
                        <p>To:</p>
                      <TextField
                        label="ความกว้าง (px)"
                        type="number"
                        value={resizeWidth}
                        onChange={handleResizeWidthChange}
                        style={{ marginRight: "0.5rem" }}
                      />
                      <TextField
                        label="ความสูง (px)"
                        type="number"
                        value={resizeHeight}
                        onChange={handleResizeHeightChange}
                      />
                      <div className="py-4">
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#4f46e5",
                            "&:hover": { backgroundColor: "#3730a3" },
                          }}
                          onClick={handleSaveResize}
                        >
                          Resize Image
                        </Button>
                      </div>
                    </div>
                    </TabPanel>
                    <TabPanel value="3">
                    <div>
                        <p className='text-2xl'>Padding Image</p>
                        <hr className='my-2'></hr>
                        <text>Image Size:</text>
                        <p className='text-xl bg-slate-100 text-indigo-600 font-medium rounded-md w-fit px-4 text-brow my-4'>width:{imageWidthValue} x height:{imageHeightValue} (px)</p>
                    <TextField
                        label="ความกว้าง (px)"
                        type="number"
                        style={{ marginRight: "0.5rem" }}
                        value={padding} onChange={(e) => setPadding(Number(e.target.value))} />
                    <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#4f46e5",
                            "&:hover": { backgroundColor: "#3730a3" },
                          }}
                          onClick={handleSavePadding}
                        >
                          บันทึกการปรับขนาด
                        </Button>
                    </div>
                    </TabPanel>
                    <TabPanel value="4">
                          
                    </TabPanel>
                    </TabContext>
                      </div>
                </div>
              )}
        
            </div>
          </div>
        )}
      </div>
    );
};

export default ImageUploader;
