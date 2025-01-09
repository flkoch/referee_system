import { useState, FormEvent, useContext, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Col, Form, Row } from "react-bootstrap";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../lib/constants";
import { UserType } from "../../../lib/types";
import { getUser } from "../../../lib/auth";
import api from "../../../lib/api";
import LoadingIndicator from "../../../components/LoadingIndicator";
import { UserContext } from "../../../layouts/MainLayout";

type UserFormProps = {
    route: string;
    method: "login" | "register";
}
function UserForm({ route, method }: UserFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const { user, setUser } = useContext(UserContext);
    const handleSubmit = useCallback(async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const username = formData.get("username");
        const password = formData.get("password")
        try {
            const res = await api.post(route, { username, password })
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                const id = getUser()
                if (id !== undefined) {
                    setUser((prev: UserType) => { return { ...prev, id, "isAuthenticated": true }; });
                } else {
                    setUser((prev: UserType) => { return { ...prev, id, "isAuthenticated": false }; });
                }
                navigate("/events");
            } else {
                navigate("/login");
            }
        } catch (error) {
            setUser((prev: UserType) => { return { ...prev, "id": undefined, "isAuthenticated": false }; });
        } finally {
            setIsLoading(false);
        }
    }, [])
    return (!user.isAuthenticated) ? (
        <div className="container">
            <h1>{name}</h1>
            <Form onSubmit={handleSubmit} className="mt-4">
                <Row>
                    <Form.Group className="mb-3" as={Col}>
                        <Form.Label className="visually-hidden" htmlFor="username">Username</Form.Label>
                        <Form.Control name="username" id="username" type="text" placeholder="Username" disabled={isLoading} />
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col}>
                        <Form.Label className="visually-hidden" htmlFor="password">Password</Form.Label>
                        <Form.Control name="password" id="password" type="password" placeholder="Password" disabled={isLoading} />
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
    ) : <Navigate to="/" />
}

export default UserForm