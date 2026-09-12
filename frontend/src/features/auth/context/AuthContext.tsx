import { createContext, type ReactNode, useState } from "react";
import { login, type AuthUser, type LoginRequest } from "../../../services/auth";

interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    signIn: (data: LoginRequest) => Promise<void>;
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
    const [user, setUser] =
        useState<AuthUser | null>(null);

    async function signIn(
        data: LoginRequest,
    ) {
        const response = await login(data);

        setUser(response.user);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                signIn,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}