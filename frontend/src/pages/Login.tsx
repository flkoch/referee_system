import UserForm from "../components/Form"

function Login() {
    return <UserForm route="/api/token/" method="login" />
}

export default Login