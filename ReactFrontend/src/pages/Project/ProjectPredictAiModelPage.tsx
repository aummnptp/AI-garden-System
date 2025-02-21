import React, { ChangeEvent, DragEvent,useEffect,useState } from 'react';
import MiniFooter from '../../components/MiniFooter';
import Sidebar from "../../components/Sidebar";
import { Alert, AlertTitle, Button, Skeleton } from '@mui/material';

import SkeletonLayout from '../../components/SkeletonPageLayout';
import { useProjecteData } from '../../hook/projects/useProjectData';
import { useWorkspaceData } from '../../hook/workspaces/useWorksapceData';
import { useAiPrediction } from '../../hook/ai/useAiPrediction';
import { StepIndicator } from '../../components/ai/predictPage/StepIndicator';
import { ImageUploadForm } from '../../components/ai/predictPage/ImageUploadForm';
import { VideoUploadForm } from '../../components/ai/predictPage/VideoUploadForm';

interface PredictResult {
  ai_type: string;
  prediction: any;
}
const PredictAiModelPage: React.FC = () => {
  const [uploadStep, setUploadStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [customedImageUrl, setCustomedImageUrl] = useState<string | null>(null);
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [predictResult, setPredictResult] = useState<PredictResult | null>(null);
  const [alertText, setAlertText] = useState<string | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const { predictFromUrl, predictFromFile } = useAiPrediction();
  const { workspaceDetail, isLoadingWorkspace } = useWorkspaceData();
  const { projectDetail, isLoadingProjectDetail } = useProjecteData();

  useEffect(() => {
    if (openAlert) {
      const timer = setTimeout(() => setOpenAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [openAlert]);

  if (isLoadingProjectDetail || isLoadingWorkspace) return <SkeletonLayout />;

  const isImageType = projectDetail?.input_type === "รูปภาพ";
  const steps = isImageType
    ? ["อัปโหลดรูปภาพ", "ปรับแต่งภาพ", "ประมวลผล", "เสร็จสิ้น"]
    : ["อัปโหลดวิดีโอ", "ประมวลผล", "เสร็จสิ้น"];

  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        {openAlert && (
          <div className="fixed top-24 w-full flex justify-center z-50 animate-fade-in-out">
            <Alert severity="error" onClose={() => setOpenAlert(false)}>
              <AlertTitle>Error</AlertTitle>
              {alertText}
            </Alert>
          </div>
        )}
        <Sidebar workspace={workspaceDetail} project={projectDetail} />
        <div className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32 h-full min-h-screen">
          <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] relative">
            <div className="flex justify-between items-center p-5">
              <h1 className="text-3xl font-medium tracking-tight text-indigo-900">
                {isImageType ? "Upload Image" : "Upload Video"}
              </h1>
            </div>
            <div className="w-[95%] h-0 border border-zinc-300 mx-auto"></div>
            <StepIndicator steps={steps} currentStep={uploadStep} />
            {isImageType ? (
              <ImageUploadForm
                file={file}
                setFile={setFile}
                uploadStep={uploadStep}
                setUploadStep={setUploadStep}
                predictResult={predictResult}
                setPredictResult={setPredictResult}
                predictFromUrl={predictFromUrl}
                predictFromFile={predictFromFile}
                customedImageUrl={customedImageUrl}
                setCustomedImageUrl={setCustomedImageUrl}
                customImage={customImage}
                setCustomImage={setCustomImage}
                setAlertText={setAlertText}
                setOpenAlert={setOpenAlert}
              />
            ) : (
              <VideoUploadForm
                file={file}
                setFile={setFile}
                uploadStep={uploadStep}
                setUploadStep={setUploadStep}
                predictResult={predictResult}
                setPredictResult={setPredictResult}
                predictFromFile={predictFromFile}
              />
            )}
          </div>
        </div>
      </div>
      <MiniFooter />
    </>
  );
};

export default PredictAiModelPage;