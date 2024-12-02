import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MiniFooter from '../components/MiniFooter';
import AdminSidebar from "../components/AdminSidebar";

const CreateAiProjectPage = () => {
  const [aiName, setAiName] = useState('');
  const [description, setDescription] = useState('');
  const [serviceUri, setServiceUri] = useState('');
  const [responseKeys, setResponseKeys] = useState([{ key: '', meaning: '', displayFormat: '' }]);
  const [inputDescription, setInputDescription] = useState('');
  const [aiType, setAiType] = useState('Object Detection');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [regressionParams, setRegressionParams] = useState([{ param: '' }]);
  const [selectOptions, setSelectOptions] = useState<string[]>([]);

  const navigate = useNavigate();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
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

          // ดึงคีย์จากข้อมูลที่ได้จาก API
          const keys = Object.keys(data);
          setSelectOptions(keys); // เก็บคีย์ใน state เพื่อแสดงใน <select>
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


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const modelData = {
      name: aiName,
      description: description,
      ai_type: aiType,
      api_uri: serviceUri,
      response_keys: responseKeys.map(key => ({ key: key.key, meaning: key.meaning })), // ส่งทั้ง key และ meaning
      regression_params: regressionParams.map(param => param.param)
    };

    fetch('http://localhost:5000/add_model', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modelData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        navigate('/admin/admin-ai'); // Navigate back to admin page after submission
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

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
                เพิ่มโปรเจค AI
              </h1>
            </div>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>
            <form onSubmit={handleSubmit} className="m-6 space-y-4">
              <div className="form-group">
                <label>ชื่อ AI</label>
                <input
                  type="text"
                  value={aiName}
                  onChange={(e) => setAiName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="form-group">
                <label>คำอธิบาย</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="form-group">
                <label>ประเภท AI</label>
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
                <label style={{ display: 'block' }}>Service URI</label>
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
                  style={{ display: 'none' }}
                  className="w-30 p-2 ml-2 text-white bg-indigo-600 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()} // เปิดหน้าต่างเลือกไฟล์เมื่อคลิกปุ่ม
                  className="p-2 ml-2 bg-indigo-600 text-white rounded-lg"
                >
                  ทดสอบ Uri
                </button>

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
                      onChange={(e) => handleKeyChange(index, 'meaning', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <select
                      value={key.key}
                      onChange={(e) => handleKeyChange(index, 'key', e.target.value)}
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
                      value={key.displayFormat || ''}
                      onChange={(e) => handleKeyChange(index, 'displayFormat', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select Display Format</option>
                      <option value="Text">Text</option>
                      <option value="Chart">Chart</option>
                      <option value="Boundy_Box">Boundy Box</option>
                      {/* <option value="Segment">Segment</option> */}
                    </select>

                    {responseKeys.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveKey(index)}
                        className="p-2 bg-red-600 text-white rounded-lg"
                      >
                        ลบ
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={handleAddKey} className="p-2  text-white bg-indigo-600 rounded-lg">
                  + Add Key
                </button>
              </div>
              <div style={{ display: 'none' }}>
                <label >Regression Parameters (สำหรับพล็อตกราฟ)</label>
                {regressionParams.map((param, index) => (
                  <div key={index} className="response-param flex space-x-2 mb-2">
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
                <button type="button" onClick={handleAddRegressionParam} className="p-2  text-white bg-indigo-600 rounded-lg">
                  + Add Parameter
                </button>
              </div>

              <div className="form-group">
                <label>คำอธิบาย Input ของ AI</label>
                <textarea
                  value={inputDescription}
                  onChange={(e) => setInputDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="form-group">
                <label>Tag ของโปรเจค</label>
                <div className="tags-input space-y-2">
                  {tags.map((tag, index) => (
                    <span key={index} className="tag my-1 text-white bg-indigo-600 p-1.5 rounded-lg inline-flex items-center">
                      {tag}
                      <button type="button" onClick={() => handleTagRemove(tag)} className="ml-2 text-white text-xl ">
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
                    <button type="button" onClick={handleTagAdd} className="w-[10%] p-2 bg-indigo-600 rounded-lg text-white">
                      + Add Tag
                    </button>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>อัปโหลดไฟล์ภาพที่นี่</label>
                <input type="file" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded-lg" />
              </div>
              <button type="submit" className="p-2 bg-indigo-600 rounded-lg text-white">
                บันทึก
              </button>
            </form>
          </div>
        </div>
      </div>
      <MiniFooter />
    </>
  );
};

export default CreateAiProjectPage;
