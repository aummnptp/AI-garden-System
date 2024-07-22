import React from 'react'
import ReactDOM from 'react-dom/client'


import Workspace from './pages/Workspace.tsx'

import './index.css'
import { createBrowserRouter,RouterProvider,Route ,Link } from 'react-router-dom'

// pag import
import Home from './pages/Home.tsx'
import Nav from './components/Nav.tsx'
import ProjectList from './pages/ProjectList.tsx'
import AIlist from './pages/AiList.tsx'
import CreateProject from './pages/CreateProject.tsx'
import ProjectDetail from './pages/ProjectDetail.tsx'
import WorkspaceHistory from './pages/WorkspaceHistory.tsx'
import WorkspaceSetting from './pages/WorkspaceSetting.tsx'

import Admin from './pages/Admin.tsx'
import CreateAi from './pages/CreateAi.tsx'
import AdminAi from './pages/AdminAi.tsx'
import PredictAiModel from './pages/PredictAiModel.tsx'
import PredictionResult from './pages/PredictionResult.tsx';
//  React router path here
const router = createBrowserRouter([
  
  {
    path: "/",
    element: <Home/>,
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
    path: "/workspaces/:workspaceId/project-list/:ProjectId/detail",
  element: <ProjectDetail/>,
  },

  {
    path: "/workspaces/:workspaceId/history",
  element: <WorkspaceHistory/>,
  },
  {
    path: "/workspaces/:workspaceId/setting",
  element: <WorkspaceSetting/>,
  },

  {
    path: "/docs",
    element: <div>docs</div>,
  },
  {
    path: "/ai-list",
    element: <AIlist/>,
  },
  {
    path: "/workspaces/:workspaceId/create",
    element: <CreateProject/>,
  },
  {
    path: "/admin",
    element: <Admin/>,
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
    path: "/admin/test/:modelId",
    element: <PredictAiModel/>,
  },
  {
    path: "/admin/predict/result",
    element: <PredictionResult />,
  },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Nav/>
      <RouterProvider router={router}/>
  </React.StrictMode>,
)
