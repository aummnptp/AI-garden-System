import React from 'react';
import { Button, FormControl, FormLabel, TextField, CircularProgress } from '@mui/material';
import { AiSchemaType } from '../../validations/aiSchema';
import { FieldErrors } from 'react-hook-form';

interface AiFileUploadProps {
  serviceUri: string;
  onServiceUriChange: (value: string) => void;
  onUriTest: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  customedImageUrl: string | null;
  predictResult: { response_keys: { key: string; meaning: string; displayFormat?: string }[]; prediction: any } | undefined;
  onShowPreview: () => void;
  errors: FieldErrors<AiSchemaType>;
  isPredicting: boolean; // ✅ เพิ่มตัวแปร isPredicting เพื่อตรวจสอบการโหลด
}

const AiFileUpload: React.FC<AiFileUploadProps> = ({
  serviceUri,
  onServiceUriChange,
  onUriTest,
  fileInputRef,
  customedImageUrl,
  predictResult,
  onShowPreview,
  errors,
  isPredicting, // ✅ ใช้ตัวแปร isPredicting
}) => {
  return (
    <div className="form-group space-y-4">
      {/* Service URI Input */}
      <FormControl fullWidth>
        <FormLabel>Service URI</FormLabel>
        <TextField
          fullWidth
          variant="outlined"
          type="text"
          value={serviceUri}
          onChange={(e) => onServiceUriChange(e.target.value)}
          error={!!errors.serviceUri}
          helperText={errors.serviceUri?.message}
        />
      </FormControl>

      {/* File Upload */}
      <input
        type="file"
        onChange={onUriTest}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      {/* Test URI Button */}
      <Button
        variant="contained"
        sx={{ backgroundColor: "#4f46e5", "&:hover": { backgroundColor: "#3730a3" } }}
        onClick={() => fileInputRef.current?.click()}
        disabled={isPredicting} // ✅ ปิดปุ่มขณะรอ Response
      >
        {isPredicting ? <CircularProgress size={24} color="inherit" /> : "Test URI"}
      </Button>

      {/* ✅ ปุ่ม "Show Preview" จะแสดงเมื่อ API ตอบกลับแล้ว */}
      {!isPredicting && predictResult && customedImageUrl && (
        <Button
          variant="contained"
          sx={{ backgroundColor: "#4f46e5", "&:hover": { backgroundColor: "#3730a3" } }}
          onClick={onShowPreview}
        >
          Show Preview
        </Button>
      )}
    </div>
  );
};

export default AiFileUpload;
