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
import CreateAiPage from './pages/CreateAiPage.tsx'
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
    element: <WorkspacePage/>,
    children:[]
  },
  {
      path: "/workspaces/:workspaceId/project-list",
    element: <ProjectListPage/>,
  },
  {
    path: "/workspaces/:workspaceId/project/:projectId/history",
  element: <ProjectHistoryPage/>,
  },
  {
    path: "/workspaces/:workspaceId/project/:projectId/detail",
  element: <ProjectDetailPage/>,
  },
  {
    path: "/workspaces/:workspaceId/history",
  element: <WorkspaceHistoryPage/>,
  },
  {
    path: "/workspaces/:workspaceId/setting/edit",
  element: <WorkspaceSettingPage/>,
  },
  {
    path: "/workspaces/:workspaceId/setting/invitation",
  element: <WorkspaceInvitationPage/>,
  },


  {
    path: "/workspaces/:workspaceId/create",
    element: <CreateProjectPage/>,
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
    element: < AdminDashboardPage/>,
  },
  {
    path: "/admin/admin-ai",
    element: <AdminAiPage/>,
  },
  
  {
    path: "/admin/createai",
    element: <CreateAiPage/>,
  },
  {
    path: "/admin/userlist",
    element: <UserListPage/>,
  },
  {
    path: "/admin/user/:userId",
    element: <UserDetailPage/>,
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
  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>,
  </ThemeProvider>
)
