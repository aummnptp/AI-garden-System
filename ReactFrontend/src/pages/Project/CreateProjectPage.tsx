import { ChangeEvent, DragEvent,  useState } from 'react'
import Sidebar from '../../components/Sidebar'
import {Button } from '@mui/material';
import { AIDataType } from '../../types/Ai';
import { useWorkspaceData } from '../../hook/workspaces/useWorkspaceData';
import SkeletonLayout from '../../components/SkeletonPageLayout';
import { useApprovedAiData } from '../../hook/ai/useApprovedAiData';
import { useCreateProjectMutation } from '../../hook/projects/useCreateProject';
import toast from 'react-hot-toast';
import { StepIndicator } from '../../components/ai/predictPage/StepIndicator';
import { StepOne, StepThree, StepTwo } from '../../components/project/createProjectComponent';

function CreateProjectPage() {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [inputType, setInputType] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [uploadStep, setUploadStep] = useState(1);
  const [selectedAI, setSelectedAI] = useState<AIDataType | undefined>(undefined);
  const {MyApprovedAi,isLoadingAI } = useApprovedAiData();
  const { createProjectMutation } = useCreateProjectMutation();

  const handleSelectCard = (id: string) => {
    const selectedCard = MyApprovedAi.find(data => data.aiId === id);
    setSelectedAI(selectedCard);
    setSelectedCardId(id); 
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setImage(file);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

const handleToNextStep = () => {
  if (uploadStep === 1 && (projectName === '' || projectDescription === '')) {
    toast.error('กรุณากรอกข้อมูลชื่อและรายละเอียด');
  } 
  else if (uploadStep === 2 && selectedAI === undefined) {
    toast.error('กรุณาเลือก AI ที่ต้องการใช้งาน');
  } 

  else {
    setUploadStep((prevStep) => Math.min(prevStep + 1, 5));
  }
};

const handleSubmit = () => {
  if (!inputType || inputType.trim() === "") {
    toast.error("กรุณาเลือกประเภท Project");
    return;
  }

    createProjectMutation.mutate({
      name: projectName,
      description: projectDescription,
      input_type: inputType,
      ai_id: selectedCardId,
      image_path: image,
    });
  };

  const { workspaceDetail, isLoadingWorkspace } =
  useWorkspaceData();
  if (isLoadingAI||isLoadingWorkspace) {
    return <SkeletonLayout />;
  }
  const steps = ["ใส่ข้อมูล", "เลือก AI", "เลือกประเภทProject","เสร็จสิ้น"];

  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        <Sidebar workspace={workspaceDetail} />

        <div
          onSubmit={handleSubmit}
          className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen "
        >
          {/* create container */}
          <div className="px-8 py-2 col-span-10 mt-4 pb-5 h-fit  w-[95%] bg-white rounded-[15px] justify-self relative ">
            <h1 className="text-indigo-900 text-4xl font-medium  leading-loose">
              Create New Project
            </h1>
            <div className="mb-10 h-[0px] border border-zinc-300 mx-auto" />

            {/* upload step */}
            <StepIndicator currentStep={uploadStep} steps={steps} />

            {uploadStep === 1 && (
            <StepOne
              projectName={projectName}
              setProjectName={setProjectName}
              projectDescription={projectDescription}
              setProjectDescription={setProjectDescription}
              image={image}
              setImage={setImage}
              handleFileSelect={handleFileSelect}
              handleDrop={handleDrop}
              handleDragOver={handleDragOver}
            />
          )}
          {uploadStep === 2 && (
            <StepTwo
              MyApprovedAi={MyApprovedAi}
              selectedCardId={selectedCardId}
              handleSelectCard={handleSelectCard}
            />
          )}
          {uploadStep === 3 && selectedAI && (
            <StepThree selectedAI={selectedAI} inputType={inputType} setInputType={setInputType} />
          )}
          </div>
          <div
            className={`pr-12 w-[100%] pl-[20%] h-[12%] bg-white border border-zinc-300 fixed bottom-0 right-0 flex ${uploadStep > 1 ? "justify-between" : "justify-end"
              } items-center`}
          >
            {uploadStep > 1 ? (
              <Button

                size="large"
                variant="contained"
                sx={{
                  backgroundColor: "#4f46e5",
                  "&:hover": { backgroundColor: "#3730a3" },
                }}
                style={{ marginRight: "0.5rem" }}
                onClick={() => {
                  setUploadStep((prevStep) => Math.max(prevStep - 1, 1));
                }}
              >
                Back
              </Button>
            ) : null}
            {uploadStep == 3 ? (
              <Button
                onClick={handleSubmit}

                size="large"
                variant="contained"
                sx={{
                  backgroundColor: "#4f46e5",
                  "&:hover": { backgroundColor: "#3730a3" },
                }}
                style={{ marginRight: "0.5rem" }}

              >
                Create
              </Button>
            ) : (
              <Button

                size="large"
                variant="contained"
                sx={{
                  backgroundColor: "#4f46e5",
                  "&:hover": { backgroundColor: "#3730a3" },
                }}
                style={{ marginRight: "0.5rem" }}
                onClick={() => {
                  handleToNextStep();
                }}
              >
                Next Step
              </Button>
            )}
          </div>
        </div >
      </div>
    </>
  );
}

export default CreateProjectPage