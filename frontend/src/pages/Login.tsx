import { Navigate, useSearchParams } from "react-router-dom"
import UserForm from "../features/User/components/UserForm"
import { useContext } from "react";
import { UserContext } from "../layouts/MainLayout";

function Login() {
    const next = useSearchParams()[0].get("next");
    const { user, setUser } = useContext(UserContext);
    if (user) {
        setUser({ "id": user, "isAuthenticated": true })
        return <Navigate to={next ? next : "/events"} />
    }
    return <UserForm route="/api/token/" method="login" next={next} />
}

export default Login