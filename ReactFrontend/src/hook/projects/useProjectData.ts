import { useQuery } from "@tanstack/react-query";
import { fetchProjectDetailService, fetchProjectPermissionsService, fetchProjectsService, fetchStatistic } from "../../api/services/ProjectService";
import { useParams } from "react-router-dom";

export const useProjecteData = () => {
  const { workspaceId, projectId } = useParams<{ workspaceId: string; projectId: string }>();
  const {
    data: projectDetail,
    isLoading: isLoadingProjectDetail,
    isError: isErrorProjectDetail,
    refetch: refetchProject,
  } = useQuery({
    queryKey: ["project-detail", workspaceId, projectId],
    queryFn: () => fetchProjectDetailService(workspaceId!, projectId!),
    enabled: !!workspaceId && !!projectId,
  });

  const {
    data: projectData,
    isLoading: isLoadingProjects,
    isError: errorProjects,
    refetch: refetchProjects,
  } = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => fetchProjectsService(workspaceId!),
    enabled: !!workspaceId ,
  });

  const {
    data: projectPermissions,
    isLoading: isLoadingPermissions,
    isError: isErrorPermissions,
    refetch: refetchPermissions,
  } = useQuery({
    queryKey: ["project-permissions", projectId],
    queryFn: () => fetchProjectPermissionsService(workspaceId!, projectId!),
    enabled: !!workspaceId && !!projectId, 
  });

  const {
    data: statisticData,
    isLoading: isLoadingStatistic,
    isError: errorStatistic,
    refetch: refetchStatistic,
  } = useQuery({
    queryKey: ["project-statistic",  workspaceId, projectId],
    queryFn: () => fetchStatistic(workspaceId!, projectId!),
    enabled: !!workspaceId && !!projectId,
  });
  
  return {

    projectDetail,
    isLoadingProjectDetail,
    isErrorProjectDetail,
    refetchProject,

    projectData,
    isLoadingProjects,
    errorProjects,
    refetchProjects,

    projectPermissions,
    isLoadingPermissions,
    isErrorPermissions,
    refetchPermissions,

    statisticData,
    isLoadingStatistic,
    errorStatistic,
    refetchStatistic,
  };
};
