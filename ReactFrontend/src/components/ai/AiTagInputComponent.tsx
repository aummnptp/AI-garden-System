import {
  Button,
  FormControl,
  FormLabel,
  TextField,
  IconButton,
} from "@mui/material";
import { FieldErrors } from "react-hook-form";
import { AiSchemaType } from "../../validations/aiSchema";

const AiTagInput: React.FC<{
  tags: string[];
  newTag: string;
  onTagAdd: () => void;
  onTagChange: (value: string) => void;
  onTagRemove: (tag: string) => void;
  errors: FieldErrors<AiSchemaType>;
}> = ({ tags, newTag, onTagAdd, onTagChange, onTagRemove, errors }) => (
  <FormControl fullWidth>
    <FormLabel>AI Tag</FormLabel>
    {errors.tags && (
      <p className="text-red-500 text-sm">{errors.tags.message}</p>
    )}

    <div className="tags-input space-y-2">
      {/* Render AI Tags */}
      {tags.map((tag, index) => (
        <div key={index} className="mx-1 inline-flex items-center space-x-2">
          <span className="my-1 text-white bg-indigo-600 p-1.5 inline-flex items-center rounded-[20px] px-4">
            {tag}
            <IconButton
              size="small"
              onClick={() => onTagRemove(tag)}
              sx={{ color: "white", marginLeft: "5px" }}
            >
              ✕
            </IconButton>
          </span>
          {errors.tags?.[index] && (
            <p className="text-red-500 text-sm">
              {errors.tags[index]?.message}
            </p>
          )}
        </div>
      ))}

      {/* Input for adding new tag */}
<div className="flex space-x-2 items-center">
  <TextField
    fullWidth
    variant="outlined"
    value={newTag}
    onChange={(e) => onTagChange(e.target.value)}
    placeholder="Add tag"
  />
  <Button
    variant="contained"
    sx={{
      backgroundColor: "#4f46e5",
      "&:hover": { backgroundColor: "#3730a3" },
      minWidth: "100px", 
      height: "40px",
      padding: "6px 12px", 
    }}
    className="flex-shrink-0" 
   
    onClick={onTagAdd}
  >
    + Add Tag
  </Button>
</div>
    </div>
  </FormControl>
);

export default AiTagInput;
