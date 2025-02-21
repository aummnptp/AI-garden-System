import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Tab,
} from "@mui/material";
import { Contrast, Crop, Download, FormatSize, RestartAlt, ThreeSixty, ZoomOutMap } from "@mui/icons-material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ImgCropper from "./ImgCropper";
import RotationTab from "./customizerImage/RotationTab";
import GrayscaleTab from "./customizerImage/GrayscaleTab";
import ResizeTab from "./customizerImage/ResizeTab";
import PaddingTab from "./customizerImage/PaddingTab";
import { processPaddingEffect } from "../function/imageProcessingUtils";



interface ImageUploaderProps {
  image: File;
  onProcessUrlChange: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ image, onProcessUrlChange }) => {
  // ********* State ต่าง ๆ *********
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(300);
  const [originalHeight, setOriginalHeight] = useState<number>(300);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [onProcessUrl, setOnProcessUrl] = useState<string | null>(null);

  const [imageBfResize, setImageBfResize] = useState<string | null>(null);
  const [imageBfPadding, setImageBfPadding] = useState<string | null>(null);
  const [imageBfGrayscale, setImageBfGrayscale] = useState<string | null>(null);

  const [isGrayscale, setIsGrayscale] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isPadding, setIsPadding] = useState<boolean>(false);
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [isSymmetricResize, setIsSymmetricResize] = useState<boolean>(false);

  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false);
  const [flipVertical, setFlipVertical] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);

  const [resizeWidth, setResizeWidth] = useState<number>(300);
  const [resizeHeight, setResizeHeight] = useState<number>(300);
  const [imageWidthValue, setImageWidthValue] = useState<number>(300);
  const [imageHeightValue, setImageHeightValue] = useState<number>(300);

  const [paddingSymmetric, setPaddingSymmetric] = useState<number>(0);
  const [imagePaddedWidth, setImagePaddedWidth] = useState<number>(300);
  const [imagePaddedHeight, setImagePaddedHeight] = useState<number>(300);
  const [paddingTop, setPaddingTop] = useState<number>(0);
  const [paddingBottom, setPaddingBottom] = useState<number>(0);
  const [paddingLeft, setPaddingLeft] = useState<number>(0);
  const [paddingRight, setPaddingRight] = useState<number>(0);
  const [paddingMode, setPaddingMode] = useState("custom");

  const [value, setValue] = useState("1");
  const [open, setOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ********* ฟังก์ชันสำหรับจัดการ state ต่าง ๆ *********
  const handleNumberChange = (value: string, setter: React.Dispatch<React.SetStateAction<number>>) => {
    const newValue = parseInt(value, 10);
    setter(isNaN(newValue) || newValue < 0 ? 0 : newValue);
  };

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleResizeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleNumberChange(e.target.value, setResizeWidth);
    if (isSymmetricResize) setResizeHeight(parseInt(e.target.value, 10));
  };

  const handleResizeHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleNumberChange(e.target.value, setResizeHeight);
    if (isSymmetricResize) setResizeWidth(parseInt(e.target.value, 10));
  };

  const handlePaddingSymmetricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleNumberChange(e.target.value, setPaddingSymmetric);
  };

  const handlePaddingTopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleNumberChange(e.target.value, setPaddingTop);
  };

  const handlePaddingBottomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleNumberChange(e.target.value, setPaddingBottom);
  };

  const handlePaddingLeftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleNumberChange(e.target.value, setPaddingLeft);
  };

  const handlePaddingRightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleNumberChange(e.target.value, setPaddingRight);
  };

  const handleRotateLeft = () => setRotation((prev) => prev - 90);
  const handleRotateRight = () => setRotation((prev) => prev + 90);
  const toggleFlipHorizontal = () => setFlipHorizontal((prev) => !prev);
  const toggleFlipVertical = () => setFlipVertical((prev) => !prev);
  const toggleGrayscale = () => setIsGrayscale((prev) => !prev);

  const handleRotationCustomState = () => {
    handleCancelState();
  };

  const handleGrayscale = () => {
    setImageBfGrayscale(selectedImage);
    handleCancelState();
  };

  const handleResize = () => {
    setImageBfResize(selectedImage);
    handleCancelState();
    setIsResizing(true);
  };

  const handlePadding = () => {
    setImageBfPadding(selectedImage);
    handleCancelState();
    setIsPadding(true);
  };

  const handleCropping = () => {
    setIsGrayscale(false);
    handleCancelState();
    setValue("1");
    setIsCropping(true);
  };

  const handleSaveResize = async () => {
    if (selectedImage && canvasRef.current) {
      const resizedImageUrl = canvasRef.current.toDataURL("image/png");
      setSelectedImage(resizedImageUrl);
      setOnProcessUrl(resizedImageUrl);
      setIsResizing(false);
      onResetInput();
      setImageWidthValue(resizeWidth);
      setImageHeightValue(resizeHeight);
      setAlertTitle("Apply Resize");
      handleClickOpen();
    }
  };

  const handleSavePadding = async () => {
    if (selectedImage && canvasRef.current) {
      const paddedImageURL = canvasRef.current.toDataURL("image/png");
      setSelectedImage(paddedImageURL);
      setOnProcessUrl(paddedImageURL);
      setIsPadding(false);
      onResetInput();
      setAlertTitle("Apply Padding");
      handleClickOpen();
    }
  };

  const handleSaveGrayscale = async () => {
    if (selectedImage && canvasRef.current) {
      const grayscaledImageURL = canvasRef.current.toDataURL("image/png");
      setSelectedImage(grayscaledImageURL);
      setOnProcessUrl(grayscaledImageURL);
      setIsGrayscale(false);
      onResetInput();
      setAlertTitle("Apply Grayscale");
      handleClickOpen();
    }
  };

  const onResetInput = () => {
    setIsGrayscale(false);
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
    setValue("1");
  };

  const onResetImage = () => {
    if (originalImage) {
      setSelectedImage(originalImage);
      setOnProcessUrl(originalImage);
      onResetInput();
      setIsResizing(false);
      setIsPadding(false);
      setResizeWidth(originalWidth);
      setResizeHeight(originalHeight);
      setValue("1");
    }
  };

  const handleCancelState = () => {
    if (isResizing) {
      setSelectedImage(imageBfResize);
      setIsResizing(false);
    }
    if (isPadding) {
      setSelectedImage(imageBfPadding);
      setIsPadding(false);
    }
    if (isGrayscale) {
      setIsGrayscale(false);
      setSelectedImage(imageBfGrayscale);
    }
  };

  const downloadImage = () => {
    if (onProcessUrl) {
      const link = document.createElement("a");
      link.href = onProcessUrl;
      link.download = "processed-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // ********* useEffect สำหรับการโหลดและประมวลผลภาพ *********
  useEffect(() => {
    if (onProcessUrl && onProcessUrlChange) {
      onProcessUrlChange(onProcessUrl);
    }
  }, [onProcessUrl, onProcessUrlChange]);

  const processImage = () => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          setResizeWidth(img.width);
          setResizeHeight(img.height);
          setImageWidthValue(img.width);
          setImageHeightValue(img.height);
          setOriginalWidth(img.width);
          setOriginalHeight(img.height);
          setOriginalImage(reader.result as string);
          setSelectedImage(reader.result as string);
        };
      };
      reader.readAsDataURL(image);
    }
  };

  useEffect(() => {
    processImage();
  }, [image]);

  // ********* useEffect สำหรับการประมวลผล canvas (rotation, grayscale, resize, padding) *********
  useEffect(() => {
    if (selectedImage && canvasRef.current && !isResizing && !isPadding && !isCropping) {
      const img = new Image();
      img.src = selectedImage;
      img.onload = () => {
        if (!canvasRef.current) return; // Exit early if the canvas isn't available
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return; // Optional: exit if context isn't available
      
        const angleInRadians = (rotation * Math.PI) / 180;
        const absCos = Math.abs(Math.cos(angleInRadians));
        const absSin = Math.abs(Math.sin(angleInRadians));
        const newCanvasWidth = img.width * absCos + img.height * absSin;
        const newCanvasHeight = img.width * absSin + img.height * absCos;
        canvas.width = newCanvasWidth;
        canvas.height = newCanvasHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angleInRadians);
        if (flipHorizontal) ctx.scale(-1, 1);
        if (flipVertical) ctx.scale(1, -1);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
        setImageWidthValue(canvas.width);
        setImageHeightValue(canvas.height);
        setOnProcessUrl(canvas.toDataURL("image/png"));
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

  useEffect(() => {
    if (isGrayscale && onProcessUrl && canvasRef.current) {
      const img = new Image();
      img.src = onProcessUrl;
      img.onload = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData && ctx) {
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
          }
          ctx.putImageData(imageData, 0, 0);
        }
      };
    }
  }, [isGrayscale]);

  useEffect(() => {
    if (isResizing && onProcessUrl && canvasRef.current) {
      const img = new Image();
      img.src = onProcessUrl;
      img.onload = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d");
        canvas.width = resizeWidth;
        canvas.height = resizeHeight;
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(img, 0, 0, resizeWidth, resizeHeight);
      };
    }
  }, [resizeWidth, resizeHeight, isResizing]);


  useEffect(() => {
    if (isPadding && onProcessUrl && canvasRef.current) {
      processPaddingEffect(
        canvasRef.current,
        onProcessUrl,
        paddingMode as "custom" | "symmetric" | "square",
        {
          paddingLeft,
          paddingRight,
          paddingTop,
          paddingBottom,
          paddingSymmetric,
        }
      ).then(({ dataUrl, width, height }) => {
        setImagePaddedWidth(width);
        setImagePaddedHeight(height);
        setOnProcessUrl(dataUrl);
      });
    }
  }, [
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    paddingSymmetric,
    isPadding,
    paddingMode,
  ]);

  // ********* Alert *********
  const startTimer = () => {
    setTimeout(() => setOpen(false), 5000);
  };
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  if (open) startTimer();

  // ********* Render *********
  return (
    <div>
      {open && (
        <div className="fixed top-24 left-0 w-full flex justify-center z-50 animate-fade-in-out">
          <Alert severity="info" onClose={handleClose}>
            <AlertTitle>{alertTitle}</AlertTitle>
          </Alert>
        </div>
      )}
      {selectedImage && (
        <div className="flex w-full">
          {isCropping ? (
            <div className="px-10 mx-auto w-full h-fit pb-10 flex">
              {onProcessUrl && (
                <ImgCropper
                  src={onProcessUrl}
                  onCropDone={(croppedImageUrl: string) => {
                    setSelectedImage(croppedImageUrl);
                    setIsCropping(false);
                    setAlertTitle("Cropped");
                    handleClickOpen();
                  }}
                  onCancel={() => {
                    setIsCropping(false);
                    setSelectedImage(onProcessUrl);
                  }}
                />
              )}
            </div>
          ) : (
            <div className="px-10 mx-auto w-full h-fit pb-10 flex">
              <div className="w-[70%] border flex flex-col pb-6 rounded-[5px]">
                <div className="h-fit flex items-center justify-center pt-10">
                  <canvas
                    className="border-2 border-dashed border-gray-400"
                    ref={canvasRef}
                    style={{
                      maxWidth: "450px",
                      maxHeight: "450px",
                      minWidth: "150px",
                      minHeight: "150px",
                    }}
                  ></canvas>
                </div>
                <div className="flex justify-center text-center">
                  <span className="text-xl bg-slate-100 text-indigo-600 font-medium rounded-md w-fit px-4 my-4">
                    width: {imageWidthValue} (px)
                  </span>
                  <span className="mx-2 w-fit my-4">x</span>
                  <span className="text-xl bg-slate-100 text-indigo-600 font-medium rounded-md w-fit px-4 my-4">
                    height: {imageHeightValue} (px)
                  </span>
                </div>
                <div className="flex gap-6 mx-auto">
                  <div
                    onClick={onResetImage}
                    className="flex items-center justify-center w-fit px-2 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer hover:text-blue-700"
                  >
                    <RestartAlt />
                    <p className="text-center text-sm font-medium">Reset รูปภาพ</p>
                  </div>
                  <div
                    onClick={handleCropping}
                    className="flex items-center justify-center w-fit px-2 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer hover:text-blue-700"
                  >
                    <Crop />
                    <p className="text-center text-sm font-medium">Crop รูปภาพ</p>
                  </div>
                  <div
                    onClick={downloadImage}
                    className="flex items-center justify-center w-fit h-10 px-2 rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer hover:text-blue-700"
                  >
                    <Download />
                    <p className="text-center text-sm font-medium">Download รูปภาพ</p>
                  </div>
                </div>
              </div>

              {onProcessUrl && (
                <div className="w-[40%] border rounded-[5px]">
                  <div className="w-full px-2 mx-auto">
                    <TabContext value={value}>
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList
                          onChange={handleChange}
                          aria-label="Edit Tab"
                          sx={{ display: "flex", justifyContent: "space-between" }}
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
                        <RotationTab
                          onRotateLeft={handleRotateLeft}
                          onRotateRight={handleRotateRight}
                          toggleFlipHorizontal={toggleFlipHorizontal}
                          toggleFlipVertical={toggleFlipVertical}
                        />
                      </TabPanel>
                      <TabPanel value="2">
                        <GrayscaleTab
                          isGrayscale={isGrayscale}
                          toggleGrayscale={toggleGrayscale}
                          handleSaveGrayscale={handleSaveGrayscale}
                        />
                      </TabPanel>
                      <TabPanel value="3">
                        <ResizeTab
                          resizeWidth={resizeWidth}
                          resizeHeight={resizeHeight}
                          handleResizeWidthChange={handleResizeWidthChange}
                          handleResizeHeightChange={handleResizeHeightChange}
                          isSymmetricResize={isSymmetricResize}
                          setIsSymmetricResize={setIsSymmetricResize}
                          handleSaveResize={handleSaveResize}
                        />
                      </TabPanel>
                      <TabPanel value="4">
                        <PaddingTab
                          paddingMode={paddingMode}
                          setPaddingMode={setPaddingMode}
                          paddingSymmetric={paddingSymmetric}
                          handlePaddingSymmetricChange={handlePaddingSymmetricChange}
                          paddingTop={paddingTop}
                          paddingBottom={paddingBottom}
                          paddingLeft={paddingLeft}
                          paddingRight={paddingRight}
                          handlePaddingTopChange={handlePaddingTopChange}
                          handlePaddingBottomChange={handlePaddingBottomChange}
                          handlePaddingLeftChange={handlePaddingLeftChange}
                          handlePaddingRightChange={handlePaddingRightChange}
                          handleSavePadding={handleSavePadding}
                          imagePaddedWidth={imagePaddedWidth}
                          imagePaddedHeight={imagePaddedHeight}
                        />
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
  );
};

export default ImageUploader;
