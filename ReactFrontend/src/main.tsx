import React from 'react'
import ReactDOM from 'react-dom/client'


import Workspace from './pages/Workspace.tsx'

import './index.css'
import { createBrowserRouter,RouterProvider,Route ,Link } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Nav from './components/Nav.tsx'
import ProjectList from './pages/ProjectList.tsx'

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
    path: "about",
    element: <div>About</div>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Nav/>
      <RouterProvider router={router}/>
  </React.StrictMode>,
)
