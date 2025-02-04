// src/components/ai/AiFileUpload.tsx
import React from 'react';
import { Button } from '@mui/material';

interface AiFileUploadProps {
  serviceUri: string;
  onServiceUriChange: (value: string) => void;
  onUriTest: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  customedImageUrl: string | null;
  predictResult: { response_keys: string[]; prediction: any } | undefined;
  onShowPreview: () => void;
}

const AiFileUpload: React.FC<AiFileUploadProps> = ({
  serviceUri,
  onServiceUriChange,
  onUriTest,
  fileInputRef,
  customedImageUrl,
  predictResult,
  onShowPreview,
}) => {
  return (
    <div className="form-group space-y-4">
      {/* Service URI Input */}
      <label style={{ display: 'block' }}>Service URI</label>
      <input
        type="text"
        value={serviceUri}
        onChange={(e) => onServiceUriChange(e.target.value)}
        className="w-80 p-2 border border-gray-300 rounded-lg"
      />

      {/* Hidden file input */}
      <input
        type="file"
        onChange={onUriTest}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />

      {/* Button to open file selector */}
      <Button
        variant="contained"
        sx={{ backgroundColor: '#4f46e5', '&:hover': { backgroundColor: '#3730a3' } }}
        size="large"
        onClick={() => fileInputRef.current?.click()}
        className="p-2 ml-2 bg-indigo-600 text-white rounded-lg"
      >
        Test URI
      </Button>

      {/* Button to show preview result */}
      {predictResult && customedImageUrl && (
        <Button
          variant="contained"
          sx={{ backgroundColor: '#4f46e5', '&:hover': { backgroundColor: '#3730a3' } }}
          size="large"
          onClick={onShowPreview}
        >
          แสดงตัวอย่างผลลัพธ์
        </Button>
      )}
    </div>
  );
};

export default AiFileUpload;