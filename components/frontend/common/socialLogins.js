import React, { useState } from 'react';
import { BsFacebook } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { Loader } from '../../common/preloader';
import { useUserDataContext } from '../../../contexts/userDataContext';
import { postSocialLogin, verifyByEmailPhone } from '../../../helpers/backend_helper';
import { FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { app } from '../../../firebase/firebase.config';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import SignUpModal from './signupModal/signUpModal';

const SocialLogins = ({ role }) => {
    const router = useRouter()
    const { setIsLoggedIn } = useUserDataContext()
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider()
    const facebookProvider = new FacebookAuthProvider()

    const handleGoogleLogin = () => {
        setLoading(true)
        signInWithPopup(auth, googleProvider)
            .then(async result => {
                const user = result.user;
                const data = {
                    role: role,
                    name: user.displayName,
                    image: user.photoURL,
                    phone: user.phoneNumber,
                    email: user.email,
                    idToken: user.accessToken,
                    auth_type: "google"
                }
                if (router?.pathname === "/login") {
                    const { error, data: d } = await verifyByEmailPhone({ username: user?.email, role: role })
                    if (error === false) {
                        socialLogin(data)
                    } else {
                        setLoading(false)
                        toast.error(d)
                        setModalOpen(true)
                    }
                } else socialLogin(data)
            })
            .catch(err => {
                setLoading(false)
            })
    }

    const handleFacebookLogin = () => {
        setLoading(true)
        signInWithPopup(auth, facebookProvider)
            .then(result => {
                const user = result.user
                const data = {
                    role: role,
                    name: user.displayName,
                    image: user.photoURL,
                    phone: user.photoURL,
                    email: user.email,
                    auth_type: "facebook"
                }
                socialLogin(data)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
            })
    }

    const socialLogin = async (data) => {
        const { error, token, msg, data: user } = await postSocialLogin(data)
        if (error === true) {
            setLoading(false)
            return toast.error(msg)
        }
        if (user?.phone) {
            if (error === false) {
                token && localStorage.setItem('authToken', token);
                user?.auth_type && localStorage.setItem('auth_type', user?.auth_type)
                setIsLoggedIn(true);
                setLoading(false)
                switch (user?.role) {
                    case 'admin':
                        await router.push("/admin")
                        break;
                    case 'driver':
                        if (user?.vehicle?.approved === true) {
                            await router.push("/driver")
                        } else if (user?.vehicle?.approved === false) {
                            toast.error('Your requested vehicle not approved yet!')
                            setTimeout(async () => {
                                await router.push("/home")
                            }, 4000)
                        } else {
                            toast.error('Please register your vehicle first!')
                            setTimeout(async () => {
                                await router.push("/home/earnWithShare")
                            }, 4000)
                        }
                        break;
                    case 'user':
                        await router.push("/user")
                        break;
                    case 'employee':
                        await router.push("/employee")
                        break;
                    default:
                        await router.push("/")
                }
            }
        } else {
            token && localStorage.setItem('authToken', token);
            user?.auth_type && localStorage.setItem('auth_type', user?.auth_type)
            router.push(`/profile/?role=${user?.role}&auth_type=${user?.auth_type}`);
            toast.error("You must provide phone number to continue");
            setLoading(false)
        }
    }

    if (!!loading) {
        return <div className='flex justify-center'><Loader /></div>
    }

    return (
        <>
            <div className="flex justify-center gap-x-9 my-10">
                <div
                    onClick={handleFacebookLogin}
                    className="border border-[#D0D0D0] rounded-[8px] h-[90px] w-[90px] flex items-center justify-center text-[#1877F2] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                    <BsFacebook size={30} />
                </div>
                <div
                    onClick={handleGoogleLogin}
                    className="border border-[#D0D0D0] rounded-[8px] h-[90px] w-[90px] flex items-center justify-center text-[#1877F2] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                    <FcGoogle size={30} />
                </div>
            </div>
            <SignUpModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </>
    );
};

export default SocialLogins;
