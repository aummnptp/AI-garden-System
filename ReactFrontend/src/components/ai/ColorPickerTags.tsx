import { Button, Chip } from "@mui/material";
import React, { useState } from "react";
import { FieldErrors } from "react-hook-form";
import { AiSchemaType } from "../../validations/aiSchema";

interface ColorPickerTagsProps {
  colors: string[]; // ค่าสีที่ถูกเลือก
  onChange: (colors: string[]) => void; 
  errors: FieldErrors<AiSchemaType>;  // รับค่า errors จาก React Hook Form
}

const ColorPickerTags: React.FC<ColorPickerTagsProps> = ({colors,onChange,  errors,  }) => {
  const [newColor, setNewColor] = useState<string>("#00ff00");

  const handleTagAdd = () => {
    if (newColor && !colors.includes(newColor)) {
      onChange([...colors, newColor]);
    }
  };

  const handleTagRemove = (color: string) => {
    onChange(colors.filter((tag) => tag !== color));
  };

  return (
    <div className="form-group">
      <label className="">AI Color (สำหรับการกำหนดสีกรอบผลลัพธ์AI ประเภท ObjectDetection Segmentation)</label>
      <div className="flex flex-wrap gap-2 mt-2">
      {errors.colorSet && <p className="text-red-500 text-sm">{errors.colorSet.message}</p>}
      {colors.map((color, index) => (
          <Chip
            key={index}
            label={
              <div className="flex items-center space-x-2">
                <span
                  className="w-4 h-4 inline-block rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
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
