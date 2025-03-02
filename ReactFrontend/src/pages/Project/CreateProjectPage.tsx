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
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProjectFormType, createProjectSchema } from '../../validations/projectSchema';

function CreateProjectPage() {
  const [uploadStep, setUploadStep] = useState(1);
  const steps = ["ใส่ข้อมูล", "เลือก AI", "เลือกประเภท Project", "เสร็จสิ้น"];
  
  const { workspaceDetail, isLoadingWorkspace } = useWorkspaceData();
  const { MyApprovedAi, isLoadingAI } = useApprovedAiData();
  const { createProjectMutation } = useCreateProjectMutation();

  const methods = useForm<CreateProjectFormType>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      projectName: "",
      projectDescription: "",
      image: undefined,
      selectedCardId: "",
      inputType: "",
    },
  });
  const { trigger, handleSubmit, setValue, watch, formState: { errors } } = methods;

  const handleSelectCard = (id: string) => {
    setValue("selectedCardId", id);
  };

  // ตัวอย่างฟังก์ชันสำหรับอัปโหลดไฟล์
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setValue("image", file);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Validate เฉพาะ field ที่เกี่ยวข้องในแต่ละ step
  const handleToNextStep = async () => {
    if (uploadStep === 1) {
      // validate projectName และ projectDescription
      const valid = await trigger(["projectName", "projectDescription"]);
      if (!valid) {
        toast.error("กรุณากรอกข้อมูลชื่อและคำอธิบายให้ถูกต้อง");
        return;
      }
    } else if (uploadStep === 2) {
      // validate selectedCardId
      const valid = await trigger("selectedCardId");
      if (!valid) {
        toast.error("กรุณาเลือก AI ที่ต้องการใช้งาน");
        return;
      }
    } else if (uploadStep === 3) {
      // validate inputType
      const valid = await trigger("inputType");
      if (!valid) {
        toast.error("กรุณาเลือกประเภท Project");
        return;
      }
    }
    setUploadStep((prev) => Math.min(prev + 1, steps.length));
  };

  // เมื่อ submit ฟอร์มทั้งหมด
  const onSubmit = (data: CreateProjectFormType) => {
    createProjectMutation.mutate({
      name: data.projectName,
      description: data.projectDescription,
      input_type: data.inputType,
      ai_id: data.selectedCardId,
      image_path: data.image,
    });
  };

  if (isLoadingAI || isLoadingWorkspace) return <SkeletonLayout />;

  return (
    <FormProvider {...methods}>
    <div className="flex h-full min-h-screen bg-neutral-100">
      <Sidebar workspace={workspaceDetail} />

      <div className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32 h-full min-h-screen">
        <div className="px-8 py-2 col-span-10 mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] relative">
          <h1 className="text-indigo-900 text-4xl font-medium leading-loose">
            Create New Project
          </h1>
          <div className="mb-10 h-[0px] border border-zinc-300 mx-auto" />

          <StepIndicator currentStep={uploadStep} steps={steps} />

          {/* Render step components */}
          {uploadStep === 1 && (
            <StepOne
            projectName={watch("projectName")}
            setProjectName={(val: string) => setValue("projectName", val)}
            projectDescription={watch("projectDescription")}
            setProjectDescription={(val: string) => setValue("projectDescription", val)}
            image={watch("image") || undefined}  
            setImage={(file: File | undefined) => setValue("image", file)}
            handleFileSelect={handleFileSelect}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            errors={errors}
          />
          )}
          {uploadStep === 2 && (
            <StepTwo
              MyApprovedAi={MyApprovedAi}
              selectedCardId={watch("selectedCardId")}
              handleSelectCard={handleSelectCard}
            />
          )}
          {uploadStep === 3 && (
            <StepThree
              selectedAI={MyApprovedAi.find((ai: AIDataType) => ai.aiId === watch("selectedCardId"))}
              inputType={watch("inputType")}
              setInputType={(val: string) => setValue("inputType", val)}
            />
          )}
        </div>
        <div
          className={`pr-12 w-full pl-[20%] h-[12%] bg-white border border-zinc-300 fixed bottom-0 right-0 flex ${
            uploadStep > 1 ? "justify-between" : "justify-end"
          } items-center`}
        >
          {uploadStep > 1 && (
            <Button
              size="large"
              variant="contained"
              sx={{
                backgroundColor: "#4f46e5",
                "&:hover": { backgroundColor: "#3730a3" },
              }}
              style={{ marginRight: "0.5rem" }}
              onClick={() => setUploadStep((prev) => Math.max(prev - 1, 1))}
            >
              Back
            </Button>
          )}
          {uploadStep === 3 ? (
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
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
              onClick={handleToNextStep}
            >
              Next Step
            </Button>
          )}
        </div>
      </div>
    </div>
  </FormProvider>
  );
}

export default CreateProjectPage