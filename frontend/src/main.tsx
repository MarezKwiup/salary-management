import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import { AppLayout } from './layout/AppLayout';
import { EmployeesPage } from './pages/EmployeesPage.tsx';
import { InsightsPage } from './pages/InsightsPage.tsx';

const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            { index: true, element: <Navigate to="/employees" replace /> },
            { path: 'employees', element: <EmployeesPage /> },
            { path: 'insights', element: <InsightsPage/> },
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider>
            <Notifications />
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </MantineProvider>
    </StrictMode>
);