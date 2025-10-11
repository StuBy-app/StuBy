import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import "./styles/tailwind.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
      retry: 0,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <>
          <App />
        </>
      </BrowserRouter>
    </QueryClientProvider>
  </>
)