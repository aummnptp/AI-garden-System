import { z } from "zod";

export const createProjectSchema = z.object({
  projectName: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(20, "Project name must not exceed 20 characters"),
    
  projectDescription: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(50, "Description must not exceed 50 characters"),
    
  image: z.instanceof(File).optional(),

  selectedCardId: z
    .string()
    .nonempty("Please select an AI model"),

  inputType: z
    .string()
    .nonempty("Please select a project type"),
});

export type CreateProjectFormType = z.infer<typeof createProjectSchema>;


