import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { createTheme, ThemeProvider } from '@mui/material'
import { AuthProvider } from './context/AuthContext';

import App from './App';




const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: "75px",
          fontWeight: "bold", 
          borderRadius: "20px", 
          textTransform: "none",
          marginLeft: "10px", 
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
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
  <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </QueryClientProvider>
  </ThemeProvider>
</React.StrictMode>
);