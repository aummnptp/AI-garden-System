import  {  useEffect, useState } from "react";
import {
  ExclamationCircleOutlined,

} from "@ant-design/icons";
import {  useParams } from "react-router-dom";
import MiniFooter from "../../components/MiniFooter";
import {
  Alert,
  AlertTitle,

} from "@mui/material";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import { ImageUploadDemoForm } from "../../components/ai/demo/ImageUploadDDemoForm";
import { StepIndicator } from "../../components/ai/predictPage/StepIndicator";
import { AIDataType } from "../../types/Ai";


interface PredictResult {
  ai_type: string;
  prediction: any;
  regression_params?: any | null;
}

const AIDemo: React.FC = () => {
  const [uploadStep, setUploadStep] = useState(1);
  const [image, setImage] = useState<File | null>(null);
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [customedImageUrl, setCustomedImageUrl] = useState<string | null>(null);
  const [predictResult, setPredictResult] = useState<PredictResult | null>(null);
  const [alertText, setAlertText] = useState<string | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [aiData, setAiData] = useState<AIDataType | null>(null);

  const { ai_id } = useParams<{ ai_id?: string }>();

  // Fetch AI model details
  useEffect(() => {
    if (ai_id) {
      axios
        .get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/${ai_id}`)
        .then((response) => setAiData(response.data))
        .catch((error) => console.error("Error fetching AI data", error));
    }
  }, [ai_id]);

  // Auto-close alert after 5 seconds
  useEffect(() => {
    if (openAlert) {
      const timer = setTimeout(() => setOpenAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [openAlert]);

  if (!aiData) {
    return <LoadingSpinner />;
  }

  const steps = ["อัปโหลดรูปภาพ", "ปรับแต่งภาพ", "ประมวลผล", "เสร็จสิ้น"];

  // Handler to receive the processed image URL from the child component
  const handleProcessUrlChange = (url: string) => {
    setCustomedImageUrl(url);
  };

  // Helper to convert a URL to a File object
  const convertUrlToFile = async (url: string, fileName: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  };

  // Upload handler: convert the processed image URL to a file and call the predict API
  const handleUpload = async () => {
    setUploadStep(3);
    try {
      if (!customedImageUrl) {
        console.error("No image URL to upload");
        return;
      }
      const file = await convertUrlToFile(customedImageUrl, "processedImage.jpg");
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/predict/${ai_id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setPredictResult(response.data);
      setUploadStep(4);
    } catch (error: any) {
      console.error("Error uploading file", error);
      if (error.response && error.response.status === 400) {
        setAlertText(error.response.data.message);
        setOpenAlert(true);
        setUploadStep(2);
      }
    }
  };

  // Back handler for step 2
  const handleBack = () => {
    setUploadStep(Math.max(uploadStep - 1, 1));
    setImage(customImage);
    setCustomImage(null);
  };

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
  <div className="w-full ml-auto bg-neutral-100 flex flex-col items-center pb-32 min-h-screen">
  <div className="mt-4 pb-5 w-11/12 bg-white rounded-[15px] relative">
    <h1 className="p-5 ml-5 text-3xl font-medium tracking-tight text-indigo-900">
      ทดลองใช้
    </h1>
    <div className="w-[95%] h-0 border border-zinc-300 mx-auto" />

    {/* Step Indicator */}
    <StepIndicator steps={steps} currentStep={uploadStep} />

    <div
      className="w-full"
    >
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
          aiData={aiData}
        />
      </div>

      {/* Right: AI Model Details */}
    
    </div>
  </div>
</div>

      </div>
      <MiniFooter />
    </>
  );
};

export default AIDemo;