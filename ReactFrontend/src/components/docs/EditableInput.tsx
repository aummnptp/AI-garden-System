import { TextField } from "@mui/material";
import { DocData } from "./types";

type EditableInputProps = {
    value: string;
    index: number;
    setDocDatas: React.Dispatch<React.SetStateAction<DocData[]>>;
    onKeyDown: (e: React.KeyboardEvent, index: number) => void;
    wrapperRef: React.RefObject<HTMLInputElement>;
  };
  
  const EditableInput: React.FC<EditableInputProps> = ({
    value,
    index,
    setDocDatas,
    onKeyDown,
    wrapperRef,
  }) => (
    <div className="w-full">
      <TextField
        required
        id={`title-${index}`}
        label="ใส่ชื่อที่ต้องการแก้ไข"
        inputProps={{ maxLength: 20 }}
        value={value}
        onChange={(e) => {
          const newTitleComponentData = [...docDatas];
          newTitleComponentData[index].text = e.target.value;
          setDocDatas(newTitleComponentData);
        }}
        onKeyDown={(e) => onKeyDown(e, index)}
        ref={wrapperRef}
      />
    </div>
  );
  export default EditableInput;