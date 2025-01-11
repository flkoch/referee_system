import { useState, FormEvent, useContext, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    next: string | null;
}
function UserForm({ route, method, next = null }: UserFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";
    const destination = next ? "?next=" + next : "";

    const { setUser } = useContext(UserContext);
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
                const id = getUser(res.data.access)
                if (id !== undefined) {
                    setUser((prev: UserType) => { return { ...prev, id, "isAuthenticated": true }; });
                } else {
                    setUser({ id, "isAuthenticated": false });
                }
                navigate(next ? next : "/events");
            } else {
                navigate("/login" + destination);
            }
        } catch (error) {
            setUser({ "id": undefined, "isAuthenticated": false });
        } finally {
            setIsLoading(false);
        }
    }, [])
    return (
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
                <Form.Group className="position-relative">
                    {isLoading ? <LoadingIndicator /> :
                        (
                            <>
                                <Button className="form-button" type="submit">
                                    {name}
                                </Button>
                                {method === "login" ?
                                    <Link to={"/register" + destination} className="position-absolute end-0">Register</Link> :
                                    <Link to={"/login" + destination} className="position-absolute end-0">Login</Link>
                                }
                            </>
                        )
                    }
                </Form.Group>
            </Form>
        </div>
    )
}

export default UserForm