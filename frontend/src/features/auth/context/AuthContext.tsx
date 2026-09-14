import { createContext, type ReactNode, useEffect, useState } from "react";
import { getMe, login, logout, type AuthUser, type LoginRequest } from "../../../services/auth";

interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isInitializing: boolean;
    signIn: (data: LoginRequest) => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext =
    createContext<AuthContextValue | undefined>(
        undefined,
    );

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        async function restoreSession() {
            try {
                const currentUser = await getMe();
                setUser(currentUser);
            } catch {
                setUser(null);
            } finally {
                setIsInitializing(false);
            }
        }

        restoreSession();
    }, []);

    async function signIn(data: LoginRequest) {
        const response = await login(data);
        setUser(response.user);
    }

    async function signOut() {
        await logout();
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                isInitializing,
                signIn,
                signOut
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}