import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Switch, FormControlLabel } from '@mui/material';

interface AISettingDialogProps {
  open: boolean;
  onClose: () => void;
  initialLimit: number;
  isLimitEnabled: boolean;
  onSave: (newLimit: number, isLimitEnabled: boolean) => void;
}

const AISettingDialog: React.FC<AISettingDialogProps> = ({ open, onClose, initialLimit, isLimitEnabled, onSave }) => {
  const [limit, setLimit] = useState<number>(initialLimit);
  const [isLimitActive, setIsLimitActive] = useState<boolean>(isLimitEnabled);

  const handleSave = () => {
    
    onSave(limit, isLimitActive); // ส่งค่าล่าสุดไปให้ `onSave`
    onClose();
  };

  useEffect(() => {
    setLimit(initialLimit);
    setIsLimitActive(isLimitEnabled);
  }, [initialLimit, isLimitEnabled]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>AI Usage Limit Settings</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Switch
              checked={isLimitActive}
              onChange={(e) => {
                console.log("Switch changed: ", e.target.checked);
                setIsLimitActive(e.target.checked);
              }}
              name="limitSwitch"
              color="primary"
            />
          }
          label="Enable Daily Limit"
        />
        {isLimitActive && (
          <TextField
            label="Max Usage Per Day"
            type="number"
            fullWidth
            variant="outlined"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            inputProps={{ min: 1 }}
            margin="normal"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AISettingDialog;
