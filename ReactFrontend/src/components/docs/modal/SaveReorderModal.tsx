import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";


interface SaveReorderModalProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
}

const SaveReorderModal: React.FC<SaveReorderModalProps> = ({   open,onSave, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="save-dialog-title"
      aria-describedby="save-dialog-description"
    >
      <DialogTitle id="save-dialog-title">Save Reorder Document Title</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to save this reorder sorting?</p>
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
export default SaveReorderModal;