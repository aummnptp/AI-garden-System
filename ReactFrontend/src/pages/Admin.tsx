import React from "react";
import MiniFooter from "../components/MiniFooter";
import { Link } from "react-router-dom";
import '../Admin.css';  // อย่าลืม import ไฟล์ CSS
import AdminSidebar from "../components/AdminSidebar";

function Admin() {
  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        {/* Sidebar */}
      <AdminSidebar/>
        <div className="w-1/5 bg-neutral-200 h-full"></div>
        
        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Header with Cards */}
          <div className="flex justify-center space-x-4">
          <Link to="/admin/admin-ai">
            <div className="card">
              <div className="icon">👤</div>
              <div className="title">User lists</div>
              <div className="count">30</div>
            </div>
            </Link>
            <Link to="/admin/admin-ai">
            <div className="card">
              <div className="icon">🤖</div>
              <div className="title">AI lists</div>
              <div className="count">24</div>
            </div>
            </Link>
            <Link to="/admin/admin-ai">
            <div className="card">
              <div className="icon">📂</div>
              <div className="title">Workspaces</div>
              <div className="count">80</div>
            </div>
            </Link>
          </div>
          
          {/* Other content can go here */}
        </div>
      </div>
      <MiniFooter />
    </>
  );
}

export default Admin;
