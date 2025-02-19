import React, { ChangeEvent, DragEvent, useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import ProjectImageInput from "../../components/input/ProjectImageInput";
import { Close } from "@mui/icons-material";

import { useProjecteData } from "../../hook/projects/useProjectData";
import { useWorkspaceData } from "../../hook/workspaces/useWorksapceData";
import SkeletonLayout from "../../components/SkeletonPageLayout";
import { useProjectMutations } from "../../hook/projects/useProjectMutations";

const ProjectSetting = () => {
  let { workspaceId, projectId } = useParams();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [inputType, setInputType] = useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [confirmText, setConfirmText] = useState(""); 
  const [image, setImage] = useState<File | null>(null);

  const { workspaceDetail, isLoadingWorkspace, } =
    useWorkspaceData();
  const { projectDetail, isLoadingProjectDetail, } =
    useProjecteData();

const { updateProjectMutation, deleteProjectMutation } = useProjectMutations(workspaceId, projectId);

  useEffect(() => {
    if (projectDetail) {
      setName(projectDetail.name);
      setDescription(projectDetail.description);
      setImage(projectDetail.image_path);
      setInputType(projectDetail.input_type);
    }
  }, [projectDetail]);


  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setImage(file);
  };
  //
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };
  //
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSave = () => {
    if (!workspaceId || !projectId) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("input_type", inputType);
    if (image) {
      formData.append("file", image);
    }

    updateProjectMutation.mutate({ workspaceId, projectId, formData });
  };

  const handleDelete = () => {
    if (!workspaceId || !projectId) return;
    deleteProjectMutation.mutate({ workspaceId, projectId });
  };

  const handleModalDelete = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isDeleteDisabled = confirmText !== name;
  if (isLoadingProjectDetail || isLoadingWorkspace) return <SkeletonLayout />;
  return (
    <div className="flex h-full min-h-screen bg-neutral-100">
      {/* confirm modal delete */}

      {/* side bar */}
      <Sidebar workspace={workspaceDetail} project={projectDetail} />

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
            Delete Project
          </DialogTitle>
          <Typography
            variant="body1"
            sx={{ marginBottom: "20px", color: "#555" }}
          >
            Delete a <strong>"{name}"</strong> from project list?
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginBottom: "20px", color: "#555" }}
          >
            To confirm, type <strong>"{name}"</strong> to in the box
          </Typography>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)} // อัปเดต confirmText เมื่อผู้ใช้พิมพ์
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
      {/* content container */}
      <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
        <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative px-5 pt-2">
          <h1
            className="p-5  text-3xl font-medium tracking-tight 
        text-indigo-900 "
          >
            <i className="bi bi-pencil-fill"></i> Project Setting
          </h1>
          <div className="w-full h-[0px] border border-zinc-300 mx-auto" />
          <div className="flex justify-start  ">
            {/* sticky top-[10%] bg-white w-full z-50 */}
            <ul className="flex flex-wrap -mb-px">
              <li className="me-2">
                <Link
                  to={`/workspaces/${workspaceId}/project/${projectId}/setting`}
                >
                  <a
                    className="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active "
                    aria-current="page"
                  >
                    Edit
                  </a>
                </Link>
              </li>
              <li className="me-2">
                <Link
                  to={`/workspaces/${workspaceId}/project/${projectId}/setting/access`}
                >
                  <a
                    href="#"
                    className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 "
                  >
                    Access Management
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex pt-8">
            <div className="w-[30%] border rounded-[5px] border-gray-300  mx-auto  pt-8 pb-10 px-10 ">
              <label className="mx-auto flex text-black text-2xl mb-2 gap-1  ">
                <i className="bi bi-image"></i> Project image
              </label>

              <div className="w-full flex py-2">
                <ProjectImageInput
                  image={image}
                  setImage={setImage}
                  handleFileSelect={handleFileSelect}
                  handleDrop={handleDrop}
                  handleDragOver={handleDragOver}
                />
              </div>
            </div>
            <div className=" w-[70%] mx-auto items-center pt-8 pb-10   border rounded-[5px] border-gray-300 px-10">
              <label className="mx-auto flex-col flex text-black text-2xl mb-2  ">
                Project name
              </label>
              <div className="mx-auto flex-col flex text-black text-2xl mb-4">
                <TextField
                  id="standard-number"
                  placeholder="project name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <FormControl>
                <label className=" flex-col flex text-black text-2xl mb-4 ">
                  Project Type
                  <RadioGroup
                    value={inputType}
                    onChange={(e) => setInputType(e.target.value)}
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="รูปภาพและวิดีโอ "
                      control={<Radio />}
                      label="รูปภาพ และ วิดีโอ "
                    />
                    <FormControlLabel
                      value="รูปภาพ"
                      control={<Radio />}
                      label="รูปภาพ"
                    />
                    <FormControlLabel
                      value="วิดีโอ"
                      control={<Radio />}
                      label="วิดีโอ"
                    />
                  </RadioGroup>
                </label>
              </FormControl>
              <label className="mx-auto flex-col flex text-black text-2xl mb-2 ">
                {" "}
                Project description
              </label>
              <div className="mx-auto flex-col flex text-black text-2xl">
                <TextField
                  id="standard-number"
                  placeholder="project description"
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
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
          Delete Project
        </Button>

        <Button
          size="large"
          variant="contained"
          sx={{
            backgroundColor: "#4f46e5",
            "&:hover": { backgroundColor: "#3730a3" },
          }}
          style={{ marginRight: "0.5rem" }}
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default ProjectSetting;
