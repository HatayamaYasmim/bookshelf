import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Notifications } from '@mantine/notifications';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';

import App from './App.tsx';
import './index.css'

const queryClient = new QueryClient();

const theme = createTheme({
  primaryColor: 'indigo',

  fontFamily: '"Plus Jakarta Sans", sans-serif',

  headings: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    fontWeight: '600',
  },

  defaultRadius: 'md',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
         <Notifications position="top-center" />
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
);