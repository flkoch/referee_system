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
    theme: ThemeLiteral;
    toggleTheme: CallableFunction;
}
export const UserContext = createContext<ContextProp>({ "user": {}, "setUser": () => { }, "theme": "light", "toggleTheme": () => { } });

function MainLayout() {
    const id = getUser();
    const [user, setUser] = useState<UserType>({ id, "isAuthenticated": id !== undefined });
    const [theme, setTheme] = useState<ThemeLiteral>("light");
    function toggleTheme(_event: MouseEvent): void {
        setTheme((prev) => {
            const next: ThemeLiteral = (prev === "light") ? "dark" : "light"
            document.documentElement.setAttribute("data-bs-theme", next);
            return next;
        });
    }
    return (
        <UserContext.Provider value={{ user, setUser, theme, toggleTheme }} >
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