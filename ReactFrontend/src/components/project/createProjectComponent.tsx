import React, { ChangeEvent, DragEvent } from "react";
import ProjectImageInput from "../input/ProjectImageInput";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { AIDataType } from "../../types/Ai";
import CreateProjectCard from "../card/CreateProjectCard";
import { getImageUrl } from "../../function/util";
import { CreateProjectFormType } from "../../validations/projectSchema";
import { FieldErrors } from "react-hook-form";

  // ---------------------------------------------------------------------
  // 1) StepOne: ใส่ข้อมูลโปรเจกต์
  // ---------------------------------------------------------------------
  interface StepOneProps {
    projectName: string;
    setProjectName: (val: string) => void;
    projectDescription: string;
    setProjectDescription: (val: string) => void;
    image?: File; 
    setImage: (file?: File) => void;
    handleFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
    handleDrop: (e: DragEvent<HTMLDivElement>) => void;
    handleDragOver: (e: DragEvent<HTMLDivElement>) => void;
    errors: FieldErrors<CreateProjectFormType>; 
  }
  
  export const StepOne: React.FC<StepOneProps> = ({
    projectName,
    setProjectName,
    projectDescription,
    setProjectDescription,
    image,
    setImage,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    errors,
  }) => {
    return (
        <div className="flex flex-col md:flex-row w-full gap-6 items-stretch mt-8">
        <div className="md:w-2/5 w-full border border-gray-300 rounded-[5px] p-6 flex flex-col">
          <ProjectImageInput
            image={image}
            imagePreview={undefined}
            setImagePreview={() => {}}
            setImage={setImage}
            handleFileSelect={handleFileSelect}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
          />
        </div>
        <div className="md:w-3/5 w-full border border-gray-300 rounded-[5px] p-6 flex flex-col">
          <label className="mt-2 text-black text-2xl font-medium">Project name</label>
          <TextField
            placeholder="Project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            error={Boolean(errors.projectName)} 
            helperText={errors.projectName?.message} 
          />
          <label className="text-black text-2xl font-medium mt-4">Project description</label>
          <TextField
            placeholder="Project description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            error={Boolean(errors.projectDescription)} 
            helperText={errors.projectDescription?.message} 
          />
        </div>
      </div>
  
    );
  };
  // ---------------------------------------------------------------------
  // 2) StepTwo: เลือก AI ที่ต้องการใช้งาน
  // ---------------------------------------------------------------------
  interface StepTwoProps {
    MyApprovedAi: AIDataType[];
    selectedCardId: string | null;
    handleSelectCard: (id: string) => void;
  }
  export const StepTwo: React.FC<StepTwoProps> = ({
    MyApprovedAi,
    selectedCardId,
    handleSelectCard,
  }) => {
    return (
      <div className="px-4">
        <p className="mb-6 text-black text-2xl font-medium text-center sm:text-left">
          เลือก AI ที่ต้องการใช้งาน
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MyApprovedAi.map((data) => (
            <CreateProjectCard
              key={data.aiId}
              id={data.aiId}
              name={data.name}
              aiDesc={data.description}
              tags={data.ai_tag}
              img={getImageUrl(data.imagePath)}
              type={data.ai_type}
              isSelected={data.aiId === selectedCardId}
              onSelect={() => handleSelectCard(data.aiId)}
            />
          ))}
        </div>
      </div>
    );
  };
  // ---------------------------------------------------------------------
  // 3) StepThree: เลือกประเภท Project
  // ---------------------------------------------------------------------
  interface StepThreeProps {
    selectedAI: AIDataType;
    inputType: string;
    setInputType: (val: string) => void;
  }
  
  export const StepThree: React.FC<StepThreeProps> = ({ selectedAI, inputType, setInputType }) => {
    return (
      <div className="mx-auto my-5 w-[30%] h-fit bg-white border rounded-[15px] p-4 shadow-md">
        <img
          className="w-full h-48 object-cover"
          src={getImageUrl(selectedAI.imagePath || "/images/ai/healthAi.webp")}
          alt={selectedAI.name}
        />
        <h1 className="py-2 text-black text-[25px] font-semibold">{selectedAI.name}</h1>
        <span className="mb-2 w-fit bg-sky-500 rounded-[15px] mr-2 px-2.5 py-0.5 text-white text-sm font-normal">
          {selectedAI.ai_type}
        </span>
        <p className="px-4 py-2">{selectedAI.description}</p>
        <div className="mb-4">
          {selectedAI.ai_tag.map((tag, index) => (
            <span
              key={index}
              className="w-fit bg-indigo-600 rounded-[10px] mr-2 px-2.5 py-0.5 text-white text-sm font-normal"
            >
              {tag}
            </span>
          ))}
        </div>
  
        {/* Radio Button */}
        <FormControl>
          <FormLabel id="project-type-label">ประเภท Project</FormLabel>
          <RadioGroup
            row
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
            name="project-type-group">
            
            <FormControlLabel 
              value="รูปภาพและวิดีโอ"
              control={<Radio />} 
              label="รูปภาพ และ วิดีโอ" 
              disabled={selectedAI.inputType !== "รูปภาพและวิดีโอ"} 
            />
            
            <FormControlLabel 
              value="รูปภาพ"
              control={<Radio />} 
              label="รูปภาพ" 
              disabled={selectedAI.inputType === "วิดีโอ"} 
            />
            
            <FormControlLabel 
              value="วิดีโอ"
              control={<Radio />} 
              label="วิดีโอ" 
              disabled={selectedAI.inputType === "รูปภาพ"} 
            />
  
          </RadioGroup>
        </FormControl>
      </div>
    );
  };
  