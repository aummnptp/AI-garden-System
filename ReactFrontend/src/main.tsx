import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import { createBrowserRouter,RouterProvider,Route ,Link } from 'react-router-dom'



// pag import
import WorkspacePage from './pages/Workspace/WorkspacePage.tsx'
import HomePage from './pages/HomePage.tsx'
import ProjectListPage from './pages/Project/ProjectListPage.tsx'
import CreateProjectPage from './pages/Project/CreateProjectPage.tsx'
import ProjectDetailPage from './pages/Project/ProjectDetailPage.tsx'
import WorkspaceHistoryPage from './pages/Workspace/WorkspaceHistoryPage.tsx'
import WorkspaceSettingPage from './pages/Workspace/WorkspaceSettingPage.tsx'
import AdminDashboardPage from './pages/Admin/AdminDashboardPage.tsx'
import CreateAiPage from './pages/Admin/CreateAiPage.tsx'
import UpdateAiPage from './pages/Admin/UpdateAiPage.tsx'
import AdminAiPage from './pages/Admin/AdminAiPage.tsx'
import PredictAiModelPage from './pages/PredictAiModelPage.tsx'
import PredictionResultPage from './pages/PredictionResultPage.tsx';
import DocsPage from './pages/DocsPage.tsx'
import AiDetailPage from './pages/Ai/AiDetailPage.tsx'
import WorkspaceInvitationPage from './pages/Workspace/WorkspaceInvitationPage.tsx'
import ProjectHistoryPage from './pages/Project/ProjectHistoryPage.tsx'
import AIlistPage from './pages/Ai/AiListPage.tsx'
import AIDemoPage from './pages/Ai/AIDemoPage.tsx'
import UserListPage from './pages/Admin/UserListPage.tsx'

import Layout from './Layout.tsx'
import { createTheme, ThemeProvider } from '@mui/material'
import ProjectSetting from './pages/Project/ProjectSettingPage.tsx'
import ProjectAccessManagePage from './pages/Project/ProjectAccessManagePage.tsx'
import UserDetailPage from './pages/Admin/UserDetailPage.tsx'
import Videotest from './pages/Videotest.tsx'
import RoleGuard from './components/auth/RoleGurad.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import WorkspaceRoleGuard from './components/auth/WorkspaceRoleGuard.tsx'



const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: "75px", // ปรับขนาดปุ่ม
          fontWeight: "bold", // ตัวอักษรหนา
          borderRadius: "20px", // มุมมน
          // borderRadius: '30px',
          textTransform: "none", // ไม่ใช้ตัวพิมพ์ใหญ่ทั้งหมด
          marginLeft: "10px", // ระยะห่างจากปุ่มอื่นๆ
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // borderRadius: "20px", // มุมมน
        },
      },
    },
  },
});

//  React router path here
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,  // Set Layout as the main element
    children: [
  {
    path: "/",
    element: <HomePage/>,
  },
  {
    path: "/docs",
    element: <DocsPage/>,
  },
  {
    path: "/workspaces",
    element: <RoleGuard requiredRole="user"><WorkspacePage/></RoleGuard>,
    children:[]
  },
  {
      path: "/workspaces/:workspaceId/project-list",
    element:  <RoleGuard requiredRole="user"><ProjectListPage/></RoleGuard>,
  },
  {
    path: "/workspaces/:workspaceId/project/:projectId/history",
  element:  <RoleGuard requiredRole="user"><ProjectHistoryPage/></RoleGuard>,
  },
  {
    path: "/workspaces/:workspaceId/project/:projectId/detail",
  element: <RoleGuard requiredRole="user"> <ProjectDetailPage/></RoleGuard>,
  },
  {
    path: "/workspaces/:workspaceId/history",
  element: <RoleGuard requiredRole="user"> <WorkspaceHistoryPage/></RoleGuard>,
  },
  {
    path: "/workspaces/:workspaceId/setting/edit",
  element: <WorkspaceRoleGuard requiredRole="owner"><WorkspaceSettingPage/></WorkspaceRoleGuard>,
  },
  {
    path: "/workspaces/:workspaceId/setting/invitation",
  element:  <WorkspaceRoleGuard requiredRole="owner"><WorkspaceInvitationPage/></WorkspaceRoleGuard>,
  },


  {
    path: "/workspaces/:workspaceId/create",
    element:  <CreateProjectPage/>,
  },
  {
    path: "/workspaces/:workspaceId/project/:projectId/setting",
    element: <ProjectSetting/>,
  },
  {
    path: "/workspaces/:workspaceId/project/:projectId/setting/access",
    element: <ProjectAccessManagePage/>,
  },
  {
    path: "/workspaces/:workspaceId/project/:projectId/detail/test/:modelId",
    element: <PredictAiModelPage/>,
  },
  {
    path: "/workspaces/:workspaceId/project/:projectId/detail/test/:modelId/result",
    element: <PredictionResultPage />,
  },
  {
    path: "/ai-list",
    element: <AIlistPage/>,
  },
  {
    path: "/ai/:ai_id/detail",
    element: <AiDetailPage/>,
  },
  {
    path: "/ai/:ai_id/demo",
    element: <AIDemoPage/>,
  },
  {
    path: "/admin/dashboard",
    element: <RoleGuard requiredRole="admin">< AdminDashboardPage/></RoleGuard>,
  },
  {
    path: "/admin/admin-ai",
    element: <RoleGuard requiredRole="admin"> <AdminAiPage/></RoleGuard>,
  },
  
  {
    path: "/admin/createai",
    element: <RoleGuard requiredRole="admin"><CreateAiPage/></RoleGuard>,
  },

  {
    path: "/admin/updateai/:ai_id",
    element: <RoleGuard requiredRole="admin"><UpdateAiPage/></RoleGuard>,
  },

  {
    path: "/admin/userlist",
    element: <RoleGuard requiredRole="admin"><UserListPage/></RoleGuard>,
  },
  {
    path: "/admin/user/:userId",
    element: <RoleGuard requiredRole="admin"><UserDetailPage/></RoleGuard>,
  },

  {
    path: "/videotest",
    element: <Videotest/>,
  },


  ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
     <AuthProvider>

  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>,
     </AuthProvider>
  </ThemeProvider>
)
