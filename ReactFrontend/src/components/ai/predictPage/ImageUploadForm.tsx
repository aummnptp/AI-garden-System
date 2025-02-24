import { Button, Skeleton } from "@mui/material";
import ImageUploader from "../../ImageUploader";
import { FileUploadArea } from "./FileUploadArea";
import AIDisPlayResultComponent from "../../aiDisplay/AIDisPlayResultComponent";
import toast from "react-hot-toast";
import { PredictResult } from "../../../types/Ai";


  
export const ImageUploadForm: React.FC<{
    file: File | null;
    setFile: (file: File | null) => void;
    uploadStep: number;
    setUploadStep: (step: number | ((prev: number) => number)) => void;
    predictResult: PredictResult | null;
    setPredictResult: (result: PredictResult | null) => void;
    predictFromUrl: any;
    predictFromFile: any;
    customedImageUrl: string | null;
    setCustomedImageUrl: (url: string | null) => void;
    customImage: File | null;
    setCustomImage: (file: File | null) => void;
  }> = ({
    file,
    setFile,
    uploadStep,
    setUploadStep,
    predictResult,
    setPredictResult,
    predictFromUrl,
    customedImageUrl,
    setCustomedImageUrl,
    customImage,
    setCustomImage,
  }) => {

const handleToCustomStep = () => {
  setUploadStep((prev: number) => Math.min(prev + 1, 5)); 
  setCustomImage(file);
  setFile(null);
};
  
    const handleUpload = async () => {
      if (!customedImageUrl) {
        toast.error("No image URL to upload");
        return;
      }
      setUploadStep(3);
      predictFromUrl.mutate(customedImageUrl, {
        onSuccess: (data: PredictResult) => {
          setPredictResult(data);
          setUploadStep(4);
        },
        onError: (error: any) => {
          toast.error(error.message);
          setUploadStep(2);
        },
      });
    };
  
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpload();
        }}
        className="m-6 space-y-4"
      >
        {uploadStep === 1 && (
          <div className="form-group">
            <FileUploadArea
              file={file}
              setFile={setFile}
              accept="image/*"
              placeholder="คุณยังไม่ได้อัปโหลดรูปภาพ"
            />
          </div>
        )}
        {uploadStep === 2 && customImage && (
          <ImageUploader image={customImage} onProcessUrlChange={setCustomedImageUrl} />
        )}
        {uploadStep === 3 && (
          <div className="w-full">
            <div className="flex w-full">
              <div className="w-[50%] text-center space-y-2 border rounded-[5px] p-10 flex justify-center">
                <Skeleton variant="rectangular" width={300} height={300} />
              </div>
              <div className="w-[50%] text-center space-y-2 border rounded-[5px] p-10 flex flex-col justify-center">
                <Skeleton variant="text" width="100%" height={30} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="100%" height={30} />
                <Skeleton variant="text" width="100%" height={20} />
              </div>
            </div>
          </div>
        )}
        {uploadStep === 4 && predictResult && customedImageUrl && (
          <AIDisPlayResultComponent resultImage={customedImageUrl} predictResult={predictResult} />
        )}
        <div className="flex justify-end">
          {uploadStep === 1 && (
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#3b82f6",
                "&:hover": { backgroundColor: "#2563eb" },
              }}
              onClick={handleToCustomStep}
            >
              ถัดไป
            </Button>
          )}
          {uploadStep !== 1 && uploadStep !== 3 && (
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#3b82f6",
                "&:hover": { backgroundColor: "#2563eb" },
              }}
            >
              {uploadStep === 2 ? "ประมวลผล" : "อัพโหลดอีกครั้ง"}
            </Button>
          )}
        </div>
      </form>
    );
  };