import { useSearchParams } from "react-router-dom";
import UserForm from "../features/User/components/UserForm"

function Register() {
    const next = useSearchParams()[0].get("next");
    return <UserForm route="/api/user/register/" method="register" next={next} />
}

export default Register