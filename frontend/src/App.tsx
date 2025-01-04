import { lazy, Suspense } from "react";
import { Route, Navigate, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import LoadingIndicator from "./components/LoadingIndicator";

const EventOverview = lazy(() => import("./pages/EventOverview"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const Register = lazy(() => import("./pages/Register"));


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
      <Route index element={<Navigate to="/events/" />} />
      <Route path="events/" element={
        <Suspense fallback={<LoadingIndicator size="15rem" />}>
          <ProtectedRoute>
            <EventOverview />
          </ProtectedRoute>
        </Suspense>
      } />
      <Route path="events/:pk" element={
        <Suspense fallback={<LoadingIndicator size="15rem" />}>
          <ProtectedRoute>
            <EventDetail />
          </ProtectedRoute>
        </Suspense>
      } />
      <Route path="login" element={
        <Suspense fallback={<LoadingIndicator size="15rem" />}>
          <Login />
        </Suspense>
      } />
      <Route path="logout" element={
        <Suspense fallback={<LoadingIndicator size="15rem" />}>
          <Logout />
        </Suspense>
      } />
      <Route path="register" element={
        <Suspense fallback={<LoadingIndicator size="15rem" />}>
          <RegisterandLogout />
        </Suspense>} />
      <Route path="*" element={
        <Suspense fallback={<LoadingIndicator size="15rem" />}>
          <NotFound />
        </Suspense>
      } />
    </Route>
  ))

  return <RouterProvider router={router} />
}

export default App
