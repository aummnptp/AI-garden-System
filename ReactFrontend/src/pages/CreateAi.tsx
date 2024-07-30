import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MiniFooter from '../components/MiniFooter';

const CreateAiProject = () => {
  const [aiName, setAiName] = useState('');
  const [description, setDescription] = useState('');
  const [serviceUri, setServiceUri] = useState('');
  const [responseKeys, setResponseKeys] = useState([{ key: '', type: '' }]);
  const [inputDescription, setInputDescription] = useState('');
  const [aiType, setAiType] = useState('Object Detection');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);


  const navigate = useNavigate();

  const handleAddKey = () => {
    setResponseKeys([...responseKeys, { key: '', type: '' }]);
  };

  const handleKeyChange = (index: number, field: string, value: string) => {
    const newKeys = [...responseKeys];
    newKeys[index] = { ...newKeys[index], [field]: value };
    setResponseKeys(newKeys);
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
      api_uri: serviceUri,
      response_keys: responseKeys.map(key => key.key),
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
        navigate('/admin'); // Navigate back to admin page after submission
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <>
      <div className="flex bg-neutral-100 h-full pb-32">
        {/* Sidebar placeholder */}
        <div className="w-1/5 bg-neutral-200 h-full"></div>

        {/* Main content */}
        <div className="w-4/5 items-center justify-center h-full grid grid-cols-1">
          {/* Top card (create sort workspace name) */}
          <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">
            <div className="flex justify-between items-center p-5">
              <h1 className="text-3xl font-medium tracking-tight text-indigo-900 dark:text-black">
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
                </select>
              </div>
              <div className="form-group">
                <label>Service URI</label>
                <input
                  type="text"
                  value={serviceUri}
                  onChange={(e) => setServiceUri(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="form-group">
                <label>Response Data</label>
                {responseKeys.map((key, index) => (
                  <div key={index} className="response-key flex space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="key name"
                      value={key.key}
                      onChange={(e) => handleKeyChange(index, 'key', e.target.value)}
                      className="w-1/2 p-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="data type"
                      value={key.type}
                      onChange={(e) => handleKeyChange(index, 'type', e.target.value)}
                      className="w-1/2 p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                ))}
                <button type="button" onClick={handleAddKey} className="p-2  text-white bg-indigo-600 rounded-[15px]">
                  + Add Key
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
                    <span key={index} className="tag my-1 text-white bg-indigo-600 p-1.5 rounded-[15px] inline-flex items-center">
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
                    <button type="button" onClick={handleTagAdd} className="w-[10%] p-2 bg-indigo-600 rounded-[15px] text-white">
                      + Add Tag
                    </button>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>อัปโหลดไฟล์ภาพที่นี่</label>
                <input type="file" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded-lg" />
              </div>
              <button type="submit" className="p-2 bg-indigo-600 rounded-[15px] text-white">
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

export default CreateAiProject;
