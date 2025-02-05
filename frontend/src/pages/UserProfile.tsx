import { useContext } from "react";
import NotFound from "./NotFound";
import ProfilePage from "../features/User/components/ProfilePage";
import { UserContext } from "../layouts/MainLayout";

function UserProfile() {
    const { user } = useContext(UserContext);
    if (user.id === undefined) return <NotFound />
    return (
        <>
            <h1 className="mb-4">User Profile</h1>
            <ProfilePage pk={user.id} />
        </>
    );
}

export default UserProfile