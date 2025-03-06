import { Button, Skeleton } from "@mui/material";
import AIDisPlayResultComponent from "../../aiDisplay/AIDisPlayResultComponent";
import { FileUploadArea } from "./FileUploadArea";
import { PredictResult } from "../../../types/Ai";
import toast from "react-hot-toast";

export const VideoUploadForm: React.FC<{
  file: File | null;
  setFile: (file: File | null) => void;
  uploadStep: number;
  setUploadStep: (step: number) => void;
  predictResult: PredictResult | null;
  setPredictResult: (result: PredictResult | null) => void;
  predictFromVideo: any;
}> = ({
  file,
  setFile,
  uploadStep,
  setUploadStep,
  predictResult,
  setPredictResult,
  predictFromVideo,
}) => {
  
    const handleUploadVideo = async () => {
      if (!file) {
        toast.error("No file to upload");
        return;
      }
      setUploadStep(2);
      predictFromVideo.mutate(file, {
        onSuccess: (data: PredictResult) => {
          setPredictResult(data);
          setUploadStep(3);
        },
        onError: (error: any) => {
          toast.error(error.message);
          setUploadStep(1);
        },
      });
    };



    return (
      <div className="m-6 space-y-4">
        {uploadStep === 1 && (
          <div className="form-group">
            <FileUploadArea
              file={file}
              setFile={setFile}
              accept="video/*"
              placeholder="คุณยังไม่ได้อัปโหลดวิดีโอ"
            />
          </div>
        )}
        {uploadStep === 2 && (
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
        {uploadStep === 3 && predictResult && (
          <AIDisPlayResultComponent resultImage="" predictResult={predictResult} />
        )}
        <div className="flex justify-end">
          {uploadStep !== 2 && (
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#3b82f6",
                "&:hover": { backgroundColor: "#2563eb" },
              }}
              onClick={() => {
                if (uploadStep === 1) {
                  handleUploadVideo();
                } else {
                  setUploadStep(1);
                }
              }}
            >
              {uploadStep === 1 ? "ประมวลผล" : "อัพโหลดอีกครั้ง"}
            </Button>
          )}
        </div>
        </div>
    );
  };