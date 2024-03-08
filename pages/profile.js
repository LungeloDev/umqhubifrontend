import HomeLayout from "../layouts/home";
import ProfileComponent from "../components/profile/profile";

const Profile = () => {
    return (
        <>
            <ProfileComponent/>
        </>
    )
}

Profile.layout = HomeLayout;
export default Profile;