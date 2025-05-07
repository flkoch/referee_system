import { createContext, Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeLiteral, UserType } from "../lib/types";
import { getUser } from "../lib/auth";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

type ContextProp = {
    user: UserType;
    setUser: CallableFunction;
    toggleTheme: CallableFunction;
}
export const UserContext = createContext<ContextProp>({ "user": {}, "setUser": () => { }, "toggleTheme": () => { } });

function MainLayout() {
    const preferesDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const defaultTheme = preferesDarkMode ? "dark" : "light";
    let selectedTheme = localStorage.getItem("theme")
    if (!selectedTheme) {
        localStorage.setItem("theme", defaultTheme)
        selectedTheme = defaultTheme
    }
    document.documentElement.setAttribute("data-bs-theme", selectedTheme || defaultTheme)
    const id = getUser();
    const [user, setUser] = useState<UserType>({ id, "isAuthenticated": id !== undefined });
    const [_, setTheme] = useState<string>(selectedTheme || defaultTheme);
    function toggleTheme(_event: MouseEvent): void {
        setTheme((prev) => {
            const next: ThemeLiteral = (prev === "light") ? "dark" : "light"
            document.documentElement.setAttribute("data-bs-theme", next);
            localStorage.setItem("theme", next)
            return next;
        });
    }
    return (
        <UserContext.Provider value={{ user, setUser, toggleTheme }} >
            <header>
                <Header />
            </header>
            <Suspense>
                <main className="container">
                    <Outlet />
                </main>
            </Suspense>
            <ToastContainer autoClose={10000} />
            <Footer />
        </UserContext.Provider>
    )
}

export default MainLayout