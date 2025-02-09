import { useContext } from "react";
import { Navbar } from "react-bootstrap";
import { UserContext } from "../layouts/MainLayout";

function ThemeToggle() {
    const { toggleTheme } = useContext(UserContext)
    return (
        <Navbar.Text className="btn d-block ms-auto" onClick={(e) => toggleTheme(e)} aria-label="Change Theme Colour">
            <i className="bi bi-sun" />
        </Navbar.Text>
    )
}

export default ThemeToggle