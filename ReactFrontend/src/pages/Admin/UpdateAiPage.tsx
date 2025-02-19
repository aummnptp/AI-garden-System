import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MiniFooter from '../../components/MiniFooter';
import AdminSidebar from "../../components/AdminSidebar";
import TextResultDisplay from '../../components/aiDisplay/TextResultDisplay';
import ImageDetectionResultDraw from '../../components/aiDisplay/ImageDetectionResultDraw';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle,} from '@mui/material';
import ColorPickerTags from '../../components/ai/ColorPickerTags';
import { AiModelData, ResponseKey } from '../../types/Ai';
import DeleteConfirmationDialog from '../../components/ai/DeleteConfirationAiDialog';
import AiResponseKeys from '../../components/ai/AiResponseKey';
import AiTagInput from '../../components/ai/AiTagInputComponent';
import AiFileUpload from '../../components/ai/AiFileUpload';
import AiBasicInfo from '../../components/ai/AiBasicIfoInput';
import { useAiData } from '../../hook/ai/useAiData';
import SkeletonLayout from '../../components/SkeletonPageLayout';
import { useAiModelMutation } from '../../hook/ai/useAiModelMutation';
import toast from 'react-hot-toast';


const UpdateAiPage: React.FC = () => {
  const { ai_id } = useParams();


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
  const [predictResult, setPredictResult] = useState<{ response_keys: { key: string; meaning: string; displayFormat?: string }[]; prediction: any } | undefined>();
  const [customedImageUrl, setCustomedImageUrl] = useState<string | null>(null);
  const [examplePredictResultModal, setExamplePredictResultModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch AI model data via React Query
  const { aiModelData, isLoadingAiModel } = useAiData();
  const { updateAiModel, deleteAiModel } = useAiModelMutation();

  useEffect(() => {
    if (aiModelData) {
      setAiName(aiModelData.name);
      setDescription(aiModelData.description);
      setServiceUri(aiModelData.api_uri);
      setResponseKeys(aiModelData.response_keys);
      setInputDescription(aiModelData.input_desc);
      setAiType(aiModelData.ai_type);
      setTags(aiModelData.ai_tag);
      setColorSet(aiModelData.colorSet);
      const keys = aiModelData.response_keys.map((item) => item.key);
      setSelectOptions(keys);
      setEnable(aiModelData.enable)
      setVisible(aiModelData.visible)
    }
  }, [aiModelData]);

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
        toast.error("กรุณาใส่ Service URI ก่อน");
        return;
      }
      try {
        const response = await fetch(serviceUri, { method: "POST", body: formData });
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const jsonData = await response.json();
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


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!ai_id) {
      toast.error("AI ID is not defined.");
      return;
    }

    const modelData: AiModelData = {
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
      enable,
      visible,
      colorSet,
    };

    updateAiModel.mutate({
      ai_id,
      modelData,
      uploadedFile,
    });
  };
  
  const handleConfirmDelete = () => {
    if (ai_id) {
      deleteAiModel.mutate(ai_id);
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

  if (isLoadingAiModel) return <SkeletonLayout/>



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
                enable={enable}
                visible={visible}
                onNameChange={setAiName}
                onDescriptionChange={setDescription}
                onServiceUriChange={setServiceUri}
                onTypeChange={setAiType}
                onEnableChange={setEnable}    
                onVisibleChange={setVisible} 
              />
              <ColorPickerTags
              colors={colorSet}
              onChange={(newColors: string[]) => setColorSet(newColors)}
              />
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