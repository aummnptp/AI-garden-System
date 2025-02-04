import axios from "axios";
import AI_SETTING_ROUTES from "../routes/AiSettingRoutes";


axios.defaults.withCredentials = true;

const updateAISettingService = async (maxUsagePerDay: number, isLimitEnabled: boolean) => {
    try {
      const response = await axios.put(
        `${AI_SETTING_ROUTES.updateSetting}`,
        {
          maxUsagePerDay,
          isLimitEnabled,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating AI Setting", error);
      throw error;
    }
  };


export {updateAISettingService};