import { useState } from "react";
import MiniFooter from "../../components/MiniFooter";
import { ImageUploadDemoForm } from "../../components/ai/demo/ImageUploadDemoForm";
import { StepIndicator } from "../../components/ai/predictPage/StepIndicator";
import { useAiDemoPredict } from "../../hook/ai/useAiDemoPredict";
import { useAiData } from "../../hook/ai/useAiData";
import SkeletonLayout from "../../components/SkeletonPageLayout";
import toast from "react-hot-toast";
import { PredictResult } from "../../types/Ai";


const AIDemo: React.FC = () => {
  const [uploadStep, setUploadStep] = useState<number>(1);
  const [image, setImage] = useState<File | null>(null);
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [customedImageUrl, setCustomedImageUrl] = useState<string | null>(null);
  const [predictResult, setPredictResult] = useState<PredictResult | null>(
    null
  );
  const { predictFromImage } = useAiDemoPredict();
  const { aiModelData, isLoadingAiModel } = useAiData();

  const steps = ["อัปโหลดรูปภาพ", "ปรับแต่งภาพ", "ประมวลผล", "เสร็จสิ้น"];

  // Handler to receive the processed image URL from the child component
  const handleProcessUrlChange = (url: string) => {
    setCustomedImageUrl(url);
  };

  const handleUpload = async () => {
    setUploadStep(3);

    if (!customedImageUrl) {
      toast.error("กรุณาอัพโหลดไฟล์");
      return;
    }

    predictFromImage.mutate(customedImageUrl, {
      onSuccess: (data: PredictResult) => {
        setPredictResult(data);
        setUploadStep(4);
      },
      onError: (error) => {
        toast.error(error.message);
        setUploadStep(2);
      },
    });
  };

  const handleBack = () => {
    setUploadStep(Math.max(uploadStep - 1, 1));
    setImage(customImage);
    setCustomImage(null);
  };
  if (isLoadingAiModel) {
    return <SkeletonLayout />;
  }

  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        <div className="w-full ml-auto bg-neutral-100 flex flex-col items-center pb-32 min-h-screen">
          <div className="mt-4 pb-5 w-11/12 bg-white rounded-[15px] relative">
            <h1 className="p-5 ml-5 text-3xl font-medium tracking-tight text-indigo-900">
              ทดลองใช้
            </h1>
            <div className="w-[95%] h-0 border border-zinc-300 mx-auto" />
            {/* Step Indicator */}
            <StepIndicator steps={steps} currentStep={uploadStep} />
            <div className="w-full">
              {/* Left: Upload & Process Form */}
              <div className=" p-4">
                <ImageUploadDemoForm
                  uploadStep={uploadStep}
                  setUploadStep={setUploadStep}
                  image={image}
                  setImage={setImage}
                  customImage={customImage}
                  setCustomImage={setCustomImage}
                  customedImageUrl={customedImageUrl}
                  setCustomedImageUrl={setCustomedImageUrl}
                  predictResult={predictResult}
                  setPredictResult={setPredictResult}
                  handleUpload={handleUpload}
                  handleProcessUrlChange={handleProcessUrlChange}
                  onBack={handleBack}
                  aiData={aiModelData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <MiniFooter />
    </>
  );
};

export default AIDemo;
