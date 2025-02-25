import { useState } from "react";
import { ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import MiniFooter from "../../components/MiniFooter";
import { getImageUrl } from "../../function/util";
import { useAiData } from "../../hook/ai/useAiData";
import { useAiRequestPermissionMutation } from "../../hook/ai/useAiRequestPermissionMutation";
import { useAiPermission } from "../../hook/ai-permission/useAiPermission";
import SkeletonLayout from "../../components/SkeletonPageLayout";

const AiDetail = () => {
  const { ai_id } = useParams<{ ai_id?: string }>();
  const { aiModelData, isLoadingAiModel } = useAiData();
  const { mutate: requestPermission } = useAiRequestPermissionMutation();
  // 🔹 State สำหรับ Dialog
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { checkPermission } = useAiPermission();


  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };


  const handleSendRequest = () => {
    if (ai_id) {
      requestPermission(ai_id);
      handleCloseConfirmDialog();
    }
  };


  if (isLoadingAiModel || !aiModelData) {
    return <SkeletonLayout />;
  }

  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        <div className="w-full ml-auto bg-neutral-100 flex flex-col items-center pb-32 h-full min-h-screen">
          <div className="mt-4 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">
            <h1 className="p-5 ml-5 mb-2 text-3xl font-medium tracking-tight text-indigo-900">
              รายละเอียด
            </h1>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto" />
          </div>
          <div className="mt-4 p-4 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">
            <div className="grid grid-cols-6">
              <img className="col-span-2 h-[100%] object-cover" src={getImageUrl(aiModelData?.imagePath)} alt="AI" />
              <div className="col-span-4 p-6">
                <div>
                  <div className="flex items-center">
                    <h1 className="mb-2 text-3xl font-medium tracking-tight text-indigo-900">{aiModelData.name}</h1>
                    <span className="ml-3 w-fit bg-indigo-600 rounded-[5px] me-2 px-2.5 py-0.5 text-white text-lg font-normal">
                      {aiModelData.ai_type}
                    </span>
                  </div>
                  <div className="w-full border border-zinc-300" />
                </div>

                <p className="text-neutral-700 text-lg font-normal">รายละเอียด</p>
                <p>{aiModelData.description}</p>

                <div className="mb-2 mt-4">
                  {aiModelData.ai_tag.map((tag: string, index: number) => (
                    <span key={index} className="w-fit bg-indigo-400 rounded-[5px] me-2 px-2.5 py-0.5 text-white text-lg font-normal">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 ml-3">
              <ExclamationCircleOutlined style={{ color: "#404040" }} />
              <span className="text-neutral-700 text-lg font-normal">
                เกี่ยวกับรูปภาพและวิดีโอที่จะนำไปประมวลผล
              </span>
            </div>
            <p className="ml-3">{aiModelData.input_desc}</p>

            <div className="flex items-center mt-10 mb-5">
              <div className="mx-1 w-12 h-12 bg-indigo-900 rounded-[5px] flex items-center justify-center">
                <UploadOutlined style={{ color: "#fff", fontSize: "2em" }} />
              </div>
              <div className="ml-3 w-full">
                <h1 className="text-indigo-900 text-2xl font-medium mb-[-10px]">การใช้งาน</h1>
                <div className="mt-6 w-full border border-zinc-300" />
              </div>
            </div>

            <div className="w-full px-10">
              <Link to={`/ai/${ai_id}/demo`}>
                <Button variant="contained" size="large" sx={{ my: "5px", mr: "10px", backgroundColor: "#4f46e5", "&:hover": { backgroundColor: "#3730a3" } }}>
                  ทดลองใช้งาน
                </Button>
              </Link>
              <Button
                onClick={handleOpenConfirmDialog}
                variant="contained"
                size="large"
                disabled={checkPermission?.hasPermission ?? false}  // ปิดปุ่มถ้าเคยขอสิทธิ์แล้ว
                sx={{ my: "5px", backgroundColor: "#4f46e5", "&:hover": { backgroundColor: "#3730a3" } }}
              >
                {checkPermission?.hasPermission ? "ขอสิทธิ์แล้ว" : "ส่งคำขอใช้งาน"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>ยืนยันการส่งคำขอ</DialogTitle>
        <DialogContent>
          <Typography>คุณต้องการส่งคำขอใช้งาน AI นี้ใช่หรือไม่?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="secondary">ยกเลิก</Button>
          <Button onClick={handleSendRequest} color="primary" variant="contained">ยืนยัน</Button>
        </DialogActions>
      </Dialog>

      <MiniFooter />
    </>
  );
};

export default AiDetail;
