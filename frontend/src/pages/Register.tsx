import UserForm from "../features/User/components/UserForm"

function Register() {
    return <UserForm route="/api/user/register/" method="register" />
}

export default Register