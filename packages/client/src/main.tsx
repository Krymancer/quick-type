import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

import { WebsocketProvider } from '@/providers/WebsocketProvider';
import { QueryProvider } from '@/providers/QueryProvider';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <WebsocketProvider>
        <RouterProvider router={router} />
      </WebsocketProvider>
    </QueryProvider>
  </StrictMode>
);