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
import { RegisterPage } from '../features/auth/RegisterPage';
import { AccountPage } from '../features/account/AccountPage';

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
            <Route
                path="/register"
                element={<RegisterPage />}
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
                    <Route
                        path="/account"
                        element={<AccountPage />}
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