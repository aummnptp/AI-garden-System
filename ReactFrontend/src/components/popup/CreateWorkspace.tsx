import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCreateWorkspaceMutation } from '../../hook/workspaces/useCreateWorkspaceMutation';
import toast from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workspaceSchema, WorkspaceSchemaType } from '../../validations/workspaceSchema';

interface CreateWorkspaceProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}


export const CreateWorkspace: React.FC<CreateWorkspaceProps> = ({ showModal, setShowModal }) => {
  const { mutate: createWorkspace } = useCreateWorkspaceMutation();
 
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WorkspaceSchemaType>({
    resolver: zodResolver(workspaceSchema),
  });

  const onSubmit = (data: { name: string; description: string }) => {
    createWorkspace({
      name: data.name,
      description: data.description,
      onSuccessCallback: () => {
        reset(); 
        setShowModal(false);
      },
    });
  };
  return (
    <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
    <DialogTitle>
      <span className="text-2xl font-semibold text-indigo-900">Create Workspace</span>
      <IconButton
        aria-label="close"
        onClick={() => setShowModal(false)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <div>
          <span className="font-medium tracking-tight text-indigo-900">Workspace Name</span>
          <span className="ml-2 text-red-500 text-sm">*</span>
          <TextField
            fullWidth
            placeholder="ชื่อ Workspace"
            variant="outlined"
            {...register("name")}
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </div>
        <div>
          <span className="font-medium tracking-tight text-indigo-900">Workspace Description</span>
          <TextField
            fullWidth
            placeholder="คำอธิบาย Workspace"
            variant="outlined"
            {...register("description")}
            multiline
            rows={4}
            margin="normal"
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </div>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#4f46e5",
              "&:hover": {
                backgroundColor: "#3730a3",
              },
            }}
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </DialogContent>
  </Dialog>
  );
};

export default CreateWorkspace;
