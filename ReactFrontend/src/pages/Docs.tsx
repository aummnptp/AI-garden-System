import React from 'react'
import { Editor } from '@tinymce/tinymce-react'

const Docs = () => {
  return (
    <div>
        <Editor
        onInit={(evt,editor)=> editorRef.current =editor}
        />
    </div>
  )
}

export default Docs