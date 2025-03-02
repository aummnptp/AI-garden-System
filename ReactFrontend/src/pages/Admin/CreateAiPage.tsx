import React, { useEffect, useState, useRef } from "react";
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
  FormControl,
  FormLabel,
  TextField,
} from "@mui/material";
import AiBasicInfo from "../../components/ai/AiBasicIfoInput";
import { useAiModelMutation } from "../../hook/ai/useAiModelMutation";
import toast from "react-hot-toast";
import AIDisPlayResultComponent from "../../components/aiDisplay/AIDisPlayResultComponent";
import { zodResolver } from "@hookform/resolvers/zod";
import { aiSchema, AiSchemaType } from "../../validations/aiSchema";
import { useForm } from "react-hook-form";
import { PredictResult } from "../../types/Ai";
import AiPictureInput from "../../components/input/AiPictureInput";

const AddAiPage: React.FC = () => {
  const { addAiModel } = useAiModelMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newTag, setNewTag] = useState<string>("");
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const [examplePredictResultModal, setExamplePredictResultModal] =
    useState(false);
  const [aiPicturePreview, setAiPicturePreview] = useState<string | null>(null);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AiSchemaType>({
    resolver: zodResolver(aiSchema),
    defaultValues: {
      aiName: "",
      description: "",
      serviceUri: "",
      aiType: "Object Detection",
      inputType: "รูปภาพ",
      tags: [],
      inputDescription: "",
      responseKeys: [{ key: "", meaning: "", displayFormat: "text" }],
      enable: true,
      visible: true,
      colorSet: ["#00ff00"],
      aiPicture: undefined,
      predictResult: undefined,
      customedImageUrl: undefined,
    },
  });
  const aiNameValue = watch("aiName");
  const responseKeysValue = watch("responseKeys");
  const tagsValue = watch("tags");
  const colorSetValue = watch("colorSet");
  const aiTypeValue = watch("aiType");

  useEffect(() => {
    setValue("predictResult", {
      response_keys: responseKeysValue,
      prediction: watch("predictResult")?.prediction || {},
      ai_model: {
        name: aiNameValue,
        ai_tag: tagsValue.join(", "),
        colorSet: colorSetValue,
        ai_type: aiTypeValue,
      },
    });
  }, [responseKeysValue, aiNameValue, tagsValue, colorSetValue, aiTypeValue]);
  // Handler สำหรับอัปโหลดรูป AI Picture
  const handleAiPictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setValue("aiPicture", file); // ใช้ react-hook-form
      setAiPicturePreview(URL.createObjectURL(file)); // อัปเดต preview URL
    }
  };

  const handleUri = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setValue("customedImageUrl", URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("file", file);

      const serviceUri = watch("serviceUri");
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

          setValue("predictResult", {
            response_keys: watch("responseKeys"),
            prediction: jsonData,
            ai_model: {
              name: watch("aiName"),
              ai_tag: watch("tags").join(", "),
              colorSet: watch("colorSet"),
              ai_type: watch("aiType"),
            },
          });
          const extractKeys = (
            obj: any,
            parentKey = "",
            depth = 1,
            maxDepth = 2
          ): string[] => {
            if (depth > maxDepth) return [];
            return Object.keys(obj).flatMap((key) => {
              const fullPath = parentKey ? `${parentKey}.${key}` : key;
              if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
                return [
                  fullPath,
                  ...extractKeys(obj[key], fullPath, depth + 1, maxDepth),
                ];
              } else if (
                Array.isArray(obj[key]) &&
                obj[key].length > 0 &&
                typeof obj[key][0] === "object"
              ) {
                return [
                  fullPath,
                  ...extractKeys(obj[key][0], fullPath, depth + 1, maxDepth),
                ];
              }
              return fullPath;
            });
          };

          setSelectOptions(extractKeys(jsonData));
        } else {
          toast.error("Service URI ไม่ส่ง JSON กลับมา");
        }
      } catch (error) {
        console.error("Error testing API:", error);
        toast.error("เกิดข้อผิดพลาดขณะทดสอบ API");
      }
    } else {
      toast.error("กรุณาเลือกไฟล์ก่อน");
    }
  };

  const onSubmit = (data: AiSchemaType) => {
    const modelData = {
      name: data.aiName,
      description: data.description,
      ai_type: data.aiType,
      api_uri: data.serviceUri,
      ai_tag: data.tags,
      inputType: data.inputType,
      input_desc: data.inputDescription || "",
      response_keys: data.responseKeys,
      enable: data.enable,
      visible: data.visible,
      colorSet: data.colorSet,
    };
    addAiModel.mutate({ modelData, ai_picture: data.aiPicture });
  };

  return (
    <>
      <div className="flex bg-neutral-100 h-full pb-32">
        <AdminSidebar />
        <div className="w-1/5 bg-neutral-200 h-full" />
        <div className="w-4/5 grid grid-cols-1 items-center justify-center h-full">
          <div className="mt-4 pb-5 h-fit w-11/12 bg-white rounded-[15px] mx-auto relative">
            <div className="flex justify-between items-center p-5">
              <h1 className="text-3xl font-medium tracking-tight text-indigo-900">
                Add New AI
              </h1>
            </div>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto" />
            <form onSubmit={handleSubmit(onSubmit)} className="m-6 space-y-4">
              <div className="grid grid-cols-5 gap-2 items-stretch">
                <div className="col-span-2 bg-white p-4 border rounded-[5px] border-gray-300 ">
                  <AiPictureInput
                    image={watch("aiPicture") || undefined}
                    imagePreview={aiPicturePreview}
                    setImage={(file: File | undefined) =>
                      setValue("aiPicture", file)
                    }
                    setImagePreview={setAiPicturePreview}
                    handleFileSelect={handleAiPictureChange}
                    handleDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        setValue("aiPicture", file);
                        setAiPicturePreview(URL.createObjectURL(file));
                      }
                    }}
                    handleDragOver={(e) => e.preventDefault()}
                    errorMessage={errors.aiPicture?.message}
                  />
                </div>

                {/* 60% - AI Basic Info */}
                <div className="col-span-3 bg-white p-6 border rounded-[5px] border-gray-300 ">
                  <AiBasicInfo
                    aiName={watch("aiName")}
                    description={watch("description")}
                    aiType={watch("aiType")}
                    enable={watch("enable")}
                    visible={watch("visible")}
                    inputType={watch("inputType")}
                    onNameChange={(val) => setValue("aiName", val)}
                    onDescriptionChange={(val) => setValue("description", val)}
                    onTypeChange={(val) =>
                      setValue(
                        "aiType",
                        val as
                          | "Object Detection"
                          | "Regression"
                          | "Segmentation"
                          | "Classification"
                      )
                    }
                    onEnableChange={(val) => setValue("enable", val)}
                    onVisibleChange={(val) => setValue("visible", val)}
                    onInputTypeChange={(val) =>
                      setValue(
                        "inputType",
                        val as "รูปภาพและวิดีโอ" | "รูปภาพ" | "วิดีโอ"
                      )
                    }
                    errors={errors}
                  />
                </div>
                
              </div>

              <ColorPickerTags
                colors={watch("colorSet")}
                onChange={(newColors: string[]) =>
                  setValue("colorSet", newColors)
                }
                errors={errors}
              />

              <AiFileUpload
                serviceUri={watch("serviceUri")}
                onServiceUriChange={(val) => setValue("serviceUri", val)}
                onUriTest={handleUri}
                fileInputRef={fileInputRef}
                customedImageUrl={watch("customedImageUrl") ?? null}
                predictResult={
                  watch("predictResult") as PredictResult | undefined
                }
                onShowPreview={() => setExamplePredictResultModal(true)}
                errors={errors}
              />

              <AiResponseKeys
                responseKeys={watch("responseKeys")}
                selectOptions={selectOptions}
                onAddKey={() =>
                  setValue("responseKeys", [
                    ...watch("responseKeys"),
                    { key: "", meaning: "", displayFormat: "text" },
                  ])
                }
                onRemoveKey={(index) => {
                  const newKeys = [...watch("responseKeys")];
                  newKeys.splice(index, 1);
                  setValue("responseKeys", newKeys);
                }}
                onKeyChange={(index, field, value) => {
                  const newKeys = [...watch("responseKeys")];
                  newKeys[index] = { ...newKeys[index], [field]: value };
                  setValue("responseKeys", newKeys);
                }}
                errors={errors}
              />

              <AiTagInput
                tags={watch("tags")}
                newTag={newTag}
                onTagAdd={() => {
                  const currentTags = watch("tags");

                  if (
                    newTag.trim() !== "" &&
                    !currentTags.includes(newTag.trim())
                  ) {
                    setValue("tags", [...currentTags, newTag.trim()]); // เพิ่ม tag
                    setNewTag("");
                  }
                }}
                onTagChange={(val) => setNewTag(val)}
                onTagRemove={(tag) =>
                  setValue(
                    "tags",
                    watch("tags").filter((t) => t !== tag)
                  )
                }
                errors={errors}
              />

              <FormControl fullWidth>
                <FormLabel>AI Input Description (คำอธิบายรูปภาพหรือวิดีโอ)</FormLabel>
                <TextField
                  multiline
                  fullWidth
                  variant="outlined"
                  rows={4} // ตั้งค่าให้มีหลายบรรทัด
                  value={watch("inputDescription")}
                  onChange={(e) => setValue("inputDescription", e.target.value)}
                  error={!!errors.inputDescription}
                  helperText={errors.inputDescription?.message}
                />
              </FormControl>

              <div className="pl-[20%] justify-end pr-12 w-full h-[12%] bg-white border border-zinc-300 fixed bottom-0 right-0 flex items-center">
                <Button
                  variant="contained"
                  style={{ marginRight: "8px" }}
                  sx={{
                    backgroundColor: "#4f46e5",
                    "&:hover": { backgroundColor: "#3730a3" },
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
                    {watch("aiType") === "Regression" ? (
                      <AIDisPlayResultComponent
                        resultImage={""}
                        predictResult={
                          watch("predictResult") as PredictResult | undefined
                        }
                      />
                    ) : (
                      <AIDisPlayResultComponent
                        resultImage={watch("customedImageUrl") ?? ""}
                        predictResult={
                          watch("predictResult") as PredictResult | undefined
                        }
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
