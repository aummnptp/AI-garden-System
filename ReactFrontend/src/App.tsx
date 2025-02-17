import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";

const App: React.FC = () => {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
};

export default App;