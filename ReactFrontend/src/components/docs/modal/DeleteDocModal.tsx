import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

interface DeleteModalProps {
  title:string;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteDocModal: React.FC<DeleteModalProps> = ({
title, open, onClose, onDelete
}) => {

  return (
    <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="delete-dialog-title"
    aria-describedby="delete-dialog-description"
  >
    <DialogTitle id="delete-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <p>{title}</p>
    </DialogContent>
    <DialogActions>
      <Button variant="outlined" size="large" onClick={onClose}>
        Cancel
      </Button>
      <Button
        variant="contained"
        size="large"
        color="error"
        onClick={onDelete}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
  );
};

export default DeleteDocModal;
