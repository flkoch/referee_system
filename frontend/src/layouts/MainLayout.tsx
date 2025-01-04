import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ToastContainer } from "react-toastify";

function MainLayout() {
    const [theme, setTheme] = useState(true);
    function toggleTheme(_event: MouseEvent): void {
        document.documentElement.setAttribute("data-bs-theme", theme ? "dark" : "light");
        setTheme(!theme);
    }
    return (
        <>
            <header>
                <Header toggleFunction={toggleTheme} />
            </header>
            <main className="container">
                <Outlet />
            </main>
            <ToastContainer autoClose={10000} />
            <Footer />
        </>
    )
}

export default MainLayout