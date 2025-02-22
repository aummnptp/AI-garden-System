import React, { useEffect, useState } from "react";
import MiniFooter from "../../components/MiniFooter";
import AdminSidebar from "../../components/AdminSidebar";
import ColorPickerTags from "../../components/ai/ColorPickerTags";
import AiFileUpload from "../../components/ai/AiFileUpload";
import AiResponseKeys from "../../components/ai/AiResponseKey";
import AiTagInput from "../../components/ai/AiTagInputComponent";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { AiModelData, ResponseKey } from "../../types/Ai";
import AiBasicInfo from "../../components/ai/AiBasicIfoInput";
import ImageDetectionResultDraw from "../../components/aiDisplay/ImageDetectionResultDraw";
import TextResultDisplay from "../../components/aiDisplay/TextResultDisplay";

import { useAiModelMutation } from "../../hook/ai/useAiModelMutation";
import toast from "react-hot-toast";

const AddAiPage: React.FC = () => {


  // States สำหรับข้อมูล AI Model (เริ่มต้นเป็นค่าว่าง)
  const [aiName, setAiName] = useState("");
  const [description, setDescription] = useState("");
  const [serviceUri, setServiceUri] = useState("");
  const [responseKeys, setResponseKeys] = useState<ResponseKey[]>([
    { key: "", meaning: "", displayFormat: "" },
  ]);
  const [enable, setEnable] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(true);
  const [colorSet, setColorSet] = useState<string[]>(["#00ff00"]);
  const [inputDescription, setInputDescription] = useState("");
  const [aiType, setAiType] = useState("Object Detection");
  const [inputType, setInputType] = useState<string>("รูปภาพ");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const { addAiModel } = useAiModelMutation();
  
  const [predictResult, setPredictResult] = useState<
    | {
        response_keys: {
          key: string;
          meaning: string;
          displayFormat?: string;
        }[];
        prediction: any;
      }
    | undefined
  >();
  const [customedImageUrl, setCustomedImageUrl] = useState<string | null>(null);
  const [examplePredictResultModal, setExamplePredictResultModal] =
    useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
        const response = await fetch(serviceUri, {
          method: "POST",
          body: formData,
        });
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const jsonData = await response.json();
          // Update predictResult state
          const updatedPredictResult = {
            response_keys: responseKeys,
            prediction: jsonData,
          };
          setPredictResult(updatedPredictResult);
          // Set image preview URL
          setCustomedImageUrl(URL.createObjectURL(file));

          // Extract keys from JSON
          const extractKeys = (
            obj: any,
            parentKey = "",
            depth = 1,
            maxDepth = 2
          ): string[] => {
            const keys: string[] = [];
            if (depth > maxDepth) return keys;
            Object.keys(obj).forEach((key) => {
              const fullPath = parentKey ? `${parentKey}.${key}` : key;
              if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
                keys.push(fullPath);
                keys.push(
                  ...extractKeys(obj[key], fullPath, depth + 1, maxDepth)
                );
              } else if (
                Array.isArray(obj[key]) &&
                obj[key].length > 0 &&
                typeof obj[key][0] === "object"
              ) {
                keys.push(fullPath);
                keys.push(
                  ...extractKeys(obj[key][0], fullPath, depth + 1, maxDepth)
                );
              } else {
                keys.push(fullPath);
              }
            });
            return keys;
          };

          const extractedKeys = extractKeys(jsonData);
          setSelectOptions(extractedKeys);
        } else {
        }
      } catch (error) {
    
      }
    } else {
      toast.error("กรุณาเลือกไฟล์ก่อน");
    }
  };

  useEffect(() => {
    setPredictResult((prev) => ({
      ...prev,
      response_keys: responseKeys,
      prediction: prev?.prediction || {},
    }));
  }, [responseKeys]);
  // Handlers สำหรับ Response Keys
  const handleAddKey = () =>
    setResponseKeys([
      ...responseKeys,
      { key: "", meaning: "", displayFormat: "" },
    ]);
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

  // Handlers สำหรับ Tags
  const handleTagAdd = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };
  const handleTagRemove = (tagToRemove: string) =>
    setTags(tags.filter((tag) => tag !== tagToRemove));

  // Handler สำหรับ File input (อื่น ๆ)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadedFile(event.target.files[0]);
    }
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (!uploadedFile) {
      toast.error("กรุณาอัปโหลดรูปภาพก่อน!");
      return;
    }
  const modelData: AiModelData = {
    name: aiName,
    description,
    ai_type: aiType,
    api_uri: serviceUri,
    ai_tag: tags,
    inputType: inputType,
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

  addAiModel.mutate({ modelData, uploadedFile });
};

  // Determine ai_text_type for preview (if any)
  let ai_text_type = null;
  if (predictResult) {
    const searchDrawKey = responseKeys.find(
      (rk) =>
        rk.displayFormat === "objectdetection" ||
        rk.displayFormat === "segmentation"
    );
    if (searchDrawKey) {
      ai_text_type = searchDrawKey.displayFormat;
    }
  }

  return (
    <>
      <div className="flex bg-neutral-100 h-full pb-32">
        <AdminSidebar />
        <div className="w-1/5 bg-neutral-200 h-full" />
        <div className="w-4/5 grid grid-cols-1 items-center justify-center h-full">
          <div className="mt-4 pb-5 h-fit w-11/12 bg-white rounded-[15px] mx-auto relative">
            <div className="flex justify-between items-center p-5">
              <h1 className="text-3xl font-medium tracking-tight text-indigo-900">
                Add AI
              </h1>
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
                inputType={inputType} 
                onNameChange={setAiName}
                onDescriptionChange={setDescription}
                onServiceUriChange={setServiceUri}
                onTypeChange={setAiType}
                onEnableChange={setEnable}    
                onVisibleChange={setVisible} 
                onInputTypeChange={setInputType}

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
              <div className=" pl-[20%] justify-end pr-12 w-full h-[12%]  bg-white border border-zinc-300 fixed bottom-0 right-0 flex items-center">
                <Button
                  variant="contained"
                  style={{ marginRight: "8px" }}
                  sx={{
                    backgroundColor: "#4f46e5",
                    "&:hover": {
                      backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                    },
                  }}
                  size="large"
                  type="submit"
                >
                  Add New AI
                </Button>

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
                      aiDisplayType={ai_text_type || ""}
                      colorSet ={colorSet}
                    />
                    {predictResult && (
                      <TextResultDisplay
                        predictResult={predictResult}
                        tags={tags}
                        aiName={aiName}
                        ai_type={aiType}
                        colorSet ={colorSet}
                      />
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setExamplePredictResultModal(false)}
                    >
                      ปิด
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </form>
          </div>
        </div>
      </div>
      <MiniFooter />
    </>
  );
};

export default AddAiPage;
