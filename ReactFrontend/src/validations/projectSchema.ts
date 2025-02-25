import { z } from "zod";

export const createProjectSchema = z.object({
  projectName: z.string().min(3, "ชื่อโปรเจกต์ต้องมีอย่างน้อย 3 ตัวอักษร").max(20, "ชื่อโปรเจกต์จะมีได้มากสุด 20 ตัวอักษร"),
  projectDescription: z.string().min(5, "คำอธิบายต้องมีอย่างน้อย 5 ตัวอักษร").max(50, "คำอธิบายต้องจะมีได้มากสุด  50 ตัวอักษร"),
  image: z.instanceof(File).optional(),
  selectedCardId: z.string().nonempty("กรุณาเลือก AI ที่ต้องการใช้งาน"),
  inputType: z.string().nonempty("กรุณาเลือกประเภทโปรเจกต์"),
});

export type CreateProjectFormType = z.infer<typeof createProjectSchema>;


