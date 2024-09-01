import React from 'react'
import ReactDOM from 'react-dom/client'


import Workspace from './pages/User/Workspace/Workspace.tsx'

import './index.css'
import { createBrowserRouter,RouterProvider,Route ,Link } from 'react-router-dom'

// pag import
import Home from './pages/Home.tsx'
import Nav from './components/Nav.tsx'
import ProjectList from './pages/User/Project/ProjectList.tsx'
import AIlist from './pages/AiList.tsx'
import CreateProject from './pages/User/CreateProject.tsx'
import ProjectDetail from './pages/User/Project/ProjectDetail.tsx'
import WorkspaceHistory from './pages/User/Workspace/WorkspaceHistory.tsx'
import WorkspaceSetting from './pages/User/Workspace/WorkspaceSetting.tsx'

import AdminDashboard from './pages/Ai/AdminDashboard.tsx'
import CreateAi from './pages/CreateAi.tsx'
import AdminAi from './pages/Ai/AdminAi.tsx'
import PredictAiModel from './pages/PredictAiModel.tsx'
import PredictionResult from './pages/PredictionResult.tsx';
import Docs from './pages/Docs.tsx'
import AiDetail from './pages/Ai/AiDetail.tsx'
import WorkspaceInvitation from './pages/User/Workspace/WorkspaceInvitation.tsx'
//  React router path here
const router = createBrowserRouter([
  
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
    path: "/workspaces/:workspaceId/project-list/:projectId/detail",
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
    path: "/ai-list/detail",
    element: <AiDetail/>,
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

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Nav/>
      <RouterProvider router={router}/>
  </React.StrictMode>,
)
