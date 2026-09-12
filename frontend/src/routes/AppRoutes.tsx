import {
    Navigate,
    Route,
    Routes,
} from 'react-router-dom';

import { BooksPage } from '../features/books/BooksPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { LoginPage } from '../features/auth/LoginPage';

export function AppRoutes() {
    return (
        <Routes>
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
                path="*"
                element={
                    <Navigate
                        to="/library"
                        replace
                    />
                }
            />
               <Route
                    path="/login"
                    element={<LoginPage />}
                  />
        </Routes>
    );
}