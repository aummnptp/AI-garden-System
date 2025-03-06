import { createBrowserRouter } from "react-router-dom";

// page import
import WorkspacePage from "../pages/Workspace/WorkspacePage.tsx";
import HomePage from "../pages/HomePage.tsx";
import ProjectListPage from "../pages/Project/ProjectListPage.tsx";
import CreateProjectPage from "../pages/Project/CreateProjectPage.tsx";
import ProjectDetailPage from "../pages/Project/ProjectDetailPage.tsx";
import WorkspaceHistoryPage from "../pages/History/WorkspaceHistoryPage.tsx";
import WorkspaceSettingPage from "../pages/Workspace/WorkspaceSettingPage.tsx";
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage.tsx";
import CreateAiPage from "../pages/Admin/CreateAiPage.tsx";
import UpdateAiPage from "../pages/Admin/UpdateAiPage.tsx";
import AdminAiPage from "../pages/Admin/AdminAiPage.tsx";
import WorkspaceListPage from "../pages/Admin/WorkspaceListPage.tsx";

import DocsPage from "../pages/DocsPage.tsx";
import AiDetailPage from "../pages/Ai/AiDetailPage.tsx";
import WorkspaceInvitationPage from "../pages/Workspace/WorkspaceInvitationPage.tsx";
import ProjectHistoryPage from "../pages/History/ProjectHistoryPage.tsx";
import AIlistPage from "../pages/Ai/AiListPage.tsx";
import AIDemoPage from "../pages/Ai/AIDemoPage.tsx";
import UserListPage from "../pages/Admin/UserListPage.tsx";

import Layout from "../Layout.tsx";
import ProjectSetting from "../pages/Project/ProjectSettingPage.tsx";
import ProjectAccessManagePage from "../pages/Project/ProjectAccessManagePage.tsx";
import UserDetailPage from "../pages/Admin/UserDetailPage.tsx";
import RoleGuard from "../components/auth/RoleGurad.tsx";
import WorkspaceRoleGuard from "../components/auth/WorkspaceRoleGuard.tsx";
import HistoryDetailPage from "../pages/History/HistoryDetailPage.tsx";
import InvitedPage from "../pages/Workspace/InvitedPage.tsx";
import ProjectPermissionGuard from "../components/auth/ProjectPermissionGuard.tsx";
import PredictAiModelPage from "../pages/Project/ProjectPredictAiModelPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },

      {
        path: "/docs",
        element: (
          <RoleGuard requiredRole="user">
            <DocsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/docs/:docsId",
        element: (
          <RoleGuard requiredRole="user">
            <DocsPage />
          </RoleGuard>
        ),
      },
      {
        path: "/docs/:docsId/:subDocsId",
        element: (
          <RoleGuard requiredRole="user">
            <DocsPage />
          </RoleGuard>
        ),
      },

      {
        path: "/invite",
        element: <InvitedPage />,
      },
      {
        path: "/workspaces",
        element: (
          <RoleGuard requiredRole="user">
              <WorkspacePage />
          </RoleGuard>
        ),
        children: [],
      },
      {
        path: "/workspaces/:workspaceId/project-list",
        element: (
          <RoleGuard requiredRole="user">
            <WorkspaceRoleGuard requiredRole="member">
              <ProjectListPage />
            </WorkspaceRoleGuard>
          </RoleGuard>
        ),
      },
      {
        path: "/workspaces/:workspaceId/project/:projectId/history",
        element: (
          <RoleGuard requiredRole="user">
            <WorkspaceRoleGuard requiredRole="member">
              <ProjectPermissionGuard>
                <ProjectHistoryPage />
              </ProjectPermissionGuard>
            </WorkspaceRoleGuard>
          </RoleGuard>
        ),
      },
      {
        path: "/workspaces/:workspaceId/project/:projectId/history/detail/:historyId",
        element: (
          <RoleGuard requiredRole="user">
            <WorkspaceRoleGuard requiredRole="member">
              <ProjectPermissionGuard>
                <HistoryDetailPage />
              </ProjectPermissionGuard>
            </WorkspaceRoleGuard>
          </RoleGuard>
        ),
      },
      {
        path: "/workspaces/:workspaceId/project/:projectId/detail",
        element: (
          <RoleGuard requiredRole="user">
            <WorkspaceRoleGuard requiredRole="member">
              <ProjectPermissionGuard>
                <ProjectDetailPage />
              </ProjectPermissionGuard>
            </WorkspaceRoleGuard>
          </RoleGuard>
        ),
      },
      {
        path: "/workspaces/:workspaceId/history",
        element: (
          <RoleGuard requiredRole="user">
            <WorkspaceRoleGuard requiredRole="member">
              <WorkspaceHistoryPage />
            </WorkspaceRoleGuard>
          </RoleGuard>
        ),
      },
      {
        path: "/workspaces/:workspaceId/setting/edit",
        element: (
          <RoleGuard requiredRole="user">
            <WorkspaceRoleGuard requiredRole="owner">
              <WorkspaceSettingPage />
            </WorkspaceRoleGuard>
          </RoleGuard>
        ),
      },
      {
        path: "/workspaces/:workspaceId/setting/invitation",
        element: (
          <RoleGuard requiredRole="user">
            <WorkspaceRoleGuard requiredRole="owner">
              <WorkspaceInvitationPage />
            </WorkspaceRoleGuard>
          </RoleGuard>
        ),
      },

      {
        path: "/workspaces/:workspaceId/create",
        element: (
          <RoleGuard requiredRole="user">
            <WorkspaceRoleGuard requiredRole="owner">
              <CreateProjectPage />
            </WorkspaceRoleGuard>
          </RoleGuard>
        ),
      },
      {
        path: "/workspaces/:workspaceId/project/:projectId/setting",
        element: (
          <RoleGuard requiredRole="user">
            <WorkspaceRoleGuard requiredRole="owner">
              <ProjectSetting />
            </WorkspaceRoleGuard>
          </RoleGuard>
        ),
      },
      {
        path: "/workspaces/:workspaceId/project/:projectId/setting/access",
        element: (
          <RoleGuard requiredRole="user">
            <WorkspaceRoleGuard requiredRole="owner">
              <ProjectAccessManagePage />
            </WorkspaceRoleGuard>
          </RoleGuard>
        ),
      },
      {
        path: "/workspaces/:workspaceId/project/:projectId/predict",
        element: (
          <RoleGuard requiredRole="user">
            <WorkspaceRoleGuard requiredRole="member">
              <ProjectPermissionGuard>
                <PredictAiModelPage />
              </ProjectPermissionGuard>
            </WorkspaceRoleGuard>
          </RoleGuard>
        ),
      },

      {
        path: "/ai-list",
        element: (
          <RoleGuard requiredRole="user">
            <AIlistPage />
          </RoleGuard>
        ),
      },
      {
        path: "/ai/:ai_id/detail",
        element: (
          <RoleGuard requiredRole="user">
            <AiDetailPage />
          </RoleGuard>
        ),
      },
      {
        path: "/ai/:ai_id/demo",
        element: (
          <RoleGuard requiredRole="user">
            <AIDemoPage />
          </RoleGuard>
        ),
      },
      {
        path: "/admin/dashboard",
        element: (
          <RoleGuard requiredRole="admin">
            <AdminDashboardPage />
          </RoleGuard>
        ),
      },
      {
        path: "/admin/admin-ai",
        element: (
          <RoleGuard requiredRole="admin">
            <AdminAiPage />
          </RoleGuard>
        ),
      },

      {
        path: "/admin/createai",
        element: (
          <RoleGuard requiredRole="admin">
            <CreateAiPage />
          </RoleGuard>
        ),
      },
      {
        path: "/admin/workspace",
        element: (
          <RoleGuard requiredRole="admin">
            <WorkspaceListPage />
          </RoleGuard>
        ),
      },

      {
        path: "/admin/updateai/:ai_id",
        element: (
          <RoleGuard requiredRole="admin">
            <UpdateAiPage />
          </RoleGuard>
        ),
      },

      {
        path: "/admin/userlist",
        element: (
          <RoleGuard requiredRole="admin">
            <UserListPage />
          </RoleGuard>
        ),
      },
      {
        path: "/admin/user/:userId",
        element: (
          <RoleGuard requiredRole="admin">
            <UserDetailPage />
          </RoleGuard>
        ),
      },
    ],
  },
]);
