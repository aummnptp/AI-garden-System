import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";


interface DiscardContentModalProps {
    open: boolean;
    onClose: () => void;
    onDiscard: () => void;
}

const DiscardContentModal: React.FC<DiscardContentModalProps> = ({   open,onDiscard, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="save-dialog-title"
      aria-describedby="save-dialog-description"
    >
      <DialogTitle id="save-dialog-title">Discard Unsaved Content?</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to discard this unsaved content?</p>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" size="large" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          size="large"
        color="error"
          onClick={onDiscard}
        >
          Discard
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default DiscardContentModal;