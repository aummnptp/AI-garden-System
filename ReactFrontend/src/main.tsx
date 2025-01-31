import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import { createBrowserRouter,RouterProvider,Route ,Link } from 'react-router-dom'
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { createTheme, ThemeProvider } from '@mui/material'
import { AuthProvider } from './context/AuthContext';
import { router } from './router';




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


const queryClient = new QueryClient({
  queryCache: new QueryCache(),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // ✅ ข้อมูลจะถือว่าใหม่เป็นเวลา 5 นาที
      retry: 2, // ✅ รีลอง 2 ครั้งถ้า request ล้มเหลว
      refetchOnWindowFocus: false, // ✅ ไม่ต้องโหลดใหม่เมื่อเปลี่ยนหน้า
    },
  },
});



ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>
        <ReactQueryDevtools initialIsOpen={false} /> 
      </QueryClientProvider>
    </AuthProvider>
  </ThemeProvider>
);