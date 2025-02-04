
import React from 'react';
import { Button } from '@mui/material';
import { ResponseKey } from '../../types/Ai';

interface AiResponseKeysProps {
  responseKeys: ResponseKey[];
  selectOptions: string[];
  onAddKey: () => void;
  onRemoveKey: (index: number) => void;
  onKeyChange: (index: number, field: string, value: string) => void;
}

const AiResponseKeys: React.FC<AiResponseKeysProps> = ({
  responseKeys,
  selectOptions,
  onAddKey,
  onRemoveKey,
  onKeyChange,
}) => {
  return (
    <div className="form-group space-y-4">
      <label>Response Data (สำหรับแสดงผลลัพธ์)</label>
      {responseKeys.map((key, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          <input
            type="text"
            placeholder="Meaning"
            value={key.meaning}
            onChange={(e) => onKeyChange(index, 'meaning', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <select
            value={key.key}
            onChange={(e) => onKeyChange(index, 'key', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Key</option>
            {selectOptions.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={key.displayFormat || ''}
            onChange={(e) => onKeyChange(index, 'displayFormat', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Display Format</option>
            <option value="text">Text</option>
            <option value="chart">Chart</option>
            <option value="objectdetection">Object Detection</option>
            <option value="segmentation">Segmentation</option>
          </select>
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={() => onRemoveKey(index)}
            className="p-2 bg-red-600 text-white rounded-lg"
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        variant="contained"
        sx={{ backgroundColor: '#4f46e5', '&:hover': { backgroundColor: '#3730a3' } }}
        size="large"
        onClick={onAddKey}
        className="p-2 text-white bg-indigo-600 rounded-lg"
      >
        + Add Key
      </Button>
    </div>
  );
};

export default AiResponseKeys;