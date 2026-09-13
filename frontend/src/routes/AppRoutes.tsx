import {
    Navigate,
    Outlet,
    Route,
    Routes,
} from 'react-router-dom';

import { AppHeader } from '../components/layout/AppHeader';
import { LoginPage } from '../features/auth/LoginPage';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { BooksPage } from '../features/books/BooksPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';

function MainLayout() {
    return (
        <>
            <AppHeader />
            <Outlet />
        </>
    );
}

export function AppRoutes() {
    return (
        <Routes>
            {/* Public routes */}
            <Route
                path="/login"
                element={<LoginPage />}
            />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/library"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/library"
                        element={<BooksPage />}
                    />

                    <Route
                        path="/dashboard"
                        element={<DashboardPage />}
                    />
                </Route>
            </Route>

            <Route
                path="*"
                element={
                    <Navigate
                        to="/library"
                        replace
                    />
                }
            />
        </Routes>
    );
}