import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import AISettingDialog from './AISettingDialog';
import { SettingFilled } from '@ant-design/icons';
import { useAiData } from '../../hook/ai/useAiData';
import { useUpdateAISettingsMutation } from '../../hook/ai/useUpdateAISettingsMutation';

const AISettingsComponent: React.FC = () => {
  const {
    aiSettingData,
    isLoadingAiSetting,
  } = useAiData();

  const initialLimit = aiSettingData ? aiSettingData.maxUsagePerDay : 10;
  const isLimitEnabled = aiSettingData ? aiSettingData.isLimitEnabled : false;

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const { mutate: updateAISettings } = useUpdateAISettingsMutation();

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSaveSettings = (newLimit: number, newIsLimitEnabled: boolean) => {
    updateAISettings({ newLimit, newIsLimitEnabled });
    setDialogOpen(false);
  };


  if (isLoadingAiSetting) return <CircularProgress/>;

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
