// ContentEditor Component
import React from "react";
import { Button } from "@mui/material";
import { SaveOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";

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
  console.log(value)
  return (
    <div>
      <div className="pr-12 w-[80%] h-[12%] bg-white border border-zinc-300 fixed bottom-0 right-0 flex justify-between items-center pl-2">
        <Button
          variant="contained"
          size="large"
          color="error"
          onClick={onDiscard}
        >
          <SaveOutlined /> Discard Change
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

      <Editor
                apiKey="ncaou3be6pfqi22ceukdz7cyc2cf3nz3qhj33rqb8b5j8kxy"
                init={{
                  plugins:
                  // "" ,
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                  tinycomments_mode: "embedded",
                  tinycomments_author: "Author name",
                  mergetags_list: [
                    { value: "First.Name", title: "First Name" },
                    { value: "Email", title: "Email" },
                  ],

                  ai_request: (request, respondWith) =>
                    respondWith.string(() =>
                      Promise.reject("See docs to implement AI Assistant")
                    ),
                }}
        onEditorChange={onEditorChange}
      />
    
      {/* <Editor
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
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          resize: true,
        }}
        onEditorChange={onEditorChange}
      /> */}
    </div>
  );
};

export default ContentEditor;
