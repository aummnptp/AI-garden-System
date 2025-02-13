import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import {  useParams } from 'react-router-dom';
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

interface Permission {
  id: number;
  user_id: number;
  ai_id: number;
  approve: boolean;
  updatedAt: string;
}

interface AIModel {
  id: number;
  name: string;
  description: string;
  ai_type: string;
  ai_tag: string[];
  input_desc: string | null;
  api_uri: string;
  response_keys: { key: string; meaning: string }[];
  createdAt: string;
  updatedAt: string;
  imagePath: string | null;
  permissions: Permission[];
}

export default function AddAIDialog() {
  const [open, setOpen] = useState(false);
  const [aiListData, setAiListData] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedToAdd, setSelectedToAdd] = useState<number[]>([]);
  const [selectedToRemove, setSelectedToRemove] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // Dialog ยืนยันการลบ
  const [saveDialogOpen, setSaveDialogOpen] = useState(false); // Dialog ยืนยันการบันทึก
  const [aiToRemove, setAiToRemove] = useState<AIModel | null>(null); // AI ที่จะลบ
  const { userId } = useParams();

  useEffect(() => {
    // Fetch AI data
    axios
      .get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/${userId}/models`)
      .then((response) => {
        setAiListData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching AI models:", error);
        setLoading(false);
      });
  }, []);

  const handleClickOpen = () => {
    console.log("User ID:", userId); // เพิ่ม console log ที่นี่
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowAll(event.target.checked);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleRemoveRequest = (ai: AIModel) => {
    setAiToRemove(ai);
    setConfirmDialogOpen(true); // เปิด Dialog ยืนยันการลบ
  };

  const handleConfirmRemove = () => {
    if (aiToRemove) {
      setSelectedToRemove((prev) => [...prev, aiToRemove.id]);
    }
    setConfirmDialogOpen(false); // ปิด Dialog
  };

  const handleCancelRemove = () => {
    setAiToRemove(null);
    setConfirmDialogOpen(false);
  };

  const handleSaveRequest = () => {
    setSaveDialogOpen(true); // เปิด Dialog ยืนยันการบันทึก
  };

  const handleConfirmSave = () => {
    const idsToRemove = selectedToRemove.flatMap((aiId) => {
      const ai = aiListData.find((item) => item.id === aiId);
      return ai?.permissions.map((perm: Permission) => perm.id) || [];
    });

    const idsToAdd = selectedToAdd.map((aiId) => ({
      ai_id: aiId,
      user_id: parseInt(userId || "0"),
    }));

    if (idsToRemove.length === 0 && idsToAdd.length === 0) {
      console.error("No changes to save");
      setSaveDialogOpen(false); // ปิด Dialog หากไม่มีการเปลี่ยนแปลง
      return;
    }

    // ส่งข้อมูลการลบ
    if (idsToRemove.length > 0) {
      axios
        .delete(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-permission/remove-bulk`, {
          data: { ids: idsToRemove },
          withCredentials: true,
        })
        .catch((error) => console.error("Error removing permissions:", error));
    }

    // ส่งข้อมูลการเพิ่ม
    if (idsToAdd.length > 0) {
      axios
        .post(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-permission/add-bulk`, idsToAdd, {
          withCredentials: true,
        })
        .catch((error) => console.error("Error adding permissions:", error));
    }

    // รีเฟรชหน้า
    setAiListData((prevList) =>
      prevList.map((ai) => {
        if (selectedToRemove.includes(ai.id)) {
          return { ...ai, permissions: [] }; // ลบสิทธิ์
        }
        if (selectedToAdd.some((item) => item.ai_id === ai.id)) {
          return {
            ...ai,
            permissions: [{ id: Date.now(), user_id: parseInt(userId || "0"), approve: false }],
          };
        }
        return ai;
      })
    );
    setSelectedToRemove([]);
    setSelectedToAdd([]);
    setOpen(false);
    setSaveDialogOpen(false); // ปิด Dialog หลังการบันทึก
    window.location.reload(); // รีเฟรชหน้า
  };

  const handleCancelSave = () => {
    setSaveDialogOpen(false); // ปิด Dialog
  };

  const filteredAiData = aiListData
  .filter((ai) => {
    if (showAll) {
      return ai.permissions.some((p: any) => p.approve);
    }
    return true;
  })
  .filter((ai) => ai.name.toLowerCase().includes(searchQuery))
  .map((ai) => ({
    ...ai,
    // นับจำนวน permission ที่ได้รับการอนุมัติ
    approvedPermissionsCount: ai.permissions.filter((p: any) => p.approve).length,
  }));


  return (
    <>
      <Button variant="contained" size="large" onClick={handleClickOpen}>
        <i className="bi bi-gear text-xl me-1"></i> จัดการสิทธิ์ AI
      </Button>
      <BootstrapDialog onClose={handleClose} open={open}>
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
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    placeholder="ค้นหา AI"
                    variant="outlined"
                    size="small"
                    onChange={handleSearchChange}
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControlLabel
                    control={<Checkbox checked={showAll} onChange={handleCheckboxChange} />}
                    label="แสดงที่มีสิทธิ์แล้ว"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={2}>
                {filteredAiData.map((ai) => (
                  <Grid item xs={6} sm={4} md={3} key={ai.id}>
                    <div className="relative bg-gray-100 rounded-lg p-4 text-center shadow-md">
                      <img
                        src={ai.imagePath || "placeholder.png"}
                        alt="AI Example"
                        className="rounded-md mb-2"
                        style={{
                          width: "100%",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                      <h4 className="font-semibold">{ai.name}</h4>
                      <p className="text-sm text-gray-500">{ai.ai_type}</p>
                      {!ai.permissions.some((p: any) => p.approve) ? (
                        <Button
                          variant={selectedToAdd.includes(ai.id) ? "contained" : "outlined"}
                          color="primary"
                          size="small"
                          fullWidth
                          onClick={() =>
                            setSelectedToAdd((prev) =>
                              prev.includes(ai.id) ? prev.filter((item) => item !== ai.id) : [...prev, ai.id]
                            )
                          }
                        >
                          {selectedToAdd.includes(ai.id) ? "ยกเลิกเพิ่มสิทธิ์" : "เพิ่มสิทธิ์"}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          fullWidth
                          onClick={() => handleRemoveRequest(ai)}
                        >
                          {selectedToRemove.includes(ai.id) ? "ยกเลิกถอนสิทธิ์" : "ถอนสิทธิ์"}
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
          <Button
            variant="contained"
            onClick={handleSaveRequest}
            disabled={!selectedToRemove.length && !selectedToAdd.length} // ตรวจสอบทั้งสองค่า
          >
            SAVE
          </Button>
        </DialogActions>
      </BootstrapDialog>

      {/* Dialog ยืนยันการลบ */}
      <Dialog open={confirmDialogOpen} onClose={handleCancelRemove}>
        <DialogTitle>ยืนยันการถอนสิทธิ์</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณต้องการถอนสิทธิ์การเข้าถึง AI "{aiToRemove?.name}" หรือไม่?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelRemove} color="secondary">
            ยกเลิก
          </Button>
          <Button onClick={handleConfirmRemove} color="primary">
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog ยืนยันการบันทึก */}
      <Dialog open={saveDialogOpen} onClose={handleCancelSave}>
        <DialogTitle>ยืนยันการบันทึก</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณต้องการบันทึกการเปลี่ยนแปลงนี้หรือไม่?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSave} color="secondary">
            ยกเลิก
          </Button>
          <Button onClick={handleConfirmSave} color="primary">
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
