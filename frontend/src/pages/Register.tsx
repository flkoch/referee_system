import UserForm from "../components/Form"

function Register() {
    return <UserForm route="/api/user/register/" method="register" />
}

export default Register