import { Button, Chip } from "@mui/material";
import React, { useState } from "react";

const ColorPickerTags: React.FC = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [newColor, setNewColor] = useState<string>("#000000");

  const handleTagAdd = () => {
    if (newColor && !tags.includes(newColor)) {
      setTags([...tags, newColor]);
    }
  };

  const handleTagRemove = (color: string) => {
    setTags(tags.filter((tag) => tag !== color));
  };

  return (
    <div className="form-group">
      <label className="">AI Color (สำหรับการกำหนดสีกรอบผลลัพธ์AI ประเภท ObjectDetection Segmentation)</label>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((color, index) => (
          <Chip
            key={index}
            label={
              <div className="flex items-center space-x-2">
                <span
                  className="w-4 h-4 inline-block rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                ></span>
                <span>Color {index + 1}</span>
              </div>
            }
            onDelete={() => handleTagRemove(color)}
            sx={{
              backgroundColor: "#f3f4f6",
              color: "#333",
              fontWeight: "bold",
              borderRadius: "20px",
            }}
          />
        ))}
      </div>

      {/* Color Picker & Button */}
      <div className="flex items-center space-x-2 mt-3">
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4f46e5",
            "&:hover": { backgroundColor: "#3730a3" },
          }}
          size="small"
          onClick={handleTagAdd}
        >
          + Add Color
        </Button>
      </div>
    </div>
  );
};

export default ColorPickerTags;
