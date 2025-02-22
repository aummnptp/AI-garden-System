import { Button, Skeleton } from "@mui/material";
import AIDisPlayResultComponent from "../../aiDisplay/AIDisPlayResultComponent";
import { FileUploadArea } from "./FileUploadArea";

interface PredictResult {
    prediction: any;
  }
  
export const VideoUploadForm: React.FC<{
    file: File | null;
    setFile: (file: File | null) => void;
    uploadStep: number;
    setUploadStep: (step: number) => void;
    predictResult: PredictResult | null;
    setPredictResult: (result: PredictResult | null) => void;
    predictFromFile: any;
  }> = ({
    file,
    setFile,
    uploadStep,
    setUploadStep,
    predictResult,
    setPredictResult,
    predictFromFile,
  }) => {
    const handleUploadVideo = async () => {
      if (!file) {
        console.error("No file selected");
        return;
      }
      setUploadStep(2);
      predictFromFile.mutate(file, {
        onSuccess: (data: PredictResult) => {
          setPredictResult(data);
          setUploadStep(3);
        },
        onError: () => {
          setUploadStep(1);
        },
      });
    };
  
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUploadVideo();
        }}
        className="m-6 space-y-4"
      >
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
          {uploadStep === 1 && (
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#3b82f6",
                "&:hover": { backgroundColor: "#2563eb" },
              }}
            >
              ประมวลผล
            </Button>
          )}
        </div>
      </form>
    );
  };