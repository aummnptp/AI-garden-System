import { Outlet } from "react-router-dom";
import Nav from "./components/navbar/Nav"; // Import your Nav component
import { Toaster } from "react-hot-toast";

function Layout() {
  return (
    <div>
      <Nav />
      <Toaster position="top-center" />
      <Outlet />  {/* This renders the matched child route */}
    </div>
  );
}

export default Layout;
