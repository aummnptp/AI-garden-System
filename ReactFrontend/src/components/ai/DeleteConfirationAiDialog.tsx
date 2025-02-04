

import { Dialog, DialogTitle,DialogActions, Button,} from '@mui/material';

export const DeleteConfirmationDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ open, onClose, onConfirm }) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="confirm-delete-title"
    aria-describedby="confirm-delete-description"
  >
    <DialogTitle id="confirm-delete-title" sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
      Confirm Deletion
    </DialogTitle>
    <DialogActions>
      <Button variant="outlined" onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button variant="contained" color="error" onClick={onConfirm}>
        Remove AI
      </Button>
    </DialogActions>
  </Dialog>
);
export default DeleteConfirmationDialog;