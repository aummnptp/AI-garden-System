import { Alert, AlertTitle, Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Tab, TextField } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import {
  Contrast,
  Crop,
  Download,
  FormatSize,
  Margin,
  RestartAlt,
  RotateLeft,
  RotateRight,
  SwapHoriz,
  SwapVert,
  ThreeSixty,
  ZoomOutMap,
} from "@mui/icons-material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ImgCropper from "./ImgCropper";
interface PredictResult {
  ai_type: string;
  prediction: Prediction;
  regression_params?: any | null;
}
interface Prediction {
  class_name: string;
  confidence: number;
}
interface ImageUploaderProps {
  image: File;
  onProcessUrlChange: (url: string) => void; 
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ image,onProcessUrlChange}) => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);  // รูปแรกสุด สำหรับreset
  const [originalWidth, setOriginalWidth] = useState<number>(300); // width for resizing
  const [originalHeight, setOriginalHeight] = useState<number>(300); // height for resizing
  const [selectedImage, setSelectedImage] = useState<string | null>(null);  // รูปที่กำลังโชว์ ประมวลผล(ยังไม่เซฟ)
  const [onProcessUrl, setOnProcessUrl] = useState<string | null>(null);  //  รูปที่เซฟ เตรียมดาวน์โหลด
  
  const [imageBfResize, setImageBfResize] = useState<string | null>(null); // State for storing original image before resize
  const [imageBfPadding, setImageBfPadding] = useState<string | null>(null); // State for storing original image before resize
  const [imageBfGrayscale, setImageBfGrayscale] = useState<string | null>(null); // State for storing original image before resize
  
  const [isGrayscale, setIsGrayscale] = useState<boolean>(false); // state for grayscale
  const [isResizing, setIsResizing] = useState<boolean>(false); // state for resizing
  const [isPadding, setIsPadding] = useState<boolean>(false); // state for padding
  const [isCropping, setIsCropping] = useState<boolean>(false);// state for crop
  const [isSymmetricResize, setIsSymmetricResize] = useState<boolean>(false); // สำหรับการเช็ค Resize

  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false); // state for flip left-right
  const [flipVertical, setFlipVertical] = useState<boolean>(false); // state for flip top-bottom
  const [rotation, setRotation] = useState<number>(0); // state for rotation

  const [resizeWidth, setResizeWidth] = useState<number>(300); // width for resizing
  const [resizeHeight, setResizeHeight] = useState<number>(300); // height for resizing
  const [imageWidthValue, setImageWidthValue] = useState<number>(300); // width for resizing
  const [imageHeightValue, setImageHeightValue] = useState<number>(300); // height for resizing
  
  // padding
  
  const [paddingSymmetric, setPaddingSymmetric] = useState<number>(0); // width for resizing
  const [imagePaddedWidth, setImagePaddedWidth] = useState<number>(300); // width for resizing
  const [imagePaddedHeight, setImagePaddedHeight] = useState<number>(300); // height for resizing
  const [paddingTop, setPaddingTop] = useState<number>(0); // width for resizing
  const [paddingBottom, setPaddingBottom] = useState<number>(0); // width for resizing
  const [paddingLeft, setPaddingLeft] = useState<number>(0); // width for resizing
  const [paddingRight, setPaddingRight] = useState<number>(0); // width for resizing
  const [paddingMode, setPaddingMode] = useState("custom");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [value, setValue] = useState("1");
  const [open, setOpen] = useState(false);
  const [alertTitle ,setAlertTitle]= useState("");


 
  // const processImage = () => {
  //   // สมมติว่าคุณทำการประมวลผลและได้ URL ของภาพหลังประมวลผล
  //   if (onProcessUrl){
  //     // ส่ง URL กลับไปยังคอมโพเนนต์แม่ผ่านฟังก์ชัน onProcessUrlChange
  //     onProcessUrlChange(onProcessUrl);
  //   }
  // };

  const handleNumberChange = (value: string, setter: React.Dispatch<React.SetStateAction<number>>) => {
    const newValue = parseInt(value, 10);
    // ตรวจสอบค่าใหม่และตั้งค่าเป็น 0 ถ้าผู้ใช้ลบตัวเลขหรือค่าน้อยกว่า 0
    if (isNaN(newValue) || newValue < 0) {
      setter(0); 
    } else {
      setter(newValue);
    }
  };
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleResizeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value, 10);
    handleNumberChange(e.target.value, setResizeWidth);

    if (isSymmetricResize) {
      setResizeHeight(newWidth >= 0 ? newWidth : 0); // ถ้าติ๊ก Checkbox, ให้ height เท่ากับ width
    }
  };

  // ฟังก์ชันเมื่อมีการเปลี่ยนแปลงค่า Resize Height
  const handleResizeHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value, 10);
    handleNumberChange(e.target.value, setResizeHeight);
    if (isSymmetricResize) {
      setResizeWidth(newHeight >= 0 ? newHeight : 0); // ถ้าติ๊ก Checkbox, ให้ width เท่ากับ height
    }
  };

  // ฟังก์ชันเมื่อมีการเปลี่ยนแปลงค่า Padding Width
  const handlePaddingSymmetricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  handleNumberChange(e.target.value, setPaddingSymmetric);
 
  };

  const handlePaddingTopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleNumberChange(e.target.value, setPaddingTop);

  };

  // ฟังก์ชันเมื่อมีการเปลี่ยนแปลงค่า Padding Height
  const handlePaddingBottomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleNumberChange(e.target.value, setPaddingBottom);

 
  };
  const handlePaddingLeftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleNumberChange(e.target.value, setPaddingLeft);
  };
  // ฟังก์ชันเมื่อมีการเปลี่ยนแปลงค่า Padding Height
  const handlePaddingRightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleNumberChange(e.target.value, setPaddingRight);
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

  const handleRotationCustomState = () => {
    handleCancelState()
  
  };
  const handleGrayscale = () => {
    setImageBfGrayscale(selectedImage);
    handleCancelState();
  };
  const handleResize = () => {
    setImageBfResize(selectedImage);
    handleCancelState();
    setIsResizing(true); // เข้าสู่โหมด Resize
  };
  const handlePadding = () => {
    setImageBfPadding(selectedImage);
    handleCancelState();

    setIsPadding(true); // เข้าสู่โหมด Resize
  };
  const handleCropping = () => {
    setIsGrayscale(false)
    handleCancelState();
    setValue("1")
    setIsCropping(true); // เข้าสู่โหมด Resize
    
  };



  const handleSaveResize = async () => {
    if (selectedImage && canvasRef.current) {
      try {
       
        const resizedImageUrl = canvasRef.current.toDataURL("image/png");
        await setSelectedImage(resizedImageUrl);
        await setOnProcessUrl(resizedImageUrl); 
  
     
        await setIsResizing(false);
        await onResetInput();
        setImageWidthValue(resizeWidth);
        setImageHeightValue(resizeHeight);
  
       
        setAlertTitle("Apply Resize");
        handleClickOpen();
      } catch (error) {
        console.error("Error in resizing process:", error);
      }
    }
  };
  const handleSavePadding = async () => {
    if (selectedImage && canvasRef.current) {
      try {
     
        const paddedImageURL = canvasRef.current.toDataURL("image/png");
        await setSelectedImage(paddedImageURL); // อัปเดตรูปที่ถูก padding ลงใน selectedImage
        await setOnProcessUrl(paddedImageURL); // อัปเดต URL สำหรับดาวน์โหลด
  
     
        await setIsPadding(false);
        await onResetInput();
  
       
        setAlertTitle("Apply Padding");
        handleClickOpen();
      } catch (error) {
        console.error("Error in padding process:", error);
      }
    }
  };

  const handleSaveGrayscale = async () => {
  if (selectedImage && canvasRef.current) {
    try {
      // ขั้นตอนที่ 1: บันทึกภาพที่ถูก grayscale
      const grayscaledImageURL = canvasRef.current.toDataURL("image/png");
      await setSelectedImage(grayscaledImageURL); // อัปเดตรูปที่ถูก grayscale ลงใน selectedImage
      await setOnProcessUrl(grayscaledImageURL); // อัปเดต URL สำหรับดาวน์โหลด

      // ขั้นตอนที่ 2: ออกจากโหมด Grayscale และอัปเดต state อื่นๆ
      await setIsPadding(false); // คุณอาจต้องเปลี่ยนเป็น setIsGrayscale(false)
      await onResetInput();

      // ขั้นตอนที่ 3: ตั้งค่า alert และแสดงการแจ้งเตือน
      setAlertTitle("Apply Grayscale");
      handleClickOpen();
    } catch (error) {
      console.error("Error in grayscale process:", error);
    }
  }
};
  const onResetInput = ()=>{
      setIsGrayscale(false)
      setFlipHorizontal(false);
      setFlipVertical(false);
      setIsSymmetricResize(false);
      setRotation(0);
      setPaddingSymmetric(0);
      setPaddingTop(0);
      setPaddingBottom(0);
      setPaddingLeft(0);
      setPaddingRight(0);
      setPaddingMode("custom");
      
  }
  const onResetImage = () => {
    if (originalImage) {
      setSelectedImage(originalImage); // Reset to the original image
      setOnProcessUrl(originalImage); // Reset the processed image URL

      onResetInput();

      setIsResizing(false); // Exit resizing mode
      setIsPadding(false); // Exit padding mode
      setResizeWidth(originalWidth); // Reset resize width
      setResizeHeight(originalHeight); // Reset resize height
      setValue("1")
    }
  };

  const handleCancelState = () => {
    if (isResizing == true) {
      handleCancelResize()
    }
    if (isPadding == true) {
      handleCancelPadding()
    }
    if (isGrayscale == true) {
      handleCancelGrayscale()
     
    }
  }
  const handleCancelResize = () => {
    if (isResizing == true) {
      // setOnProcessUrl(imageBfResize);
      setSelectedImage(imageBfResize);
      setIsResizing(false); // ออกจากโหมด Resize
    }
  };
  const handleCancelPadding = () => {
    if (isPadding == true) {
      // setOnProcessUrl(imageBfPadding);
      setSelectedImage(imageBfPadding);
      setIsPadding(false); // ออกจากโหมด Resize
    }
  };
  const handleCancelGrayscale = () => {
    if (isGrayscale == true) {
      setIsGrayscale(false); // ออกจากโหมด Resize
      setSelectedImage(imageBfGrayscale);
      // setOnProcessUrl(imageBfGrayscale);
    }
  };

  const onCropDone = async (croppedImageUrl: string) => {
    try {
      // ขั้นตอนที่ 1: ตั้งค่า selectedImage เป็น croppedImageUrl
      await setSelectedImage(croppedImageUrl);
  
      // ขั้นตอนที่ 2: ปิดการ crop (setIsCropping)
      await setIsCropping(false);
  
      // หาก onProcessUrl เป็น null ให้แสดง error
      if (!croppedImageUrl) {
        console.error("onProcessUrl is null, cannot crop the image.");
        return; // หยุดการทำงานหากไม่มี URL
      }
  
      // ขั้นตอนที่ 3: ตั้งค่า Alert Title และเปิด alert
      setAlertTitle("Cropped");
      handleClickOpen();
  
    } catch (error) {
      console.error("Error in cropping process:", error);
    }
  };

  const onCropCancle = () => {
    setIsCropping(false);
    setSelectedImage(onProcessUrl)
  };
  const downloadImage = () => {
    if (onProcessUrl) {
      const link = document.createElement("a");
      link.href = onProcessUrl; // Set the link's href to the processed image URL
      link.download = "processed-image.png"; // Set the download filename
      document.body.appendChild(link);
      link.click(); // Simulate the click
      document.body.removeChild(link); // Clean up the link element
    } else {
      console.error("No processed image to download.");
    }
  };
  useEffect(() => {
    if (onProcessUrl && onProcessUrlChange) {
      // เรียก callback เมื่อ onProcessUrl เปลี่ยนแปลง
      onProcessUrlChange(onProcessUrl);
    }
  }, [onProcessUrl, onProcessUrlChange]); // ทำงานเมื่อ onProcessUrl เปลี่ยนแปลง

    // โหลดรูปภาพเข้า Component
    useEffect(() => {
      if (image) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image(); // สร้างออบเจ็กต์ Image
          img.src = reader.result as string; // ตั้ง src ให้กับ base64 string จาก FileReader
          img.onload = () => {
            setResizeWidth(img.width); // ตั้งค่า width เป็นขนาดของรูปภาพ
            setResizeHeight(img.height); // ตั้งค่า height เป็นขนาดของรูปภาพ
            setImageWidthValue(img.width);
            setImageHeightValue(img.height);
            setOriginalWidth(img.width);
            setOriginalHeight(img.height);
            setOriginalImage(reader.result as string); 
            setSelectedImage(reader.result as string); 
           
          };
        };
        reader.readAsDataURL(image); // อ่านไฟล์ภาพจาก props
      }
    }, [image]); // useEffect จะทำงานเมื่อ image เปลี่ยนแปลง
  
    //  ประมวล rotation
    useEffect(() => {
      if (selectedImage && canvasRef.current && !isResizing && !isPadding && !isCropping) {
        
        const image = new Image();
        image.src = selectedImage;
        image.onload = () => {
          const canvas = canvasRef.current!;
          const ctx = canvas.getContext("2d");
  
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
          ctx?.rotate(angleInRadians);
          if (flipHorizontal) {
            ctx?.scale(-1, 1); // Flip แนวนอน
          }
          if (flipVertical) {
            ctx?.scale(1, -1); // Flip แนวตั้ง
          }
          // หมุนภาพตามค่าที่ได้
  
          // วาดภาพที่ Flip และหมุนแล้ว
          ctx?.drawImage(image, -image.width / 2, -image.height / 2);
          ctx?.restore();
 
          setImageWidthValue(canvas.width);
          setImageHeightValue(canvas.height);
          // เก็บ URL ของภาพที่ประมวลผลแล้ว
          const onProcessUrl = canvas.toDataURL("image/png");
          setOnProcessUrl(onProcessUrl);
        };
      }
    }, [
      selectedImage,
      rotation,
      isGrayscale,
      flipHorizontal,
      flipVertical,
      isResizing,
      isPadding,
      isCropping,
    ]);
    // grayscale
    useEffect(() => {
      if (isGrayscale && onProcessUrl && canvasRef.current) {
        const image = new Image();
        image.src = onProcessUrl;
        image.onload = () => {
          const canvas = canvasRef.current!;
          const ctx = canvas.getContext("2d");
    
          ctx?.clearRect(0, 0, canvas.width, canvas.height); // ล้าง canvas เดิม
          ctx?.drawImage(image, 0, 0, canvas.width, canvas.height); // วาดภาพ
    
          // ตรวจสอบว่าต้องทำ Grayscale หรือไม่
          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
          if (imageData && ctx) {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
              data[i] = avg; // Red
              data[i + 1] = avg; // Green
              data[i + 2] = avg; // Blue
            }
            ctx.putImageData(imageData, 0, 0);
          }
        };
      }
    }, [isGrayscale, ]);

    // resize
    useEffect(() => {
      if (isResizing && onProcessUrl && canvasRef.current) {
        const image = new Image();
        image.src = onProcessUrl;
        image.onload = () => {
          const canvas = canvasRef.current!;
          const ctx = canvas.getContext("2d");
          
          canvas.width = resizeWidth;
          canvas.height = resizeHeight;
  
          ctx?.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
          ctx?.drawImage(image, 0, 0, resizeWidth, resizeHeight); // draw resized image
        };
      }
    }, [resizeWidth, resizeHeight, isResizing]);
  
    // padding
    useEffect(() => {
      if (isPadding && onProcessUrl && canvasRef.current) {
        const image = new Image();
        image.src = onProcessUrl;
        image.onload = () => {
          const canvas = canvasRef.current!;
          const ctx = canvas.getContext("2d");
          if(paddingMode == 'custom'){
            if (ctx) {
              // คำนวณความกว้างและความสูงที่รวม padding ด้านซ้าย ขวา บน ล่าง
              const paddedWidth = image.width + paddingLeft + paddingRight;
              const paddedHeight = image.height + paddingTop + paddingBottom;
              canvas.width = paddedWidth;
              canvas.height = paddedHeight;
              setImagePaddedWidth(canvas.width);
              setImagePaddedHeight(canvas.height);
              // ตั้งค่าสีเป็นสีดำ
              ctx.fillStyle = 'black';
              // เติมสีดำในพื้นที่ทั้งหมดของ canvas
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              // วาดรูปภาพโดยเริ่มจากตำแหน่งที่กำหนดด้วย padding บนและซ้าย
              ctx.drawImage(image, paddingLeft, paddingTop);
            }
          }
          if(paddingMode == 'symmetric'){
            if (ctx) {
            const paddedWidth = image.width + paddingSymmetric * 2;
            const paddedHeight = image.height + paddingSymmetric * 2;
            canvas.width = paddedWidth;
            canvas.height = paddedHeight;
            setImagePaddedWidth(canvas.width);
            setImagePaddedHeight(canvas.height);
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            ctx.drawImage(image, paddingSymmetric, paddingSymmetric);
            }
          }

          if (paddingMode === 'square') {
            if (ctx) {
              const maxDimension = Math.max(image.width, image.height); //หาว่าwidth || height กว้างกว่า
              const paddingHorizontal = (maxDimension - image.width) / 2; // Padding ด้านซ้ายและขวา
              const paddingVertical = (maxDimension - image.height) / 2; // Padding ด้านบนและล่าง
              // console.log(maxDimension,paddingHorizontal,paddingVertical)
          
              // ตั้งค่า canvas ให้มีความกว้างและความสูงเป็น maxDimension
              canvas.width = maxDimension;
              canvas.height = maxDimension;
              setImagePaddedWidth(canvas.width);
              setImagePaddedHeight(canvas.height);
              // ตั้งค่าสีเป็นสีดำ
              ctx.fillStyle = 'black';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
          
              // วาดรูปภาพที่กลาง canvas โดยเพิ่ม padding ด้านซ้าย/ขวา หรือบน/ล่าง
              ctx.drawImage(image, paddingHorizontal, paddingVertical);
            }
          }
          };
      }
    }, [paddingLeft, paddingRight, paddingTop, paddingBottom, paddingSymmetric,isPadding,paddingMode]);
    
    const startTimer = () => {
      setTimeout(() => {
        setOpen(false); // ปิด Alert หลังจากเวลาที่กำหนด (เช่น 5 วินาที)
      }, 5000); // ตั้งค่าเป็น 5000 มิลลิวินาที = 5 วินาที
    };
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
  
    // เริ่มทำงาน timer เมื่อ Alert ถูกแสดง
    if (open) {
      startTimer();
    }



  return (
    <div>
    <div className="flex w-full ">
      {open && (
        <div className="fixed top-24 left-0 w-full flex justify-center z-50 animate-fade-in-out  ">
          <Alert severity="info" onClose={handleClose}>
            <AlertTitle>{alertTitle}</AlertTitle>
            {/* {alertContent} */}
          </Alert>
        </div>
      )}
      {selectedImage && (
        <div className="  mx-auto w-full ">
          {/* Display Processed Image */}
          {isCropping ? (
            <div className=" px-10 mx-auto w-full h-fit pb-10 flex ">
              {onProcessUrl && (
                <ImgCropper
                  src={onProcessUrl}
                  onCropDone={onCropDone}
                  onCancel={onCropCancle}
                />
              )}
            </div>
          ) : (
            <div className=" px-10 mx-auto w-full h-fit pb-10 flex  ">
              <div className=" w-[70%] border flex flex-col pb-6 rounded-[5px] ">
                <div className=" h-fit  flex items-center justify-center  pt-10">
                  
                  <canvas
                    className="    border-2 border-dashed border-gray-400  justify-center  "
                    ref={canvasRef}
                    style={{
                      maxWidth: "450px",
                      maxHeight: "450px",
                      minWidth: "150px",
                      minHeight: "150px",
                    }}
                  ></canvas>
                   {/* <Skeleton 
                      variant="rectangular" 
                      width={450} 
                      height={450} 
                      animation="wave" 
                      style={{ borderRadius: "4px" }} 
                    /> */}
                </div>
                <div className="flex justify-center text-center ">
                  <span className="text-xl bg-slate-100 text-indigo-600 font-medium rounded-md w-fit px-4  my-4">
                    width:{imageWidthValue} (px)
                  </span>
                  <span className="mx-2  w-fit my-4">x</span>
                  <span className="text-xl bg-slate-100 text-indigo-600 font-medium rounded-md w-fit px-4  my-4">
                    height:
                    {imageHeightValue} (px)
                  </span>
                </div>
                <div className="flex gap-6  mx-auto">
                  <div
                    onClick={onResetImage}
                    className="flex items-center justify-center w-fit px-2 h-10  rounded-lg border border-gray-300   hover:bg-gray-100 cursor-pointer  hover:text-blue-700"
                  >
                    <RestartAlt />
                    <p className="text-center text-sm font-medium">
                      Reset รูปภาพ
                    </p>
                  </div>
                  <div
                    onClick={handleCropping}
                    className="flex items-center justify-center w-fit px-2 h-10  rounded-lg border border-gray-300   hover:bg-gray-100 cursor-pointer  hover:text-blue-700"
                  >
                    <Crop />
                    <p className="text-center text-sm font-medium">
                      Crop รูปภาพ
                    </p>
                  </div>
                  <div
                    onClick={downloadImage}
                    className="flex items-center justify-center w-fit h-10 px-2 rounded-lg border border-gray-300   hover:bg-gray-100 cursor-pointer  hover:text-blue-700"
                  >
                    <Download />
                    <p className="text-center text-sm font-medium">
                      Download รูปภาพ
                    </p>
                  </div>
                </div>
              </div>

              {onProcessUrl && (
                <div className="w-[40%] border rounded-[5px] ">
                  <div className=" w-full px-2 mx-auto ">
                    <TabContext value={value}>
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList
                          onChange={handleChange}
                          aria-label="Edit Tab"
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Tab
                            icon={<ThreeSixty />}
                            label="Rotation"
                            value="1"
                            sx={{ flexGrow: 1 }}
                            onClick={handleRotationCustomState}
                          />
                          <Tab
                            icon={<Contrast />}
                            label="Grayscale"
                            value="2"
                            sx={{ flexGrow: 1 }}
                            onClick={handleGrayscale}
                          />
                          <Tab
                            icon={<FormatSize />}
                            label="Resize"
                            value="3"
                            sx={{ flexGrow: 1 }}
                            onClick={handleResize}
                          />
                          <Tab
                            icon={<ZoomOutMap />}
                            label="Padding"
                            value="4"
                            sx={{ flexGrow: 1 }}
                            onClick={handlePadding}
                          />
                        </TabList>
                      </Box>
                      <TabPanel value="1">
                        <div className="w-full">
                          {/* flip zone */}
                          <div className=" flex flex-wrap gap-4 justify-between py-4 w-full ">
                            {/* ปุ่ม Flip ซ้าย */}
                            <div className="flex flex-col items-center justify-center space-y-2 w-[20%]">
                              <div
                                onClick={handleRotateLeft}
                                className=" flex items-center justify-center w-full h-20 rounded-lg border border-gray-300 shadow-lg hover:bg-gray-100 cursor-pointer hover:text-blue-700"
                              >
                                <RotateLeft fontSize="large" />
                              </div>
                              <p className="text-center text-sm font-medium ">
                                RotateLeft {<br></br>}(-90°)
                              </p>
                            </div>
                            {/* ปุ่ม Flip ขวา */}
                            <div className="flex flex-col items-center justify-center space-y-2 w-[20%] ">
                              <div
                                onClick={handleRotateRight}
                                className="flex items-center justify-center w-full h-20 rounded-lg border border-gray-300 shadow-lg hover:bg-gray-100 cursor-pointer hover:text-blue-700"
                              >
                                <RotateRight fontSize="large" />
                              </div>
                              <p className="text-center text-sm font-medium">
                                RotateRight{<br></br>}(+90°)
                              </p>
                            </div>
                            {/* ปุ่ม Flip ซ้าย */}
                            <div className="flex flex-col items-center justify-center space-y-2 w-[20%] ">
                              <div
                                onClick={toggleFlipHorizontal}
                                className="flex items-center justify-center w-full h-20 rounded-lg border border-gray-300 shadow-lg hover:bg-gray-100 cursor-pointer hover:text-blue-700"
                              >
                                <SwapHoriz fontSize="large" />
                              </div>
                              <p className="text-center text-sm font-medium">
                                Flip{<br></br>} Horizontal
                              </p>
                            </div>
                            {/* ปุ่ม Flip ขวา */}
                            <div className="flex flex-col items-center justify-center space-y-2 w-[20%] ">
                              <div
                                onClick={toggleFlipVertical}
                                className="flex items-center justify-center w-full h-20 rounded-lg border border-gray-300 shadow-lg hover:bg-gray-100 cursor-pointer hover:text-blue-700"
                              >
                                <SwapVert fontSize="large" />
                              </div>
                              <p className="text-center text-sm font-medium">
                                Flip{<br></br>}Vertical
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                      <TabPanel value="2">
                        <div className="w-full">
                          <button
                            className={`flex items-center justify-center my-4 px-2 w-fit max-w-[40%] h-12 rounded-lg border ${
                              isGrayscale === true
                                ? "border-blue-700 text-blue-700"
                                : "border-gray-300"
                            } hover:bg-gray-100 cursor-pointer hover:text-blue-700`}
                            onClick={toggleGrayscale}
                          >
                            <Contrast />{" "}
                            {isGrayscale ? "ลบ Grayscale" : "ปรับ Grayscale"}
                          </button>
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#4f46e5",
                              "&:hover": { backgroundColor: "#3730a3" },
                            }}
                            style={{ marginRight: "0.5rem" }}
                            onClick={handleSaveGrayscale}
                          >
                            Apply Grayscale
                          </Button>
                        </div>
                      </TabPanel>
                      <TabPanel value="3">
                        <div className="w-full">
                          {/* โหมดการปรับขนาด (Resize Mode) */}

                          <p className="my-4">ขนาดหลังResize:</p>
                          <span className="text-xl bg-orange-100 text-amber-700 font-medium rounded-md w-fit px-4 text-brow my-4">
                            width:{resizeWidth} (px)
                          </span>
                          <span className="mx-2">x</span>
                          <span className="text-xl bg-orange-100 text-amber-700 font-medium rounded-md w-fit px-4 text-brow my-4">
                            height:
                            {resizeHeight} (px)
                          </span>
                          <div className="flex gap-2 py-4">
                            <label className="w-[45%]">
                              ความกว้าง (px)
                              <input
                                type="number"
                                value={resizeWidth}
                                onChange={handleResizeWidthChange}
                                className="w-full p-2 border border-gray-300 rounded-lg  no-spinner focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                              />
                            </label>

                            <label className="w-[45%]">
                              ความสูง (px)
                              <input
                                type="number"
                                value={resizeHeight}
                                onChange={handleResizeHeightChange}
                                className="w-full p-2 border border-gray-300 rounded-lg no-spinner  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                              />
                            </label>
                          </div>
                          <div className="">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={isSymmetricResize}
                                  onChange={(e) =>
                                    setIsSymmetricResize(e.target.checked)
                                  }
                                  color="primary"
                                />
                              }
                              label="Symmetric Resize"
                            />
                            <Button
                              variant="contained"
                              sx={{
                                backgroundColor: "#4f46e5",
                                "&:hover": { backgroundColor: "#3730a3" },
                              }}
                              onClick={handleSaveResize}
                            >
                              Apply Resize
                            </Button>
                          </div>
                        </div>
                      </TabPanel>
                      <TabPanel value="4">
                        <div className="w-full">
                          <div className="pb-4">

                          <p className="my-4">ขนาดหลังPadding:</p>
                          <span className="text-xl bg-orange-100 text-amber-700 font-medium rounded-md w-fit px-4 text-brow my-4">
                            width:{imagePaddedWidth} (px)
                          </span>{" "}
                          <span className="mx-2">x</span>
                          <span className="text-xl bg-orange-100 text-amber-700 font-medium rounded-md w-fit px-4 text-brow my-4 ">
                            height:
                            {imagePaddedHeight} (px)
                          </span>
                          </div>
                          
                          <FormControl>
                            <FormLabel id="row-radio-buttons-group-label">
                              Padding Mode
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-labelledby="row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                               defaultValue="custom"
                               value={paddingMode} // กำหนดค่าให้ RadioGroup ตาม paddingMode ที่เลือก
                               onChange={(e) => setPaddingMode(e.target.value)} // อัปเดต paddingMode เมื่อเลือก
                            >
                              <FormControlLabel
                                value="custom"
                                control={<Radio />}
                                label="Custom"
                              />
                              <FormControlLabel
                                value="square"
                                control={<Radio />}
                                label="Square"
                              />
                              <FormControlLabel
                                value="symmetric"
                                control={<Radio />}
                                label="Symmetric"
                              />
                            </RadioGroup>
                          </FormControl>
                          {paddingMode === 'symmetric' && (
                          <div className="flex gap-2 py-4">
                            <label className="w-[45%]">
                              ขนาด (px)
                              <input
                                type="number"
                                value={paddingSymmetric}
                                onChange={handlePaddingSymmetricChange}
                                className="w-full p-2 border border-gray-300 rounded-lg no-spinner  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                              />
                            </label>
                            </div>
                          )}
                           {paddingMode === 'square' && (
                              <div className="w-[45%] p-2"></div>
                              )}
                            {paddingMode === 'custom' && (
                              <>
                            <div className="flex gap-2 py-4">
                            <label className="w-[45%]">
                              บน (px)
                              <input
                                type="number"
                                value={paddingTop}
                                onChange={handlePaddingTopChange}
                                className="w-full p-2 border border-gray-300 rounded-lg no-spinner  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                              />
                            </label>
                            <label className="w-[45%]">
                              ล่าง (px)
                              <input
                               min="1" 
                                type="number"
                                value={paddingBottom}
                                onChange={handlePaddingBottomChange}
                                className="w-full p-2 border border-gray-300 rounded-lg no-spinner  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                              />
                            </label>
                            </div>
                             <div className="flex gap-2 py-4">
                            <label className="w-[45%]">
                              ซ้าย (px)
                              <input
                                type="number"
                                value={paddingLeft}
                                onChange={handlePaddingLeftChange}
                                className="w-full p-2 border border-gray-300 rounded-lg no-spinner  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                              />
                            </label>
                            <label className="w-[45%]">
                              ขวา (px)
                              <input
                                type="number"
                                value={paddingRight}
                                onChange={handlePaddingRightChange}
                                className="w-full p-2 border border-gray-300 rounded-lg no-spinner  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                              />
                            </label>
                            </div>
                            </>
                            )}
                            
                         

                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#4f46e5",
                              "&:hover": { backgroundColor: "#3730a3" },
                            }}
                            onClick={handleSavePadding}
                          >
                            Apply Padding
                          </Button>
                        </div>
                      </TabPanel>
                    </TabContext>
                  </div>
                </div>
              )}
              
            </div>
          )}
        </div>
      )}
    </div>
      
    </div>
  );
};

export default ImageUploader;
