import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles

const Docs = () => {
  const [editorState, setEditorState] = useState('');

  const handleEditorChange = (value) => {
    setEditorState(value);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Document Editor</h1>
      <ReactQuill 
        value={editorState}
        onChange={handleEditorChange}
        theme="snow" // you can also use 'bubble' or other custom themes
        placeholder="Start writing your document..."
      />
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Editor Content:</h2>
        <div>{editorState}</div>
      </div>
    </div>
  );
};

export default Docs;