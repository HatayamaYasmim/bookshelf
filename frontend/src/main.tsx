import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Notifications } from '@mantine/notifications';

import App from './App.tsx';
const queryClient = new QueryClient();


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
         <Notifications position="top-center" />
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
);