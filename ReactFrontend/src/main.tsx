import React from 'react'
import ReactDOM from 'react-dom/client'


import Workspace from './pages/Workspace/Workspace.tsx'

import './index.css'
import { createBrowserRouter,RouterProvider,Route ,Link } from 'react-router-dom'

// pag import
import Home from './pages/Home.tsx'
import Nav from './components/Nav.tsx'
import ProjectList from './pages/Project/ProjectList.tsx'

import CreateProject from './pages/Project/CreateProject.tsx'
import ProjectDetail from './pages/Project/ProjectDetail.tsx'
import WorkspaceHistory from './pages/Workspace/WorkspaceHistory.tsx'
import WorkspaceSetting from './pages/Workspace/WorkspaceSetting.tsx'

import AdminDashboard from './pages/Admin/AdminDashboard.tsx'
import CreateAi from './pages/CreateAi.tsx'
import AdminAi from './pages/Admin/AdminAi.tsx'
import PredictAiModel from './pages/PredictAiModel.tsx'
import PredictionResult from './pages/PredictionResult.tsx';
import Docs from './pages/Docs.tsx'
import AiDetail from './pages/Ai/AiDetail.tsx'
import WorkspaceInvitation from './pages/Workspace/WorkspaceInvitation.tsx'
import ProjectHistory from './pages/Project/ProjectHistory.tsx'
import CustomInput from './pages/CustomInput.tsx'
import Layout from './Layout.tsx'
import AIlist from './pages/Ai/AiList.tsx'
import AIDemo from './pages/Ai/AIDemo.tsx'




//  React router path here
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,  // Set Layout as the main element
    children: [
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/docs",
    element: <Docs/>,
  },
  {
    path: "/workspaces",
    element: <Workspace/>,
    children:[]
  },
  {
      path: "/workspaces/:workspaceId/project-list",
    element: <ProjectList/>,
  },
  {
    path: "/workspaces/:workspaceId/project/:projectId/history",
  element: <ProjectHistory/>,
  },
  {
    path: "/workspaces/:workspaceId/project/:projectId/detail",
  element: <ProjectDetail/>,
  },
  {
    path: "/workspaces/:workspaceId/history",
  element: <WorkspaceHistory/>,
  },
  {
    path: "/workspaces/:workspaceId/setting/edit",
  element: <WorkspaceSetting/>,
  },
  {
    path: "/workspaces/:workspaceId/setting/invitation",
  element: <WorkspaceInvitation/>,
  },


  {
    path: "/workspaces/:workspaceId/create",
    element: <CreateProject/>,
  },
  {
    path: "/workspaces/:workspaceId/project-list/:workspaceId/detail/test/:modelId",
    element: <PredictAiModel/>,
  },
  {
    path: "/workspaces/:workspaceId/project-list/:workspaceId/detail/test/:modelId/result",
    element: <PredictionResult />,
  },
  {
    path: "/ai-list",
    element: <AIlist/>,
  },
  {
    path: "/ai/:ai_id/detail",
    element: <AiDetail/>,
  },
  {
    path: "/ai/:ai_id/demo",
    element: <AIDemo/>,
  },
  {
    path: "/admin/dashboard",
    element: < AdminDashboard/>,
  },
  {
    path: "/admin/admin-ai",
    element: <AdminAi/>,
  },
  
  {
    path: "/admin/createai",
    element: <CreateAi/>,
  },

  {
    path: "/customInput",
    element: <CustomInput/>,
  },
  ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>,
)
