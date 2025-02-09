import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MiniFooter from '../../components/MiniFooter';
import AdminSidebar from "../../components/AdminSidebar";
import axios from 'axios';
import TextResultDisplay from '../../components/aiDisplay/TextResultDisplay';
import ImageDetectionResultDraw from '../../components/aiDisplay/ImageDetectionResultDraw';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch } from '@mui/material';
import ColorPickerTags from '../../components/ai/ColorPickerTags';
import { useQuery } from '@tanstack/react-query';
import { AiModelData, ResponseKey } from '../../types/Ai';
import DeleteConfirmationDialog from '../../components/ai/DeleteConfirationAiDialog';
import AiResponseKeys from '../../components/ai/AiResponseKey';
import AiTagInput from '../../components/ai/AiTagInputComponent';
import AiFileUpload from '../../components/ai/AiFileUpload';
import AiBasicInfo from '../../components/ai/AiBasicIfoInput';


const UpdateAiPage: React.FC = () => {
  const { ai_id } = useParams();
  const navigate = useNavigate();

  // State definitions
  const [aiName, setAiName] = useState('');
  const [description, setDescription] = useState('');
  const [serviceUri, setServiceUri] = useState('');
  const [responseKeys, setResponseKeys] = useState<ResponseKey[]>([{ key: '', meaning: '', displayFormat: '' }]);
  const [inputDescription, setInputDescription] = useState('');
  const [aiType, setAiType] = useState('Object Detection');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [enable, setEnable] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(true);
  const [colorSet, setColorSet] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const [selectDisplayOptions, setSelectDisplayOptions] = useState<string[]>([]);
  const [predictResult, setPredictResult] = useState<{ response_keys: { key: string; meaning: string; displayFormat?: string }[]; prediction: any } | undefined>();
  const [customedImageUrl, setCustomedImageUrl] = useState<string | null>(null);
  const [examplePredictResultModal, setExamplePredictResultModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch AI model data via React Query
  const { data, isLoading, error } = useQuery<AiModelData>({
    queryKey: ['ai-model', ai_id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/${ai_id}`,
        { withCredentials: true }
      );
      return response.data;
    },
    enabled: !!ai_id,
  });

  useEffect(() => {
    if (data) {
      setAiName(data.name);
      setDescription(data.description);
      setServiceUri(data.api_uri);
      setResponseKeys(data.response_keys);
      setInputDescription(data.input_desc);
      setAiType(data.ai_type);
      setTags(data.ai_tag);

      const keys = data.response_keys.map((item) => item.key);
      setSelectOptions(keys);
      const displayformats = data.response_keys.map((item) => item.displayFormat);
      setSelectDisplayOptions(displayformats);
      setColorSet(data.colorSet)
      setEnable(data.enable)
      setVisible(data.visible)
    }
  }, [data]);

  useEffect(() => {
    setPredictResult((prev) => ({
      ...prev,
      response_keys: responseKeys,
      prediction: prev?.prediction || {},
    }));
  }, [responseKeys]);
  // Handler for file upload & testing Service URI
  const handleUri = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setUploadedFile(file);
      const formData = new FormData();
      formData.append("file", file);
      if (!serviceUri) {
        alert("กรุณาใส่ Service URI ก่อน");
        return;
      }
      try {
        const response = await fetch(serviceUri, { method: "POST", body: formData });
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const jsonData = await response.json();
          console.log("Response from API:", jsonData);
          setPredictResult({ response_keys: responseKeys, prediction: jsonData });
          setCustomedImageUrl(URL.createObjectURL(file));
          // Extract keys from JSON
          const extractKeys = (obj: any, parentKey = "", depth = 1, maxDepth = 2): string[] => {
            const keys: string[] = [];
            if (depth > maxDepth) return keys;
            Object.keys(obj).forEach((key) => {
              const fullPath = parentKey ? `${parentKey}.${key}` : key;
              if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
                keys.push(fullPath);
                keys.push(...extractKeys(obj[key], fullPath, depth + 1, maxDepth));
              } else if (Array.isArray(obj[key]) && obj[key].length > 0 && typeof obj[key][0] === "object") {
                keys.push(fullPath);
                keys.push(...extractKeys(obj[key][0], fullPath, depth + 1, maxDepth));
              } else {
                keys.push(fullPath);
              }
            });
            return keys;
          };
          const keys = extractKeys(jsonData);
          setSelectOptions(keys);
        } else {
          console.log("Response is not JSON");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      alert("กรุณาเลือกไฟล์ก่อน");
    }
  };

  // Handlers for Response Keys
  const handleAddKey = () => setResponseKeys([...responseKeys, { key: '', meaning: '', displayFormat: '' }]);
  const handleRemoveKey = (index: number) => {
    if (responseKeys.length > 1) {
      const newKeys = [...responseKeys];
      newKeys.splice(index, 1);
      setResponseKeys(newKeys);
    }
  };
  const handleKeyChange = (index: number, field: string, value: string) => {
    const newKeys = [...responseKeys];
    newKeys[index] = { ...newKeys[index], [field]: value };
    setResponseKeys(newKeys);
  };

  // Handlers for Tags
  const handleTagAdd = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };
  const handleTagRemove = (tagToRemove: string) => setTags(tags.filter((tag) => tag !== tagToRemove));

  // Handler for other file changes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadedFile(event.target.files[0]);
    }
  };

  // Delete AI model handler
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/${ai_id}/remove-ai`,
        { withCredentials: true }
      );
      navigate("/admin/admin-ai");
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  // Submit handler for updating AI model
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const modelData = {
      name: aiName,
      description,
      ai_type: aiType,
      api_uri: serviceUri,
      ai_tag: tags,
      input_desc: inputDescription,
      response_keys: responseKeys.map((rk) => ({
        key: rk.key,
        meaning: rk.meaning,
        displayFormat: rk.displayFormat,
      })),
      enable,         // New field: enable (boolean)
      visible,     // New field: visible (boolean)
      colorSet,      // New field: colorSet (array of colors)
    };

    const formData = new FormData();
    if (uploadedFile) formData.append("file", uploadedFile);
    formData.append("modelData", JSON.stringify(modelData));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/${ai_id}/update-ai`,
        { method: "PATCH", body: formData, credentials: "include" }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => { throw new Error(response.statusText); });
        throw new Error(errorData.message || "Something went wrong!");
      }
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Success:", data);
      } else {
        console.log("Success:", await response.text());
      }
      navigate("/admin/admin-ai");
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error || "Failed to update AI model"}`);
    }
  };

  let ai_text_type = null;
  if (predictResult) {
    const searchDrawKey = responseKeys.find(rk =>
      rk.displayFormat === "objectdetection" || rk.displayFormat === "segmentation"
    );
    if (searchDrawKey) {
      ai_text_type = searchDrawKey.displayFormat;
    }
  }

  if (isLoading) return <div>Loading AI data...</div>;
  if (error) return <div>Error loading AI data: {(error as Error).message}</div>;

  console.log(predictResult)
  return (
    <>
      <div className="flex bg-neutral-100 h-full pb-32">
        <AdminSidebar />
        <div className="w-1/5 bg-neutral-200 h-full" />
        <div className="w-4/5 grid grid-cols-1 items-center justify-center h-full">
          <div className="mt-4 pb-5 h-fit w-11/12 bg-white rounded-[15px] mx-auto relative">
            <div className="flex justify-between items-center p-5">
              <h1 className="text-3xl font-medium tracking-tight text-indigo-900">Edit AI</h1>
            </div>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto" />
            <form onSubmit={handleSubmit} className="m-6 space-y-4">
              <AiBasicInfo
                aiName={aiName}
                description={description}
                serviceUri={serviceUri}
                aiType={aiType}
                onNameChange={setAiName}
                onDescriptionChange={setDescription}
                onServiceUriChange={setServiceUri}
                onTypeChange={setAiType}
              />
              <ColorPickerTags
              colors={colorSet}
              onChange={(newColors: string[]) => setColorSet(newColors)}
              />
              <div className="form-group">
                <FormControlLabel
                  control={
                    <Switch
                      checked={enable}
                      onChange={(e) => setEnable(e.target.checked)}
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
                      onChange={(e) => setVisible(e.target.checked)}
                      name="visibilitySwitch"
                      color="primary"
                    />
                  }
                  label="Visibility"
                />
              </div>
              <AiFileUpload
                serviceUri={serviceUri}
                onServiceUriChange={setServiceUri}
                onUriTest={handleUri}
                fileInputRef={fileInputRef}
                customedImageUrl={customedImageUrl}
                predictResult={predictResult}
                onShowPreview={() => setExamplePredictResultModal(true)}
              />
              <AiResponseKeys
                responseKeys={responseKeys}
                selectOptions={selectOptions}
                onAddKey={handleAddKey}
                onRemoveKey={handleRemoveKey}
                onKeyChange={handleKeyChange}
              />
              <AiTagInput
                tags={tags}
                newTag={newTag}
                onTagAdd={handleTagAdd}
                onTagChange={setNewTag}
                onTagRemove={handleTagRemove}
              />
              <div className="form-group">
                <label>AI Input Description (คำอธิบายรูปภาพหรือวิดีโอ)</label>
                <textarea
                  value={inputDescription}
                  onChange={(e) => setInputDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="form-group">
                <label>AI Picture</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="pl-[20%] pr-12 w-full h-[12%] bg-white border border-zinc-300 fixed bottom-0 right-0 flex items-center justify-between">
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  onClick={() => setConfirmDeleteModal(true)}
                  sx={{ mr: 2 }}
                >
                  Remove AI
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#4f46e5', '&:hover': { backgroundColor: '#3730a3' } }}
                  size="large"
                  type="submit"
                  className="p-2 bg-indigo-600 rounded-lg text-white"
                >
                  Save
                </Button>
              </div>
            </form>
            <Dialog
              open={examplePredictResultModal}
              onClose={() => setExamplePredictResultModal(false)}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
              maxWidth="lg"
              fullWidth
            >
              <DialogTitle id="modal-title">ผลลัพธ์การทำนาย</DialogTitle>
              <DialogContent>
                <ImageDetectionResultDraw
                  detections={predictResult?.prediction?.detections || []}
                  InputImage={customedImageUrl!}
                  aiDisplayType={ai_text_type || ''}
                  colorSet={colorSet} 

                />
                {predictResult && <TextResultDisplay predictResult={predictResult} tags={tags} aiName={aiName} ai_type={aiType} />}
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="primary" onClick={() => setExamplePredictResultModal(false)}>
                  ปิด
                </Button>
              </DialogActions>
            </Dialog>
            <DeleteConfirmationDialog
              open={confirmDeleteModal}
              onClose={() => setConfirmDeleteModal(false)}
              onConfirm={handleConfirmDelete}
            />
          </div>
        </div>
      </div>
      <MiniFooter />
    </>
  );
};

export default UpdateAiPage;