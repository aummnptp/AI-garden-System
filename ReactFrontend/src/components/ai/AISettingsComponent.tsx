import React, { useState } from 'react';
import { Button } from '@mui/material';
import AISettingDialog from './AISettingDialog';
import { updateAISettingService } from '../../api/services/AiSettingService';
import { SettingFilled } from '@ant-design/icons';
import { useAiData } from '../../hook/ai/useAiData';

const AISettingsComponent: React.FC = () => {
  const {
    aiSettingData,
    isLoadingAiSetting,
    isErrorAiSetting,
    refetchAiSetting,
  } = useAiData();

  const initialLimit = aiSettingData ? aiSettingData.maxUsagePerDay : 10;
  const isLimitEnabled = aiSettingData ? aiSettingData.isLimitEnabled : false;

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSaveSettings = async (newLimit: number, newIsLimitEnabled: boolean) => {
    console.log("handleSaveSettings - newLimit:", newLimit, "newIsLimitEnabled:", newIsLimitEnabled);
    try {
      const updatedSettings = await updateAISettingService(newLimit, newIsLimitEnabled);
      console.log('Settings updated:', updatedSettings);
      refetchAiSetting();
    } catch (error) {
      console.error('Error updating settings:', error);
      alert("Error updating settings");
    } finally {
      setDialogOpen(false);
    }
  };

  // if (isLoadingAiSetting) return <div>Loading settings...</div>;
  // if (isErrorAiSetting) return <div>Error loading settings: {isErrorAiSetting.message}</div>;

  return (
    <>
      <Button variant="outlined" color="info" onClick={handleOpenDialog}>
        <SettingFilled /> AI Demo Settings
      </Button>
      <AISettingDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        initialLimit={initialLimit}
        isLimitEnabled={isLimitEnabled}
        onSave={handleSaveSettings}
      />
    </>
  );
};

export default AISettingsComponent;
