
import Sidebar from "../../components/Sidebar";
import { Button, Checkbox, } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { ManageAccounts } from "@mui/icons-material";
import { useWorkspaceData } from "../../hook/workspaces/useWorksapceData";
import { useProjecteData } from "../../hook/projects/useProjectData";
import SkeletonLayout from "../../components/SkeletonPageLayout";
import { Member, ProjectPermission } from "../../types/User";

import { useProjectAccessMutations } from "../../hook/projects/useProjectAccessMutations";
import MiniFooter from "../../components/MiniFooter";


const ProjectAccessManagePage = () => {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  const {
    workspaceDetail,
    isLoadingWorkspace,
    memberDatas,
    isLoadingMembers,
  } = useWorkspaceData();

  const {
    projectDetail,
    isLoadingProjectDetail,
    projectPermissions,
    isLoadingPermissions,

  } = useProjecteData();

  const { changePermissionMutation, toggleMemberPermissionMutation } =
  useProjectAccessMutations(workspaceId, projectId);

  
  const selectedMembers = new Set(
    projectPermissions?.map((perm:ProjectPermission) => perm.user.userId) ?? []
  );



  const handlePermissionChange = (permission: boolean) => {
    if (!workspaceId || !projectId) return;
    changePermissionMutation.mutate({ workspaceId, projectId, permission });
  };

  const handleMemberCheckboxChange = (userId: string) => {
    if (!workspaceId || !projectId) return;
    toggleMemberPermissionMutation.mutate({
      workspaceId,
      projectId,
      userId,
      hasPermission: selectedMembers.has(userId),
    });
  };

  if (isLoadingProjectDetail || isLoadingWorkspace || isLoadingPermissions || isLoadingMembers) {
    return <SkeletonLayout />;
  }

  return (
    <div className="flex h-full min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <Sidebar
      workspace={workspaceDetail}
      project={projectDetail}
      />

      {/* Content Container */}
      <div className="w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32 h-full min-h-screen">
        <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative px-5 pt-2">
          <h1 className="p-5 text-3xl font-medium tracking-tight text-indigo-900">
            <i className="bi bi-pencil-fill"></i> Project Setting
          </h1>
          <div className="w-full h-[0px] border border-zinc-300 mx-auto" />

          {/* Menu Tabs */}
          <div className="flex justify-start">
            <ul className="flex flex-wrap -mb-px">
              <li className="me-2">
                <Link
                  to={`/workspaces/${workspaceId}/project/${projectId}/setting`}
                >
                  <a className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300">
                    Edit
                  </a>
                </Link>
              </li>
              <li className="me-2">
                <Link
                  to={`/workspaces/${workspaceId}/project/${projectId}/setting/access`}
                >
                  <a className="inline-block p-4  text-blue-600 border-b-2 border-blue-600 rounded-t-lg active">
                    Access Management
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Member Access Management */}
          <div className="w-[80%] mx-auto pt-8 pb-10">
            <div className=" w-full h-fit bg-white rounded-[15px] border border-zinc-300 mx-auto pt-4  my-5">
              <h1 className="text-black text-3xl px-10 pb-4">
                รูปแบบการอนุญาตสิทธิ์การใช้งานโปรเจกต์
              </h1>
              <div className="w-full h-[0px] border border-trueGray-300 mx-auto " />
              <div className="px-10 py-6 flex items-center  justify-between w-full ">
              <div className="flex items-center space-x-4 text-xl mx-auto">
                  <label className={`w-fit h-fit bg-white rounded-[15px] border px-4 py-2 ${!projectDetail?.permission_only ? "border-blue-600 border-2" : "border-zinc-300"}`}>
                    <input type="radio" name="access" value="access_all" className="w-4 h-4"   checked={!projectDetail?.permission_only}  onChange={() => handlePermissionChange(false)} />
                    <span> อนุญาตทุกคนใน workspace</span>
                  </label>
                  <label className={`w-fit h-fit bg-white rounded-[15px] border px-4 py-2 ${projectDetail?.permission_only  ? "border-blue-600 border-2" : "border-zinc-300"}`}>
                    <input type="radio" name="access" value="only_allowed" className="w-4 h-4"  checked={projectDetail?.permission_only}  onChange={() => handlePermissionChange(true)} />
                    <span> เฉพาะ project owner และสมาชิกที่อนุญาต</span>
                  </label>
                </div>
              </div>
            </div>

            <div className=" w-full h-fit bg-white rounded-[15px] border border-zinc-300 mx-auto pt-4  my-5">
              <h1 className="text-black text-3xl px-10 pb-4">
                <ManageAccounts fontSize="large" />
                รายชื่อ Member
              </h1>
              <>
                <div className="w-full h-[0px] border border-trueGray-300 mx-auto" />
                {memberDatas.map((member:Member) => (
                  <div key={member.user.userId}>
                    <div className="px-10 py-2 flex items-center justify-between w-full">
                      {/* 🔹 Avatar + User Info */}
                      <div className="flex items-center">
                        <img
                          className="w-10 h-10 rounded-full border-2"
                          src={member.user.picture}
                          alt={member.user.name}
                        />
                        <div className="ml-2">
                          <p className="text-indigo-900 text-xl font-medium">
                            {member.user.name}
                          </p>
                          <p className="text-gray-400 text-lg">
                            Email: {member.user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {member.role === "owner" ? (
                          <span className="text-blue-600 font-bold">
                            Project Owner
                          </span>
                        ) : (
                          <Checkbox
                            disabled={!projectDetail?.permission_only}
                            checked={selectedMembers.has(member.user.userId)}
                            onChange={()=> handleMemberCheckboxChange(member.user.userId)}
                          />
                        )}
                      </div>
                    </div>
                    <div className="w-full h-[0px] border border-trueGray-300 mx-auto" />
                  </div>
                ))}
              </>
            </div>
          </div>
        </div>
      </div>
      {/* <div className=" pl-[20%] justify-end pr-12 w-full h-[12%]  bg-white border border-zinc-300 fixed bottom-0 right-0 flex items-center">
      <MiniFooter/>
      </div> */}
    </div>
  );
};

export default ProjectAccessManagePage;
