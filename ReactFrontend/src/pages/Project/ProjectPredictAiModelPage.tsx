import React, {useState } from 'react';
import MiniFooter from '../../components/MiniFooter';
import Sidebar from "../../components/Sidebar";
import SkeletonLayout from '../../components/SkeletonPageLayout';
import { useProjecteData } from '../../hook/projects/useProjectData';
import { useWorkspaceData } from '../../hook/workspaces/useWorkspaceData';
import { useAiPrediction } from '../../hook/ai/useAiPrediction';
import { StepIndicator } from '../../components/ai/predictPage/StepIndicator';
import { ImageUploadForm } from '../../components/ai/predictPage/ImageUploadForm';
import { VideoUploadForm } from '../../components/ai/predictPage/VideoUploadForm';
import { PredictResult } from '../../types/Ai';


const PredictAiModelPage: React.FC = () => {
  const [uploadStep, setUploadStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [customedImageUrl, setCustomedImageUrl] = useState<string | null>(null);
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [predictResult, setPredictResult] = useState<PredictResult | null>(null);
  const { predictFromImage, predictFromVideo } = useAiPrediction();
  const { workspaceDetail, isLoadingWorkspace } = useWorkspaceData();
  const { projectDetail, isLoadingProjectDetail } = useProjecteData();



  if (isLoadingProjectDetail || isLoadingWorkspace) return <SkeletonLayout />;

  const isImageType = projectDetail?.input_type === "รูปภาพ";
  const steps = isImageType
    ? ["อัปโหลดรูปภาพ", "ปรับแต่งภาพ", "ประมวลผล", "เสร็จสิ้น"]
    : ["อัปโหลดวิดีโอ", "ประมวลผล", "เสร็จสิ้น"];

  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        <Sidebar workspace={workspaceDetail} project={projectDetail} />
        <div className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32 h-full min-h-screen">
          <div className="pb-5 h-fit w-full bg-white  relative">
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
                predictFromImage={predictFromImage}
                customedImageUrl={customedImageUrl}
                setCustomedImageUrl={setCustomedImageUrl}
                customImage={customImage}
                setCustomImage={setCustomImage}
              />
            ) : (
              <VideoUploadForm
                file={file}
                setFile={setFile}
                uploadStep={uploadStep}
                setUploadStep={setUploadStep}
                predictResult={predictResult}
                setPredictResult={setPredictResult}
                predictFromVideo={predictFromVideo}
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