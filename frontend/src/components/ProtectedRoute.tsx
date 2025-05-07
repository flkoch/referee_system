import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { validToken } from "../lib/auth";
import LoadingIndicator from "./LoadingIndicator";
import { UserContext } from "../layouts/MainLayout";

function ProtectedRoute({ children }: { children: any }): any {
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        validToken().catch(() => setUser({ "isAuthorized": false }))
    }, [])

    if (user.isAuthenticated === undefined) {
        return <LoadingIndicator />
    }
    return user.isAuthenticated ? children : <Navigate to="/login" />
}

export default ProtectedRoute