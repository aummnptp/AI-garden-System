
import React from 'react';

interface AiBasicInfoProps {
  aiName: string;
  description: string;
  serviceUri: string;
  aiType: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onServiceUriChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

const AiBasicInfo: React.FC<AiBasicInfoProps> = ({
  aiName,
  description,
  aiType,
  onNameChange,
  onDescriptionChange,
  onTypeChange,
}) => {
  return (
    <div className="form-group space-y-4">
      <div>
        <label>AI Name</label>
        <input
          type="text"
          value={aiName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label>AI Description</label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
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
    </div>
  );
};

export default AiBasicInfo;
