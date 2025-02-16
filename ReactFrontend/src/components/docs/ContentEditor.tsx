// ContentEditor Component
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
        onInit={(evt, editor) => setText(editor.getContent())}
        value={value}
        init={{


          // placeholder: "",
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
  //         selector: 'textarea',  // change this value according to your HTML
  // file_picker_callback: (callback, value, meta) => {
  //   // Provide file and text for the link dialog
  //   if (meta.filetype == 'file') {
  //     callback('mypage.html', { text: 'My text' });
  //   }

  //   // Provide image and alt text for the image dialog
  //   if (meta.filetype == 'image') {
  //     callback('myimage.jpg', { alt: 'My alt text' });
  //   }

  //   // Provide alternative source and posted for the media dialog
  //   if (meta.filetype == 'media') {
  //     callback('movie.mp4', { source2: 'alt.ogg', poster: 'image.jpg' });
  //   }
  // }
// ,

        }}
        onEditorChange={onEditorChange}
      />
    </div>
  );
};

export default ContentEditor;
