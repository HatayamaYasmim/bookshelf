import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Center, Loader } from "@mantine/core";

export function ProtectedRoute() {
    const { isAuthenticated,  isInitializing } = useAuth();
    const location= useLocation();

       if (isInitializing) {
        return (
            <Center h="100vh">
                <Loader />
            </Center>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate to="/login" replace state={{from: location}} />
        )
    }
    return <Outlet/>
}