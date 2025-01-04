import { Route, Navigate, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/EventList";
import EventDetail from "./pages/EventDetail";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";


function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterandLogout() {
  localStorage.clear()
  return <Register />
}

function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route path="events/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="events/:pk" element={
        <ProtectedRoute>
          <EventDetail />
        </ProtectedRoute>
      } />
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />
      <Route path="register" element={<RegisterandLogout />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  ))

  return <RouterProvider router={router} />
}

export default App
