import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { DialogContentText, Grid } from '@mui/material';
import AiData from '../data/AiData';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
      width: '90%', // ขนาดกว้างตามต้องการ
      maxWidth: '800px', // จำกัดขนาดสูงสุด
  },
}));

const CustomDialogTitle = styled(DialogTitle)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
});



  export default function AddAIDialog() {
    const [open, setOpen] = useState(false);
    const [aiListData, setAiListData] = useState(AiData);
    const [showAll, setShowAll] = useState(true);
    const [selectedAiId, setSelectedAiId] = useState<number | null>(null);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
      setAiListData(AiData)
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowAll(event.target.checked);
      };

    const filteredAiData = showAll
    ? aiListData 
    : aiListData.filter((ai) => !ai.access); 



    const handleRemoveAccess = (id: number) => {
        setAiListData((prevList) =>
          prevList.map((ai) => (ai.id === id ? { ...ai, access: false } : ai))
        );
        setSelectedAiId(null); // รีเซ็ตสถานะ
      };
    



      
    const handleSelectToggle = (id: number) => {
        setAiListData(prevList =>
          prevList.map(ai =>
            ai.id === id ? { ...ai, selected: !ai.selected } : ai
          )
        );
      };

      const handleOpenRemoveDialog = (id: number) => {
        setSelectedAiId(id);
      };
    
      const handleConfirmRemove = () => {
        if (selectedAiId !== null) {
          handleRemoveAccess(selectedAiId);
        }
      };
    return (
      <React.Fragment>
        <Button variant="contained" size="large" startIcon onClick={handleClickOpen}>
        <i className="bi bi-gear text-xl me-1"></i> จัดการสิทธิ์ AI
        </Button>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <CustomDialogTitle>
            <span><i className="bi bi-list"></i> จัดการสิทธิ์การใช้ AI</span>
            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </CustomDialogTitle>
          <DialogContent dividers>
            {/* Search bar */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  placeholder="ค้นหา AI"
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showAll}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="แสดงที่มีสิทธิ์แล้ว"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  select
                  SelectProps={{ native: true }}
                  size="small"
                  variant="outlined"
                >
                  <option value="">ประเภท AI</option>
                  <option value="object-detection">Object Detection</option>
                  <option value="classification">Classification</option>
                  <option value="regression">Regression</option>
                  <option value="segmentation">Segmentation</option>
                </TextField>
              </Grid>
            </Grid>

            {/* AI Card Grid */}
            <Grid container spacing={2} mt={2}>
              {/* Example card, repeat for each AI */}
              {filteredAiData.map((ai, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <div className="relative bg-gray-100 rounded-lg p-4 text-center shadow-md">
                    <img
                      src={ai.img} // Placeholder image
                      alt="AI Example"
                      className="rounded-md mb-2 "
                      style={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <h4 className="font-semibold">{ai.name}</h4>
                    <p className="text-sm text-gray-500">{ai.type}</p>
                    <div className="flex justify-center space-x-2 mt-2">
                      {/* {ai.tags.map((tag) => (
                      <span className="w-fit bg-sky-500 rounded-[10px] text-white text-xs font-normal px-2.5 py-0.5">{tag}</span>
                    ))} */}
                    </div>
                    {ai.access == true ? (
                      <div className="flex justify-center space-x-2 mt-2">
                       <div className="flex items-center space-x-1">
                            {/* ป้าย "มีอยู่แล้ว" */}
                            <span className="text-gray-600 text-sm w-full me-2">มีอยู่แล้ว</span>

                            {/* ปุ่ม REMOVE */}
                            <Button
                            variant="contained"
                            color="error"
                            size="small"
                            fullWidth
                            className="!bg-red-500 !text-white"
                            onClick={() => handleOpenRemoveDialog(ai.id)}
                            >
                            ถอนสิทธิ์
                            </Button>


                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center space-x-2 mt-2">
                        <Button
                          variant="outlined"
                          color={ai.selected ? "success" : "primary"} 
                          size="medium"
                          fullWidth
                          className=""
                       onClick={() => handleSelectToggle(ai.id)}
                        >
                    {ai.selected ?<i className="bi bi-check-lg"></i>: "เลือก"}
                        </Button>
                      </div>
                    )}
                  </div>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleClose}>
              SAVE
            </Button>
          </DialogActions>
        </BootstrapDialog>

            {/* Modal สำหรับการยืนยันการถอนสิทธิ์ */}
      <Dialog
        open={selectedAiId !== null}
        onClose={() => setSelectedAiId(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">ยืนยันการถอนสิทธิ์</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            คุณแน่ใจหรือไม่ว่าต้องการถอนสิทธิ์การเข้าถึง AI นี้
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button   variant="outlined"  onClick={() => setSelectedAiId(null)} color="primary">
            ยกเลิก
          </Button>
          <Button   variant="contained" onClick={handleConfirmRemove} color="error" autoFocus>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
      </React.Fragment>
    );
  }
