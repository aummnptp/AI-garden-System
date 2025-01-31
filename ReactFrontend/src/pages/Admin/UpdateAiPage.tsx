import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MiniFooter from '../../components/MiniFooter';
import AdminSidebar from "../../components/AdminSidebar";
import axios from 'axios';
import TextResultDisplay from '../../components/aiDisplay/TextResultDisplay';
import ImageDetectionResultDraw from '../../components/aiDisplay/ImageDetectionResultDraw';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Modal, Typography } from '@mui/material';



interface PredictResult {
  ai_type: string;
  prediction: { [key: string]: any };
  response_keys?: { key: string; meaning: string; displayFormat: string }[];
}
interface ResponseKey {
  key: string;
  meaning: string;
  displayFormat: string;
}
const UpdateAiPage = () => {
  let { ai_id } = useParams();

  const [aiName, setAiName] = useState('');
  const [description, setDescription] = useState('');
  const [serviceUri, setServiceUri] = useState('');
  const [responseKeys, setResponseKeys] = useState<ResponseKey[]>([{ key: '', meaning: '', displayFormat: '' }]);  const [inputDescription, setInputDescription] = useState('');
  const [aiType, setAiType] = useState('Object Detection');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [regressionParams, setRegressionParams] = useState([{ param: '' }]);
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const [selectDisplayOptions, setselectDisplayOptions] = useState<string[]>([]);
  const [predictResult, setPredictResult] = useState<{response_keys:string[],prediction:{}}>();
  const [examplePredictResultModal, setExamplePredictResultModal] = useState(false);
  const [customedImageUrl, setCustomedImageUrl] = useState<string | null>(null); // URL ของรูปที่กำลังแสดง
  const [confirmDeleteModal, setConfirmDeleteModal] = React.useState(false);

  const navigate = useNavigate();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  


  
const fetchAi = () => {
  axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/${ai_id}`,{
    withCredentials: true,
},)
    .then(response => {
      setAiName(response.data.name);
      setDescription(response.data.description);
      setServiceUri(response.data.api_uri);
      setResponseKeys(response.data.response_keys);
      setInputDescription(response.data.input_desc);
      setAiType(response.data.ai_type);
      setTags(response.data.ai_tag);

      // กำหนดประเภทให้ `item` ใน map
      const keys = response.data.response_keys.map((item: { key: string }) => item.key);
      setSelectOptions(keys);
      const displayformats = response.data.response_keys.map((item: { displayFormat: string }) => item.displayFormat);
      setselectDisplayOptions(displayformats);
    })
    .catch(error => {
      console.error("There was an error fetching the AI data!", error);
    });
};

  useEffect(() => {
    fetchAi(); // ดึงข้อมูล workspace เมื่อ component โหลดครั้งแรก
  }, []);

  useEffect(() => {
    const responseKeysArray = responseKeys.map((keyObj) => keyObj);
    setPredictResult((prev) => ({ ...prev, response_keys: responseKeysArray }));
  }, [responseKeys]);
  
  const handleUri = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        setUploadedFile(file);
    

        const formData = new FormData();
        formData.append('file', file);

        try {
            if (!serviceUri) {
                alert('กรุณาใส่ Service URI ก่อน');
                return;
            }

            const response = await fetch(serviceUri, {
                method: 'POST',
                body: formData,
            });

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log('Response from API:', data);
                
             
                // const responseKeysArray = responseKeys.map((keyObj) => keyObj.key);
                setPredictResult({ response_keys: responseKeys, prediction: data });

                  setCustomedImageUrl(URL.createObjectURL(file));
       
                // ตั้งค่า URL รูปที่แสดงผลจาก API
           
                // ฟังก์ชันดึง keys จาก JSON (ระดับ 1 และ 2)
                const extractKeys = (obj: any, parentKey = '', depth = 1, maxDepth = 2) => {
                  const keys: string[] = [];
                  if (depth > maxDepth) return keys;
              
                  Object.keys(obj).forEach((key) => {
                      const fullPath = parentKey ? `${parentKey}.${key}` : key;
              
                      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                          // Object, add the current key and recurse if within maxDepth
                          keys.push(fullPath);
                          keys.push(...extractKeys(obj[key], fullPath, depth + 1, maxDepth));
                      } else if (Array.isArray(obj[key]) && obj[key].length > 0 && typeof obj[key][0] === 'object') {
                          // Array of objects, add the array key itself and recurse if within maxDepth
                          keys.push(fullPath);
                          keys.push(...extractKeys(obj[key][0], fullPath, depth + 1, maxDepth));
                      } else {
                          // Base case or array of primitives, just add the key
                          keys.push(fullPath);
                      }
                  });
              
                  return keys;
                  
              };
              

                // ดึง keys ทั้งหมดที่ต้องการ
                const keys = extractKeys(data);
                setSelectOptions(keys); // อัปเดต select options
                // setResponseKeys(keys.map((key) => ({ key, meaning: '', displayFormat: '' }))); // 
            } else {
                console.log('Response is not JSON');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    } else {
        alert('กรุณาเลือกไฟล์ก่อน');
    }
};

  
  
  
  

  const handleAddKey = () => {
    setResponseKeys([...responseKeys, { key: '', meaning: '', displayFormat: '' }]);
  };

  const handleRemoveKey = (index: number) => {
    if (responseKeys.length > 1) {
      const newKeys = [...responseKeys];
      newKeys.splice(index, 1); // ลบ key ที่ index นั้นออก
      setResponseKeys(newKeys);
    }
  };

  const handleKeyChange = (index: number, field: string, value: string) => {
    const newKeys = [...responseKeys];
    newKeys[index] = { ...newKeys[index], [field]: value };
    setResponseKeys(newKeys);

  };

  const handleAddRegressionParam = () => {
    setRegressionParams([...regressionParams, { param: '' }]);
  };

  const handleRemoveParam = (index: number) => {
    if (regressionParams.length > 1) {
      const newParams = [...regressionParams];
      newParams.splice(index, 1); // ลบ parameter ที่ index นั้นออก
      setRegressionParams(newParams);
    }
  };

  const handleParamChange = (index: number, value: string) => {
    const newParams = [...regressionParams];
    newParams[index].param = value;
    setRegressionParams(newParams);
  };

  const handleTagAdd = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadedFile(event.target.files[0]);
    }
  };


  const handleConfirmDelete = async () => {
    try {
      await deleteAiModel(); // เรียกฟังก์ชันลบ AI
      setConfirmDeleteModal(false); // ปิด Modal หลังจากลบสำเร็จ
      // คุณสามารถเพิ่ม logic เช่น redirect หรือ refresh หน้าได้ที่นี่
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  const deleteAiModel = async () => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/${ai_id}/remove-ai`,{
          withCredentials: true,
      });
      console.log('AI model deleted successfully:', response.data);
      navigate('/admin/admin-ai');
      // Handle successful deletion, e.g., update state or show a success message
    } catch (error) {
      console.error('There was an error deleting the AI model!', error);
      // Handle error, e.g., show an error message
    }
  };


  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const modelData = {
  //     name: aiName,
  //     description: description,
  //     ai_type: aiType,
  //     api_uri: serviceUri,
  //     ai_tag: tags,
  //     input_desc: inputDescription,
  //     response_keys: responseKeys.map((key) => ({
  //       key: key.key,
  //       meaning: key.meaning,
  //       displayFormat: key.displayFormat,
  //     })),
  //   };
  
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/${ai_id}/update-ai`,
  //       {
  //         method: 'PATCH',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(modelData),
  //         credentials: 'include',
  //       }
  //     );
  
  //     if (!response.ok) {
  //       // ตรวจสอบว่าสถานะไม่ใช่ 2xx
  //       const errorData = await response.json().catch(() => {
  //         throw new Error(response.statusText); // ใช้ข้อความสถานะหากไม่มี JSON
  //       });
  //       throw new Error(errorData.message || 'Something went wrong!');
  //     }
  
  //     // ตรวจสอบ Content-Type ก่อนแปลง JSON
  //     const contentType = response.headers.get('Content-Type');
  //     if (contentType && contentType.includes('application/json')) {
  //       const data = await response.json();
  //       console.log('Success:', data);
  //     } else {
  //       console.log('Success:', await response.text()); // แสดงข้อความ plain text
  //     }
  
  //     navigate('/admin/admin-ai'); // Navigate back to admin page after submission
  //   } catch (error) {
  //     console.error('Error:', error || error);
  //     alert(`Error: ${error|| 'Failed to update AI model'}`);
  //   }
  // };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const modelData = {
    name: aiName,
    description: description,
    ai_type: aiType,
    api_uri: serviceUri,
    ai_tag: tags,  // tags ที่ผู้ใช้กรอก
    input_desc: inputDescription,
    response_keys: responseKeys.map((key) => ({
      key: key.key,
      meaning: key.meaning,
      displayFormat: key.displayFormat,
    })),
  };

  const formData = new FormData();
  if (uploadedFile) {
    formData.append('file', uploadedFile);  // ไฟล์ที่เลือก
  }
  formData.append('modelData', JSON.stringify(modelData));  // ข้อมูลอื่นๆ

  try {
    const response = await fetch(
      `${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/${ai_id}/update-ai`,
      {
        method: 'PATCH',
        headers: {
          // ไม่มีการตั้ง Content-Type เพราะ FormData จะจัดการเอง
        },
        body: formData,
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => {
        throw new Error(response.statusText);
      });
      throw new Error(errorData.message || 'Something went wrong!');
    }

    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Success:', data);
    } else {
      console.log('Success:', await response.text());
    }

    navigate('/admin/admin-ai');
  } catch (error) {
    console.error('Error:', error || error);
    alert(`Error: ${error || 'Failed to update AI model'}`);
  }
};


  // แก้
  let PredictDrawData = null;
  let ai_text_type = null;
  
  // ถ้าตีย์มี displayFormat data ให้ PredictDrawData = display format data ตัวนั้น
  if (predictResult) {
    const searchDrawKey = responseKeys.find(
      (responseKey) =>
        responseKey.displayFormat === "objectdetection" || 
        responseKey.displayFormat === "segmentation"
    );
  
    if (searchDrawKey) {
      // กำหนด `ai_text_type` จาก `displayFormat`
      ai_text_type = searchDrawKey.displayFormat;
      
      // แยก key ออกเป็นส่วนย่อย (เช่น detections.position)
      const keyParts = searchDrawKey.key.split(".");
      let data = predictResult.prediction;
      
      // เดินทางไปตาม key เพื่อดึงค่าจาก prediction
      for (const part of keyParts) {
        data = data?.[part];
        if (!data) break;
      }
      
      // กำหนดค่าให้ PredictDrawData
      PredictDrawData = data;
    }
  }



  return (
    <>
      <div className="flex bg-neutral-100 h-full pb-32">
        {/* Sidebar placeholder */}
        <AdminSidebar></AdminSidebar>
        <div className="w-1/5 bg-neutral-200 h-full"></div>

        {/* Main content */}
        <div className="w-4/5 items-center justify-center h-full grid grid-cols-1">
          {/* Top card (create sort workspace name) */}
          <div className="mt-4 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">
            <div className="flex justify-between items-center p-5">
              <h1 className="text-3xl font-medium tracking-tight text-indigo-900 ">
                Edit AI
              </h1>

          
            </div>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>
            <form onSubmit={handleSubmit} className="m-6 space-y-4">
              <div className="form-group">
                <label>AI name</label>
                <input
                  type="text"
                  value={aiName}
                  onChange={(e) => setAiName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="form-group">
                <label>AI description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="form-group">
                <label>AI type</label>
                <select
                  value={aiType}
                  onChange={(e) => setAiType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="Object Detection">Object Detection</option>
                  <option value="Regression">Regression</option>
                  <option value="Segmentation">Segmentation</option>
                  <option value="Classification">Classification</option>
                </select>
              </div>
              <div className="form-group">
                <label style={{ display: "block" }}>Service URI</label>
                <input
                  type="text"
                  value={serviceUri}
                  onChange={(e) => setServiceUri(e.target.value)}
                  className="w-80 p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="file"
                  onChange={handleUri}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  className="w-30 p-2 ml-2 text-white bg-indigo-600 rounded-lg"
                />
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
                  onClick={() => fileInputRef.current?.click()} // เปิดหน้าต่างเลือกไฟล์เมื่อคลิกปุ่ม
                  className="p-2 ml-2 bg-indigo-600 text-white rounded-lg"
                >
                  Test URI
                </Button>
                {predictResult && customedImageUrl && (
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
                    onClick={() => {
                      setExamplePredictResultModal(true);
                      setPredictResult({
                        response_keys: responseKeys.map(key => key.key),
                        prediction: data,
                      });
                    }}
                  >
                    แสดงตัวอย่างผลลัพธ์
                  </Button>
                )}
                {/* <Modal open={examplePredictResultModal} 
                 onClose={() => setExamplePredictResultModal(false)} aria-labelledby="modal-title" aria-describedby="modal-description" >  */}
                {predictResult && customedImageUrl && (
                  <div className="">
                    {/* <pre>
                    {JSON.stringify(predictResult?.response_keys, null, 2)}
                  </pre> */}
                    <Dialog
                      open={examplePredictResultModal}
                      onClose={() => setExamplePredictResultModal(false)}
                      aria-labelledby="modal-title"
                      aria-describedby="modal-description"
                      maxWidth="lg"
                      fullWidth
                    >
                      <DialogTitle id="modal-title">
                        ผลลัพธ์การทำนาย
                      </DialogTitle>
                      <DialogContent>
                        <ImageDetectionResultDraw
                          detections={predictResult.prediction.detections || []}
                          InputImage={customedImageUrl}
                          aiDisplayType={ai_text_type}
                        />
                        <TextResultDisplay
                          predictResult={predictResult}
                          tags={["tag1", "tag2", "tag3"]}
                        />
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
                )}
                {/* </Modal>  */}
              </div>

              <div className="form-group">
                <label>Response Data (สำหรับแสดงผลลัพธ์)</label>

                {responseKeys.map((key, index) => (
                  <div key={index} className="response-key flex space-x-2 mb-2">
                    {/* ช่อง select สำหรับความหมาย (meaning) */}
                    <input
                      type="text"
                      placeholder="meaning"
                      value={key.meaning}
                      onChange={(e) =>
                        handleKeyChange(index, "meaning", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <select
                      value={key.key}
                      onChange={(e) =>
                        handleKeyChange(index, "key", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select Key</option>
                      {selectOptions.map((option, i) => (
                        <option key={i} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    {/* Select สำหรับ Display Format */}
                    <select
                      value={key.displayFormat || ""}
                      onChange={(e) =>
                        handleKeyChange(index, "displayFormat", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select Display Format</option>
                      <option value="text">Text</option>
                      <option value="chart">Chart</option>
                      <option value="objectdetection">Object Detection</option>
                      <option value="segmentation">Segmentation</option>
                    </select>

                    {/* {responseKeys.length > 1 && ( */}
                    <Button
                      variant="contained"
                      style={{ marginRight: "8px" }}
                      color="error"
                      size="large"
                      onClick={() => handleRemoveKey(index)}
                      className="p-2 bg-red-600 text-white rounded-lg"
                    >
                    remove
                    </Button>
                    {/* )} */}
                  </div>
                ))}
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
                  onClick={handleAddKey}
                  className="p-2  text-white bg-indigo-600 rounded-lg"
                >
                  + Add Key
                </Button>
              </div>
              <div style={{ display: "none" }}>
                <label>Regression Parameters (สำหรับพล็อตกราฟ)</label>
                {regressionParams.map((param, index) => (
                  <div
                    key={index}
                    className="response-param flex space-x-2 mb-2"
                  >
                    <input
                      type="text"
                      placeholder="Parameter"
                      value={param.param}
                      onChange={(e) => handleParamChange(index, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    {regressionParams.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveParam(index)}
                        className="p-2 bg-red-600 text-white rounded-lg"
                      >
                        ลบ
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddRegressionParam}
                  className="p-2  text-white bg-indigo-600 rounded-lg"
                >
                  + Add Parameter
                </button>
              </div>

              <div className="form-group">
              <label>AI input description (คำอธิบายรูปภาพหรือวิดีโอที่ AI นำไปวิเคราะห์)</label>
              <textarea
                  value={inputDescription}
                  onChange={(e) => setInputDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="form-group">
                <label>AI tag </label>
                <div className="tags-input space-y-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="tag my-1 text-white bg-indigo-600 p-1.5 inline-flex items-center  rounded-[20px] px-4 "
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="ml-2 text-white text-xl "
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <Button
                      variant="contained"
                      style={{ marginRight: "8px" }}
                      sx={{
                        backgroundColor: "#4f46e5",
                        "&:hover": {
                          backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                        },
                      }}
                      size="small"
                      onClick={handleTagAdd}
                      className="w-[10%] p-2 bg-indigo-600 rounded-lg text-white"
                    >
                      + Add Tag
                    </Button>
                  </div>
                </div>
              </div>
              <div className="form-group">
              <label>AI Picture</label>
              <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className=" pl-[20%] justify-between pr-12 w-full h-[12%]  bg-white border border-zinc-300 fixed bottom-0 right-0 flex items-center">

              <Button
                variant="contained"
                color="error"
                size="large"
                onClick={() => setConfirmDeleteModal(true)} // เปิด Modal
                style={{ marginRight: "8px" }}
              >
                Remove AI
              </Button>

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
                className="p-2 bg-indigo-600 rounded-lg text-white"
              >
                Save
              </Button>
              </div>
            </form>

            <Dialog
              open={confirmDeleteModal}
              onClose={() => setConfirmDeleteModal(false)}
              aria-labelledby="confirm-delete-title"
              aria-describedby="confirm-delete-description"
            >
               <DialogTitle
                         id="alert-dialog-title"
                         sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
                       >
                         Confirm Deletion
                       </DialogTitle>
              <DialogContent>
                Are you sure you want to delete this AI model?
              </DialogContent>
              <DialogActions>
                <Button
                 variant="outlined"
                  onClick={() => setConfirmDeleteModal(false)}
                  color="primary"
                >
                  Cancel
                </Button>
                <Button
                 variant="contained"
                 color="error"
                onClick={handleConfirmDelete} >
                  Remove AI
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
      <MiniFooter />
    </>
  );
};

export default UpdateAiPage;
