import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";


interface SaveContentModalProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
}

const SaveContentModal: React.FC<SaveContentModalProps> = ({   open,onSave, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="save-dialog-title"
      aria-describedby="save-dialog-description"
    >
      <DialogTitle id="save-dialog-title">Save Content</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to save this content?</p>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" size="large" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#4f46e5",
            "&:hover": {
              backgroundColor: "#3730a3",
            },
          }}
          onClick={onSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default SaveContentModal;