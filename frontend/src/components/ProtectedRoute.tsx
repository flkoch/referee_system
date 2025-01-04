import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { validToken } from "../lib/auth";

function ProtectedRoute({ children }: { children: any }): any {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    async function auth() {
        const token = await validToken();
        setIsAuthorized(token !== null)
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>
    }
    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute