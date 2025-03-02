import { z } from "zod";

export const aiSchema = z.object({
  aiName: z
    .string()
    .min(3, "AI name must be at least 3 characters")
    .max(50, "AI name cannot exceed 50 characters"),
    
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description cannot exceed 500 characters"),
    
  serviceUri: z.string().url("Invalid Service URI"),
  
  aiType: z.enum(["Object Detection", "Regression", "Segmentation", "Classification"], {
    errorMap: () => ({ message: "Invalid AI type" }),
  }),
  
  inputType: z.enum(["รูปภาพและวิดีโอ", "รูปภาพ", "วิดีโอ"], {
    errorMap: () => ({ message: "Invalid Input Type" }),
  }),
  
  tags: z
  .array(
    z.string()
      .min(1, { message: "Tag cannot be empty" })
      .max(20, { message: "Tag cannot exceed 20 characters" })
  )
  .min(1, { message: "At least one tag is required" })
  .refine((tags) => new Set(tags).size === tags.length, {
    message: "Tags must be unique",
  }),
  
  inputDescription: z.string()
  .min(3, "AI name must be at least 3 characters")
  .max(50, "AI name cannot exceed 50 characters"),
  
  responseKeys: z.array(
    z.object({
      key: z.string().min(1, "Key cannot be empty"),
      meaning: z.string().min(1, "Meaning cannot be empty"),
      displayFormat: z.string().min(1, "Display Format cannot be empty"),
    })
  ),
  
  enable: z.boolean(),
  
  visible: z.boolean(),
  
  colorSet: z
    .array(z.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/, "Invalid color format"))
    .min(1, "At least one color is required"),
  
  aiPicture: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    })
    .refine((file) => !file || ["image/jpeg", "image/png"].includes(file.type), {
      message: "Only JPG and PNG images are allowed",
    }),
    predictResult: z
    .object({
      response_keys: z.array(z.object({
        key: z.string(),
        meaning: z.string(),
        displayFormat: z.string().optional(),
      })),
      prediction: z.any(),
      ai_model: z.object({
        name: z.string(),
        ai_tag: z.string(),
        colorSet: z.array(z.string()),
        ai_type: z.string(),
      }),
    })
    .optional(),
  customedImageUrl: z.string().optional(),
  selectOptions: z.array(z.string()).optional(),
});


export type AiSchemaType = z.infer<typeof aiSchema>;
