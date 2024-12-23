import React, { useEffect, useState } from 'react';
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
import axios from 'axios';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    width: '90%',
    maxWidth: '800px',
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
  const [aiListData, setAiListData] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedAiId, setSelectedAiId] = useState<number | null>(null);

  // Fetch data from API
  useEffect(() => {
    axios
      .get('http://localhost:3000/ai-models/')
      .then((response) => {
        setAiListData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching AI models:', error);
        setLoading(false);
      });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
    setSelectedAiId(null);
  };

  const handleSelectToggle = (id: number) => {
    setAiListData((prevList) =>
      prevList.map((ai) =>
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
          <span>
            <i className="bi bi-list"></i> จัดการสิทธิ์การใช้ AI
          </span>
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </CustomDialogTitle>
        <DialogContent dividers>
          {loading ? (
            <p>กำลังโหลดข้อมูล AI...</p>
          ) : (
            <>
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
              </Grid>

              {/* AI Card Grid */}
              <Grid container spacing={2} mt={2}>
                {filteredAiData.map((ai, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <div className="relative bg-gray-100 rounded-lg p-4 text-center shadow-md">
                      <img
                        src={ai.img}
                        alt="AI Example"
                        className="rounded-md mb-2"
                        style={{
                          width: '100%',
                          height: '100px',
                          objectFit: 'cover',
                        }}
                      />
                      <h4 className="font-semibold">{ai.name}</h4>
                      <p className="text-sm text-gray-500">{ai.type}</p>
                      {ai.access ? (
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          fullWidth
                          onClick={() => handleOpenRemoveDialog(ai.id)}
                        >
                          ถอนสิทธิ์
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          size="medium"
                          fullWidth
                          onClick={() => handleSelectToggle(ai.id)}
                        >
                          {ai.selected ? <i className="bi bi-check-lg"></i> : 'เลือก'}
                        </Button>
                      )}
                    </div>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            SAVE
          </Button>
        </DialogActions>
      </BootstrapDialog>

      {/* Confirm Remove Dialog */}
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
          <Button
            variant="outlined"
            onClick={() => setSelectedAiId(null)}
            color="primary"
          >
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmRemove}
            color="error"
            autoFocus
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
