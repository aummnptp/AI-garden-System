import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { NoteAdd, NoteAddOutlined, Save, SaveAlt, SaveAltOutlined, SaveAsOutlined } from '@mui/icons-material';
import { SaveOutlined } from '@ant-design/icons';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    width: '90%', 
    maxWidth: '600px',
  },
}));

const CustomDialogTitle = styled(DialogTitle)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
});

const AddNoteDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDetail, setNoteDetail] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNoteTitle(''); // รีเซ็ตค่าเมื่อปิด Modal
    setNoteDetail('');
  };

  const handleSave = () => {
    // ทำการบันทึก Note ที่นี่
    console.log('Note Title:', noteTitle);
    console.log('Note Detail:', noteDetail);
    handleClose(); // ปิด Modal หลังบันทึก
  };

  return (
    <React.Fragment>
      <Button
       sx={{
        backgroundColor: "#3b82f6",
        "&:hover": {
          backgroundColor: "#2563eb", // สีที่ต้องการเมื่อ hover
        },
      }}
      
      variant="contained" onClick={handleClickOpen}>
        <NoteAddOutlined/>เพิ่ม Note
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        open={open}
      >
        <CustomDialogTitle>
          <span className='text-xl text-indigo-800 items-center flex'>    <NoteAddOutlined/>เพิ่มบันทึก</span>
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </CustomDialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="หัวข้อบันทึก"
            variant="outlined"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="รายละเอียดบันทึก"
            variant="outlined"
            multiline
            rows={4}
            value={noteDetail}
            onChange={(e) => setNoteDetail(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="primary">
            ยกเลิก
          </Button>
          <Button
          
          sx={{
            backgroundColor: "#3b82f6",
            "&:hover": {
              backgroundColor: "#2563eb", // สีที่ต้องการเมื่อ hover
            },
          }}
          onClick={handleSave} variant="contained" color="primary">
          บันทึก
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default AddNoteDialog;