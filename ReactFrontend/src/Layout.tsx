import { Outlet } from "react-router-dom";
import Nav from "./components/Nav"; // Import your Nav component

function Layout() {
  return (
    <div>
      <Nav />
      <Outlet />  {/* This renders the matched child route */}
    </div>
  );
}

export default Layout;
