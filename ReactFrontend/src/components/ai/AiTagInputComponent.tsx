import { Button } from "@mui/material";

const AiTagInput: React.FC<{
  tags: string[];
  newTag: string;
  onTagAdd: () => void;
  onTagChange: (value: string) => void;
  onTagRemove: (tag: string) => void;
}> = ({ tags, newTag, onTagAdd, onTagChange, onTagRemove }) => (
  <div className="form-group">
    <label>AI tag</label>
    <div className="tags-input space-y-2">
      {tags.map((tag, index) => (
        <span key={index} className="tag my-1 text-white bg-indigo-600 p-1.5 inline-flex items-center rounded-[20px] px-4">
          {tag}
          <button type="button" onClick={() => onTagRemove(tag)} className="ml-2 text-white text-xl">
            &times;
          </button>
        </span>
      ))}
      <div className="flex space-x-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => onTagChange(e.target.value)}
          placeholder="Add tag"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#4f46e5", "&:hover": { backgroundColor: "#3730a3" } }}
          size="small"
          onClick={onTagAdd}
          className="w-[10%] p-2 bg-indigo-600 rounded-lg text-white"
        >
          + Add Tag
        </Button>
      </div>
    </div>
  </div>
);
export default AiTagInput;