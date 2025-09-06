import { StrictMode, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { RootState, store } from './store';
import { darkTheme, lightTheme } from './styles/theme';
import './index.css';
import App from './App';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ThemedApp() {
  const uiTheme = useSelector((state: RootState) => state.ui.theme);
  const prefersDark =
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const muiTheme = useMemo(() => {
    const mode = uiTheme === 'system' ? (prefersDark ? 'dark' : 'light') : uiTheme;
    return mode === 'dark' ? darkTheme : lightTheme;
  }, [uiTheme, prefersDark]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AnimatePresence mode="wait">
        <App />
      </AnimatePresence>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemedApp />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);