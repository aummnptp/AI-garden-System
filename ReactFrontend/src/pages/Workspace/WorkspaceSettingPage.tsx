import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { Close, } from "@mui/icons-material";
import { useWorkspaceData } from "../../hook/workspaces/useWorkspaceData";
import SkeletonLayout from "../../components/SkeletonPageLayout";
import { useWorkspaceMutations } from "../../hook/workspaces/useWorkspaceMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { workspaceSchema, WorkspaceSchemaType } from "../../validations/workspaceSchema";




const WorkspaceSettingPage = () => {
  const {workspaceId} = useParams<{ workspaceId?: string, projectId?: string }>();
  const [open, setOpen] = React.useState(false);
  const [confirmText, setConfirmText] = useState(""); // สร้าง state สำหรับการเก็บค่าที่ผู้ใช้กรอก


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WorkspaceSchemaType>({
    resolver: zodResolver(workspaceSchema),
  });

  const { workspaceDetail, isLoadingWorkspace, } = useWorkspaceData();
  const { updateWorkspaceMutation, deleteWorkspaceMutation } =
    useWorkspaceMutations(workspaceId);

    useEffect(() => {
      if (workspaceDetail) {
        setValue("name", workspaceDetail.name);
        setValue("description", workspaceDetail.description);
      }
    }, [workspaceDetail, setValue]);

    const onSubmit = (data: { name: string; description: string }) => {
      updateWorkspaceMutation.mutate({
        workspaceId: workspaceId ?? "",
        name: data.name,
        description: data.description,
      });
    };

  const handleModalDelete = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setConfirmText("");
  };

  const handleDelete = () => {
    deleteWorkspaceMutation.mutate({ workspaceId: workspaceId ?? "" });
  };

  const isDeleteDisabled = confirmText !== workspaceDetail?.name;

  if (isLoadingWorkspace) return <SkeletonLayout />;
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex h-full min-h-screen bg-neutral-100">
        {/* confirm modal delete */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ textAlign: "center", padding: "20px" }}>
            <div className="p-1 border-red-600 border-2  rounded-full w-fit h-fit flex justify mx-auto">
              {/* <Delete sx={{ fontSize: 40, color: 'red' }} /> */}
              <Close sx={{ fontSize: 40, color: "red" }} />
            </div>

            <DialogTitle
              id="alert-dialog-title"
              sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
            >
              Delete Workspace
            </DialogTitle>
            <Typography
              variant="body1"
              sx={{ marginBottom: "20px", color: "#555" }}
            >
            Delete <strong>"{workspaceDetail?.name}"</strong> from workspace list?
            </Typography>
            <Typography
              variant="body1"
              sx={{ marginBottom: "20px", color: "#555" }}
            >
            To confirm, type <strong>"{workspaceDetail?.name}"</strong> in the box
            </Typography>
            <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}  // อัปเดต confirmText เมื่อผู้ใช้พิมพ์
          className="w-full p-2 border border-gray-300 rounded-lg no-spinner focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        />
          </Box>
          <DialogActions sx={{ padding: "30px" }}>
            <Button variant="outlined" color="info" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleDelete();
                handleClose();
              }}
              autoFocus
              disabled={isDeleteDisabled}  
            >
              Delete{" "}
            </Button>
          </DialogActions>
        </Dialog>
        {/* side bar */}
        <Sidebar workspace={workspaceDetail} />

        {/* content container */}
        <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
          <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative px-5 pt-2">
            <h1
              className="p-5  text-3xl font-medium tracking-tight 
          text-indigo-900 "
            >
             <i className="bi bi-pencil-fill"></i>  Workspace Setting
            </h1>
            <div className="w-full h-[0px] border border-zinc-300 mx-auto" />
            <div className="flex justify-start  ">
              {/* sticky top-[10%] bg-white w-full z-50 */}
              <ul className="flex flex-wrap -mb-px">
                <li className="me-2">
                  <Link to={`/workspaces/${workspaceId}/setting/edit`}>
                    <a
                      className="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active "
                      aria-current="page"
                    >
                      Edit
                    </a>
                  </Link>
                </li>
                <li className="me-2">
                  <Link to={`/workspaces/${workspaceId}/setting/invitation`}>
                    <a
                      href="#"
                      className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 "
                    >
                      Team Member
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
       
            {/* <div className="w-full h-[0px] border border-zinc-300 mx-auto" /> */}
          <div  className="w-[80%] mx-auto pt-8 pb-10">
              <label className="mx-auto flex-col flex text-black text-2xl mb-2  ">
                Workspace name
              </label>
              <div className="mx-auto flex-col flex text-black text-2xl mb-10">
                <TextField
                  id="standard-number"
                  placeholder="workspace name"
                  defaultValue={"Workspace Name"}
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </div>
              <label className="mx-auto flex-col flex text-black text-2xl mb-2 ">
                {" "}
                description
              </label>
              <div className="mx-auto flex-col flex text-black text-2xl">
                <TextField
                  id="standard-number"
                  placeholder="workspace description"
                  multiline
                  rows={4}
                  {...register("description")}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </div>
            </div>
          </div>
        </div>

        <div className=" pl-[20%] justify-between pr-12 w-full h-[12%]  bg-white border border-zinc-300 fixed bottom-0 right-0 flex items-center">
          <Button
            variant="contained"
            color="error"
            size="large"
            style={{ marginRight: "0.5rem" }}
            onClick={handleModalDelete}
          >
            Delete Workspace
          </Button>

          <Button
            size="large"
            variant="contained"
            sx={{
              backgroundColor: "#4f46e5",
              "&:hover": { backgroundColor: "#3730a3" },
            }}
            style={{ marginRight: "0.5rem" }}
           type="submit" 
          >
            Save
          </Button>
        </div>
        
    </form>
    </>
  );
};

export default WorkspaceSettingPage;
