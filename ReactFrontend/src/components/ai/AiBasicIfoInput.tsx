import { FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, Switch, TextField } from '@mui/material';
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
      <FormControl fullWidth>
  <FormLabel>AI Name</FormLabel>
  <TextField
    fullWidth
    variant="outlined"
    type="text"
    margin="normal"
    value={aiName}
    onChange={(e) => onNameChange(e.target.value)}
    error={!!errors.aiName}
    helperText={errors.aiName?.message}
  />
</FormControl>

<FormControl fullWidth>
  <FormLabel>AI Description</FormLabel>
  <TextField
    multiline
    fullWidth
    variant="outlined"
    margin="normal"
    value={description}
    onChange={(e) => onDescriptionChange(e.target.value)}
    error={!!errors.description}
    helperText={errors.description?.message}
  />
</FormControl>
      

      {/* AI Type */}
            <div>
        <FormControl fullWidth>
        <FormLabel component="legend">AI Input Type</FormLabel>
        <Select
         
            labelId="ai-type-label"
            value={aiType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full"
          >
            <MenuItem value="Object Detection">Object Detection</MenuItem>
            <MenuItem value="Regression">Regression</MenuItem>
            <MenuItem value="Segmentation">Segmentation</MenuItem>
            <MenuItem value="Classification">Classification</MenuItem>
          </Select>
        </FormControl>
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
