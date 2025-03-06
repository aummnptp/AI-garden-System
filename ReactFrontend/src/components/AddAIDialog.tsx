import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
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
import { getImageUrl } from '../function/util';
import { useAiData } from '../hook/ai/useAiData';
import { useAiPermissionMutations } from '../hook/ai-permission/useAiPermissionMutation';

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

export interface Permission {
  id: string;
  user_id: string;
  ai_id: string;
  approve: boolean;
  updatedAt: string;
}

export interface AIModel {
  aiId: string;
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
  const { userId } = useParams<{ userId: string }>();

  const {
    allAiModelWithApprovalData,
    isLoadingallAiModelWithApproval
  } = useAiData();

  const { addBulkPermissionRequest, removeBulkPermissionRequest } = useAiPermissionMutations();

  const [open, setOpen] = useState(false);
  const [aiListData, setAiListData] = useState<AIModel[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedToAdd, setSelectedToAdd] = useState<string[]>([]);
  const [selectedToRemove, setSelectedToRemove] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false); 
  const [aiToRemove, setAiToRemove] = useState<AIModel | null>(null);


  React.useEffect(() => {
    if (allAiModelWithApprovalData) {
      setAiListData(allAiModelWithApprovalData);
    }
  }, [allAiModelWithApprovalData]);

  if (isLoadingallAiModelWithApproval) {
    return <p>Loading AI data...</p>;
  }


  const handleClickOpen = () => {
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
    if (selectedToRemove.includes(ai.aiId)) {
      setSelectedToRemove((prev) => prev.filter((id) => id !== ai.aiId));
    } else {
      setAiToRemove(ai);
      setConfirmDialogOpen(true);
    }
  };

  const handleConfirmRemove = () => {
    if (aiToRemove) {
      setSelectedToRemove((prev) => [...prev, aiToRemove.aiId]);
    }
    setConfirmDialogOpen(false);
  };

  const handleCancelRemove = () => {
    setAiToRemove(null);
    setConfirmDialogOpen(false);
  };

  const handleSaveRequest = () => {
    setSaveDialogOpen(true);
  };

  const handleConfirmSave = () => {
    if (!selectedToRemove.length && !selectedToAdd.length) {
      setSaveDialogOpen(false);
      return;
    }

    const idsToRemove = selectedToRemove.flatMap((aiId) => {
      const ai = aiListData.find((item) => item.aiId === aiId);
      return ai?.permissions.map((perm: Permission) => perm.id) || [];
    });

    if (idsToRemove.length > 0) {
      removeBulkPermissionRequest.mutate({ userId: userId!, ids: idsToRemove });
    }

    if (selectedToAdd.length > 0) {
      addBulkPermissionRequest.mutate({ userId: userId!, aiIds: selectedToAdd });
    }

    setAiListData((prevList) =>
      prevList.map((ai) => {
        if (selectedToRemove.includes(ai.aiId)) {
          return { ...ai, permissions: [] } as AIModel;
        }
        if (selectedToAdd.includes(ai.aiId)) {
          return {
            ...ai,
            permissions: [{
              id: Date.now().toString(),
              ai_id: ai.aiId,
              user_id: userId!,
              approve: false,
              updatedAt: new Date().toISOString(),
            }],
          } as AIModel;
        }
        return ai;
      })
    );
    setSelectedToRemove([]);
    setSelectedToAdd([]);
    setOpen(false);
    setSaveDialogOpen(false);
  };

  const handleCancelSave = () => {
    setSaveDialogOpen(false);
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
          {isLoadingallAiModelWithApproval ? (
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
                  <Grid item xs={6} sm={4} md={3} key={ai.aiId}>
                    <div className="relative bg-gray-100 rounded-lg p-4 text-center shadow-md">
                      <img
                        src={getImageUrl(ai.imagePath || "placeholder.png")}
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
                          variant={selectedToAdd.includes(ai.aiId) ? "contained" : "outlined"}
                          color="primary"
                          size="small"
                          fullWidth
                          onClick={() =>
                            setSelectedToAdd((prev) =>
                              prev.includes(ai.aiId)
                                ? prev.filter((item) => item !== ai.aiId)
                                : [...prev, ai.aiId]
                            )
                          }
                        >
                          {selectedToAdd.includes(ai.aiId) ? "ยกเลิกเพิ่มสิทธิ์" : "เพิ่มสิทธิ์"}
                        </Button>
                      ) : (
                        <Button
                          variant={selectedToRemove.includes(ai.aiId) ? "outlined" : "contained"}
                          color="error"
                          size="small"
                          fullWidth
                          onClick={() => handleRemoveRequest(ai)}
                        >
                          {selectedToRemove.includes(ai.aiId) ? "ยกเลิกถอนสิทธิ์" : "ถอนสิทธิ์"}
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
            disabled={!selectedToRemove.length && !selectedToAdd.length}
          >
            SAVE
          </Button>
        </DialogActions>
      </BootstrapDialog>

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
