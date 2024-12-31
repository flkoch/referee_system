import { useState, FormEvent } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadinIndicator";
import { Button, Col, Form, Row } from "react-bootstrap";

function UserForm({ route, method }: { route: any; method: any }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === "login" ? "Login" : "Register"

    const handleSubmit = async (event: FormEvent) => {
        setIsLoading(true);
        event.preventDefault()
        try {
            const res = await api.post(route, { username, password })
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="container">
            <h1>{name}</h1>
            <Form onSubmit={handleSubmit} className="mt-4">
                <Row>
                    <Form.Group className="mb-3" as={Col}>
                        <Form.Label className="visually-hidden" htmlFor="username">Username</Form.Label>
                        <Form.Control id="username" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col}>
                        <Form.Label className="visually-hidden" htmlFor="password">Password</Form.Label>
                        <Form.Control id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                </Row>
                <Form.Group>
                    {isLoading ? <LoadingIndicator /> :
                        (<Button className="form-button" type="submit">
                            {name}
                        </Button>)}
                </Form.Group>
            </Form>
        </div>
    )
}

export default UserForm