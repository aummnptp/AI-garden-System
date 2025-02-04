import React, { useState } from 'react';
import { Button } from '@mui/material';
import AISettingDialog from './AISettingDialog';
import { useFetchQuery } from '../../hook/useFetchQuery';
import { updateAISettingService } from '../../api/services/AiSettingService';

const AISettingsComponent: React.FC = () => {
  // เรียก API เพื่อดึงข้อมูลการตั้งค่า AI Usage Limit
  const { data: aiSettingData, isLoading, error, refetch } = useFetchQuery(
    ["ai-usage-limit-setting"],
    "/ai-usage-limit-setting"
  );

  // กำหนดค่าเริ่มต้น ถ้าไม่มีข้อมูล (หรือ error) ให้ใช้ default 10
  const initialLimit = aiSettingData ? aiSettingData.maxUsagePerDay : 10;
  // ใช้ค่า actual จาก aiSettingData.isLimitEnabled (หรือ false หากไม่มีข้อมูล)
  const isLimitEnabled = aiSettingData ? aiSettingData.isLimitEnabled : false;

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSaveSettings = async (newLimit: number, newIsLimitEnabled: boolean) => {
    console.log("handleSaveSettings - newLimit:", newLimit, "newIsLimitEnabled:", newIsLimitEnabled);
    try {
      const updatedSettings = await updateAISettingService(newLimit, newIsLimitEnabled);
      console.log('Settings updated:', updatedSettings);
      refetch();
    } catch (error) {
      console.error('Error updating settings:', error);
      alert("Error updating settings");
    } finally {
      setDialogOpen(false);
    }
  };

  if (isLoading) return <div>Loading settings...</div>;
  if (error) return <div>Error loading settings: {error.message}</div>;

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        Open AI Settings
      </Button>
      <AISettingDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        initialLimit={initialLimit}
        isLimitEnabled={isLimitEnabled}
        onSave={handleSaveSettings}
      />
    </div>
  );
};

export default AISettingsComponent;
