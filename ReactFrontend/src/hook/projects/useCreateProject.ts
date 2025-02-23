import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

interface CreateProjectProps {
  name: string;
  description: string;
  input_type: string;
  ai_id?: string | null;
  image_path?: File | null;
}

export const useCreateProjectMutation = () => {
  const { workspaceId } = useParams<{ workspaceId?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: CreateProjectProps) => {
      if (!workspaceId) throw new Error("Missing workspaceId");

      const formData = new FormData();
      formData.append("name", projectData.name);
      formData.append("description", projectData.description);
      formData.append("input_type", projectData.input_type);
      if (projectData.ai_id) {
        formData.append("ai_id", projectData.ai_id);
      }
      if (projectData.image_path) {
        formData.append("file", projectData.image_path);
      }

      await axios.post(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/projects/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
      toast.success("Project created successfully!");
      navigate(`/workspaces/${workspaceId}/project-list`);
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast.error("Failed to create project.");
    },
  });

  return { createProjectMutation };
};