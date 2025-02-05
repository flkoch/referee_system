import { lazy, Suspense, useContext } from "react";
import { Route, Navigate, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import LoadingIndicator from "./components/LoadingIndicator";
import { UserContext } from "./layouts/MainLayout";

const EventOverview = lazy(() => import("./pages/EventOverview"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Login = lazy(() => import("./pages/Login"));
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const Register = lazy(() => import("./pages/Register"));
const UserProfile = lazy(() => import("./pages/UserProfile"));


function Logout() {
  const { setUser } = useContext(UserContext);
  setUser({ "id": undefined, "isAuthenticated": false })
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterandLogout() {
  localStorage.clear()
  return <Register />
}

function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <>
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
        <Route path="profile" element={
          <Suspense fallback={<LoadingIndicator size="15rem" />}>
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="login" element={
          <Suspense fallback={<LoadingIndicator size="15rem" />}>
            <Login />
          </Suspense>
        } />
        <Route path="*" element={
          <Suspense fallback={<LoadingIndicator size="15rem" />}>
            <NotFound />
          </Suspense>
        } />
      </Route>
      <Route path="logout" element={
        <Logout />
      } />
      <Route path="register" element={
        <RegisterandLogout />
      } />
    </>
  ))

  return <RouterProvider router={router} />
}

export default App
