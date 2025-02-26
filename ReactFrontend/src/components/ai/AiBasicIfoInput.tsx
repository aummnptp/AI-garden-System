import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch } from '@mui/material';
import React from 'react';
import { FieldErrors } from "react-hook-form";
import { AiSchemaType } from "../../validations/aiSchema";

interface AiBasicInfoProps {
  aiName: string;
  description: string;
  aiType: string;
  enable: boolean;
  visible: boolean;
  inputType: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onEnableChange: (value: boolean) => void;
  onVisibleChange: (value: boolean) => void;
  onInputTypeChange: (value: string) => void;
  errors: FieldErrors<AiSchemaType>; 
}

const AiBasicInfo: React.FC<AiBasicInfoProps> = ({
  aiName,
  description,
  aiType,
  enable,
  visible,
  inputType,
  onNameChange,
  onDescriptionChange,
  onTypeChange,
  onInputTypeChange,
  onEnableChange,
  onVisibleChange,
  errors,  
}) => {
  return (
    <div className="form-group space-y-4">
      {/* AI Name */}
      <div>
        <label>AI Name</label>
        <input
          type="text"
          value={aiName}
          onChange={(e) => onNameChange(e.target.value)}
          className={`w-full p-2 border rounded-lg ${errors.aiName ? "border-red-500" : "border-gray-300"}`}
          aria-invalid={errors.aiName ? "true" : "false"}
        />
        {errors.aiName && <p className="text-red-500 text-sm">{errors.aiName.message}</p>}
      </div>

      {/* AI Description */}
      <div>
        <label>AI Description</label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className={`w-full p-2 border rounded-lg ${errors.description ? "border-red-500" : "border-gray-300"}`}
          aria-invalid={errors.description ? "true" : "false"}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      

      {/* AI Type */}
      <div>
        <label>AI Type</label>
        <select
          value={aiType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="Object Detection">Object Detection</option>
          <option value="Regression">Regression</option>
          <option value="Segmentation">Segmentation</option>
          <option value="Classification">Classification</option>
        </select>
      </div>

      {/* AI Input Type */}
      <FormControl component="fieldset">
        <FormLabel component="legend">AI Input Type</FormLabel>
        <RadioGroup
          row
          value={inputType}
          onChange={(e) => onInputTypeChange(e.target.value)}
        >
          <FormControlLabel value="รูปภาพและวิดีโอ" control={<Radio />} label="รูปภาพและวิดีโอ" />
          <FormControlLabel value="รูปภาพ" control={<Radio />} label="รูปภาพ" />
          <FormControlLabel value="วิดีโอ" control={<Radio />} label="วิดีโอ" />
        </RadioGroup>
      </FormControl>

      {/* Enable & Visibility Switches */}
      <div className="flex items-center space-x-4">
        <FormControlLabel
          control={
            <Switch
              checked={enable}
              onChange={(e) => onEnableChange(e.target.checked)}
              name="enableSwitch"
              color="primary"
            />
          }
          label="Enable"
        />
        <FormControlLabel
          control={
            <Switch
              checked={visible}
              onChange={(e) => onVisibleChange(e.target.checked)}
              name="visibilitySwitch"
              color="primary"
              disabled={!enable}
            />
          }
          label="Visible"
        />
      </div>
    </div>
  );
};

export default AiBasicInfo;
