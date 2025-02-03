import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

interface CreateWorkspaceProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchWorkspaces: () => void;
}

export const CreateWorkspace: React.FC<CreateWorkspaceProps> = ({ showModal, setShowModal, fetchWorkspaces }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleSubmit = () => {
    axios
      .post(
        `${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/create`,
        { name: name, description: description },
        { withCredentials: true }
      )
      .then(() => {
        setName('');
        setDescription('');
        setShowModal(false); // ปิด Dialog
        fetchWorkspaces(); // ดึงข้อมูล workspace ใหม่
      })
      .catch((error) => {
        console.error('Error creating workspace:', error);
      });
  };

  return (
    <Dialog
      open={showModal}
      onClose={() => setShowModal(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <span className="text-2xl font-semibold text-indigo-900">สร้าง Workspace</span>
        <IconButton
          aria-label="close"
          onClick={() => setShowModal(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div className="flex flex-col space-y-4">
          <div>
            <span className="font-medium tracking-tight text-indigo-900">ชื่อ Workspace</span>
            <span className="ml-2 text-red-500 text-sm">*</span>
            <TextField
              fullWidth
              placeholder="ชื่อ Workspace"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
            />
          </div>
          <div>
            <span className="font-medium tracking-tight text-indigo-900">คำอธิบาย</span>
            <TextField
              fullWidth
              placeholder="คำอธิบาย Workspace"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              margin="normal"
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: '#4f46e5',
            '&:hover': {
              backgroundColor: '#3730a3',
            },
          }}
        >
          สร้าง
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateWorkspace;
