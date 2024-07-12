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

//  React router path here
const router = createBrowserRouter([
  
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/workspaces",
    element: <Workspace/>,
  },
  {
      path: "/workspaces/:id/project-list",
    element: <ProjectList/>,
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
    path: "/create",
    element: <CreateProject/>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Nav/>
      <RouterProvider router={router}/>
  </React.StrictMode>,
)
