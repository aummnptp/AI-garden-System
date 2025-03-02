import React from "react";
import {
  Button,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
} from "@mui/material";
import { ResponseKey } from "../../types/Ai";
import { FieldErrors } from "react-hook-form";
import { AiSchemaType } from "../../validations/aiSchema";

interface AiResponseKeysProps {
  responseKeys: ResponseKey[];
  selectOptions: string[];
  onAddKey: () => void;
  onRemoveKey: (index: number) => void;
  onKeyChange: (index: number, field: string, value: string) => void;
  errors: FieldErrors<AiSchemaType>;
}

const AiResponseKeys: React.FC<AiResponseKeysProps> = ({
  responseKeys,
  selectOptions,
  onAddKey,
  onRemoveKey,
  onKeyChange,
  errors,
}) => {
  return (
    <FormControl fullWidth>
      <FormLabel>Response Data (สำหรับแสดงผลลัพธ์)</FormLabel>
      {errors.responseKeys && (
        <p className="text-red-500 text-sm">{errors.responseKeys.message}</p>
      )}

      {responseKeys.map((key, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          {/* Meaning Input */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Meaning"
            value={key.meaning}
            onChange={(e) => onKeyChange(index, "meaning", e.target.value)}
            error={!!errors.responseKeys?.[index]?.meaning}
            helperText={errors.responseKeys?.[index]?.meaning?.message}
          />

          {/* Select Key */}
          <FormControl fullWidth error={!!errors.responseKeys?.[index]?.key}>
            <InputLabel>Select Key</InputLabel>
            <Select
              value={key.key}
              onChange={(e) => onKeyChange(index, "key", e.target.value)}
            >
              <MenuItem value="">Select Key</MenuItem>
              {selectOptions.map((option, i) => (
                <MenuItem key={i} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {errors.responseKeys?.[index]?.key && (
              <FormHelperText>
                {errors.responseKeys[index]?.key?.message}
              </FormHelperText>
            )}
          </FormControl>

          {/* Select Display Format */}
          <FormControl
            fullWidth
            error={!!errors.responseKeys?.[index]?.displayFormat}
          >
            <InputLabel>Select Display Format</InputLabel>
            <Select
              value={key.displayFormat || ""}
              onChange={(e) =>
                onKeyChange(index, "displayFormat", e.target.value)
              }
            >
              <MenuItem value="">Select Display Format</MenuItem>
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="chart">Chart</MenuItem>
              <MenuItem value="objectdetection">Object Detection</MenuItem>
              <MenuItem value="segmentation">Segmentation</MenuItem>
            </Select>
            {errors.responseKeys?.[index]?.displayFormat && (
              <FormHelperText>
                {errors.responseKeys[index]?.displayFormat?.message}
              </FormHelperText>
            )}
          </FormControl>

          {/* Remove Button */}
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={() => onRemoveKey(index)}
          >
            Remove
          </Button>
        </div>
      ))}

      {/* Add Key Button */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#4f46e5",
          "&:hover": { backgroundColor: "#3730a3" },
        }}
        onClick={onAddKey}
      >
        + Add Key
      </Button>
    </FormControl>
  );
};

export default AiResponseKeys;
