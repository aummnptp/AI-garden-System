import { Button, Skeleton } from "@mui/material";
import { FileUploadArea } from "../predictPage/FileUploadArea";
import AIDisPlayResultComponent from "../../aiDisplay/AIDisPlayResultComponent";
import { Link } from "react-router-dom";
import { AIDataType, PredictResult } from "../../../types/Ai";
import { ExclamationCircleOutlined } from "@ant-design/icons";


  
export const VideoUploadDemoForm: React.FC<{
    uploadStep: number;
    setUploadStep: (step: number) => void;
    file: File | null;
    setFile: (file: File | null) => void;
    predictResult: PredictResult | null;
    setPredictResult: (result: PredictResult | null) => void;
    aiData: AIDataType;
    predictFromVideo: any;
  }> = ({
    uploadStep,
    setUploadStep,
    file,
    setFile,
    predictResult,
    setPredictResult,
    aiData,
    predictFromVideo,
  }) => {
    const handleUploadVideo = async () => {
      if (!file) {
        return;
      }
      setUploadStep(2);
      predictFromVideo.mutate(file, {
        onSuccess: (data: PredictResult) => {
          setPredictResult(data);
          setUploadStep(3);
        },
        onError: (error: unknown) => {
          if (error instanceof Error) {
            console.error("Prediction Error:", error.message); 
          } else {
            console.error("Unknown error occurred:", error);
          }
          setUploadStep(1);
        },
      });
    };
    return (
        <div className="w-full h-full px-10">
      {/* Step 1: Upload Image */}
      {uploadStep === 1 && (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex justify-center">
            <FileUploadArea
              file={file}
              setFile={setFile}
              accept="video/*"
              placeholder="คุณยังไม่ได้อัปโหลดวิดีโอ"
            />
          </div>
          <div className="flex-1 p-6 bg-gray-50 rounded-md">
          <div className="flex items-center">
            <h1 className="mb-2 text-3xl font-medium tracking-tight text-indigo-900">
              {aiData.name}
            </h1>
            <span className="ml-3 w-fit bg-indigo-600 rounded-[5px] px-2.5 py-0.5 text-white text-lg font-normal">
              {aiData.ai_type}
            </span>
          </div>
          <div className="w-full border border-zinc-300 my-2" />
          <p className="text-neutral-700 text-lg font-normal">รายละเอียด</p>
          <p>{aiData.description}</p>
          <div className="mb-2 mt-4">
            {aiData.ai_tag.map((tag: string, index: number) => (
              <span
                key={index}
                className="w-fit bg-indigo-400 rounded-[5px] mr-2 px-2.5 py-0.5 text-white text-lg font-normal"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4">
            <ExclamationCircleOutlined style={{ color: "#404040" }} />
            <span className="text-neutral-700 text-lg font-normal ml-2">
              เกี่ยวกับรูปภาพและวิดีโอที่จะนำไปประมวลผล
            </span>
            <p className="ml-3">{aiData.input_desc}</p>
          </div>
        </div>
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
            onClick={handleUploadVideo} // เรียกใช้ฟังก์ชันตรงๆ
          >
            ประมวลผล
          </Button>
          )}
        {uploadStep === 4 && (
          <div className="w-full flex justify-between">
            <div className="w-[50%] justify-center flex">
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  setUploadStep(1);
                  setFile(null);
                  setPredictResult(null);
                }}
              >
                ทดลองอีกครั้ง
              </Button>
            </div>
            <Link to={`/ai-list`}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#4f46e5",
                  "&:hover": { backgroundColor: "#3730a3" },
                }}
              >
                กลับไปยังหน้ารายชื่อ AI
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
    );
  };