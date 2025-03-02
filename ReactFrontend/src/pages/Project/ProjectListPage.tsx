import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import ProjectCard from "../../components/card/ProjectCard";
import MiniFooter from "../../components/MiniFooter";
import Sidebar from "../../components/Sidebar";
import { useWorkspaceData } from "../../hook/workspaces/useWorkspaceData";
import { ProjectDataType } from "../../types/Project";
import { useProjecteData } from "../../hook/projects/useProjectData";
import SkeletonLayout from "../../components/SkeletonPageLayout";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const ProjectListPage = () => {
  const { workspaceId } = useParams();

  const { projectData, isLoadingProjects, } =
    useProjecteData();

  const { workspaceDetail, isLoadingWorkspace,  } =
    useWorkspaceData();
    const { isAdmin, isOwner } = useAuth();

    const [isWorkspaceOwner, setIsWorkspaceOwner] = useState<boolean>(false);
    useEffect(() => {
      if (workspaceId) {
        isOwner(workspaceId).then(setIsWorkspaceOwner); 
      }
    }, [workspaceId, isOwner]);
  if (isLoadingProjects || isLoadingWorkspace) return <SkeletonLayout />;


  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        {/* side bar */}
        <Sidebar workspace={workspaceDetail} />
        
        {/* content container */}
        <div className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32 h-full min-h-screen">
          <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative">
            <h1 className="p-5 ml-5 mb-2 text-3xl font-medium tracking-tight text-indigo-900">
              {workspaceDetail.name}
            </h1>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto" />
            <div className="m-6 flex justify-end">
              {(isAdmin || isWorkspaceOwner) && (
                <Link to={`/workspaces/${workspaceId}/create`}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#4f46e5",
                      "&:hover": {
                        backgroundColor: "#3730a3",
                      },
                    }}
                  >
                    + Create Project
                  </Button>
                </Link>
              )}
            </div>
          </div>
  
          {/* ส่วนแสดงรายการโครงการ */}
          <div className="py-10 mt-4 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative">
            {projectData.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {projectData.map((data: ProjectDataType) => (
                  <Link
                    key={data.projectId}
                    to={`/workspaces/${workspaceId}/project/${data.projectId}/detail`}
                  >
                    <ProjectCard
                      name={data.name}
                      desc={data.description}
                      projectImage={data.imagePath}
                      ai_tags={data.ai_model.ai_tag}
                      ai_type={data.ai_model.ai_type}
                      enable={data.ai_model.enable}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p className="text-lg">No project here in this workspace</p>
                {(isAdmin || isWorkspaceOwner) && (
                  <Link to={`/workspaces/${workspaceId}/create`}>
                    <Button variant="contained" sx={{ mt: 2, backgroundColor: "#4f46e5" }}>
                      + Create Project
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <MiniFooter />
    </>
  );
  
};

export default ProjectListPage;
