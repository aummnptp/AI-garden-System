import React from "react";
import { Button } from "@mui/material";
import { SaveOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import { DeleteOutlined } from "@mui/icons-material";

type ContentEditorProps = {
  value: string;
  onSave: () => void;
  onDiscard: () => void;
  onEditorChange: (content: string) => void;
  setText: (text: string) => void;
};

const ContentEditor: React.FC<ContentEditorProps> = ({
  value,
  onSave,
  onDiscard,
  onEditorChange,
  setText,
}) => {

  
  return (
    <div className="w-full justify-self-center relative  ">
      <div className=" pr-12 w-[80%] h-[12%] bg-white border border-zinc-300 fixed bottom-0 right-0 z-50 flex justify-between items-center pl-2">
        <Button
          variant="contained"
          size="large"
          color="error"
          onClick={onDiscard}
        >
            <DeleteOutlined /> Discard Change
        </Button>

        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#4f46e5",
            "&:hover": {
              backgroundColor: "#3730a3",
            },
          }}
          onClick={onSave}
        >
          <SaveOutlined /> Save Content
        </Button>
      </div>
{/* 
     */}
      <Editor 
        id="Editor"
        
        tinymceScriptSrc={"/tinymce/tinymce.min.js"}
        onInit={(_, editor) => setText(editor.getContent())}
        value={value}
        init={{
          min_height: 750,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "preview",
            "help",
            "wordcount",
          ],
          toolbar:
          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          resize: true,

        }}
        onEditorChange={onEditorChange}
      />
    </div>
  );
};

export default ContentEditor;
