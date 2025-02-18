import React, { useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import { NoteAddOutlined } from "@mui/icons-material";
import { addNoteService } from "../api/services/HistoryService";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": { padding: theme.spacing(2) },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
  "& .MuiPaper-root": { width: "90%", maxWidth: "600px" },
}));

const CustomDialogTitle = styled(DialogTitle)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px",
});

interface AddNoteDialogProps {
  projectId: string;
  historyId: string;  // 🔹 ต้องการค่า historyId สำหรับเพิ่ม note
  onNoteAdded: () => void;  // 🔹 ใช้ refetch Note หลังจากเพิ่มเสร็จ
}

const AddNoteDialog: React.FC<AddNoteDialogProps> = ({ projectId, historyId, onNoteAdded }) => {
  const [open, setOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDetail, setNoteDetail] = useState("");

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNoteTitle("");
    setNoteDetail("");
  };

  const handleSave = async () => {
    if (!historyId || !projectId) {
      alert("Missing required data!");
      return;
    }
    if (!noteTitle.trim() || !noteDetail.trim()) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      console.log("Adding note for projectId:", projectId, "historyId:", historyId);
      await addNoteService(projectId, historyId, noteTitle, noteDetail);
      console.log("Note successfully added!");
      await onNoteAdded();
      handleClose();
    } catch (error) {
      console.error(" Error saving note", error);
      alert("Failed to save note.");
    }
  };
  return (
    <>
      <Button
        sx={{
          backgroundColor: "#3b82f6",
          "&:hover": { backgroundColor: "#2563eb" },
        }}
        variant="contained"
        onClick={handleClickOpen}
      >
        <NoteAddOutlined />
        เพิ่ม Note
      </Button>
      <BootstrapDialog onClose={handleClose} open={open}>
        <CustomDialogTitle>
          <span className="text-xl text-indigo-800 flex items-center">
            <NoteAddOutlined />
            เพิ่มบันทึก
          </span>
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
            sx={{ backgroundColor: "#3b82f6", "&:hover": { backgroundColor: "#2563eb" } }}
            onClick={handleSave}
            variant="contained"
            color="primary"
          >
            บันทึก
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default AddNoteDialog;
