import { z } from "zod";

export const projectSchema = z.object({
  name: z.string()
    .min(3, "Project name must be at least 3 characters")
    .max(50, "Project name cannot exceed 50 characters"),

  description: z.string()
    .min(5, "Project description must be at least 5 characters")
    .max(200, "Project description cannot exceed 200 characters"),

  inputType: z.string().nonempty("กรุณาเลือกประเภทของโปรเจกต์"),

  image: z
    .instanceof(File, { message: "Invalid file format" })
    .optional()
    .refine(file => !file || file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    })
    .refine(file => !file || ["image/jpeg", "image/png"].includes(file.type), {
      message: "Only JPG and PNG images are allowed",
    }),
});


export type ProjectSchemaType = z.infer<typeof projectSchema>;