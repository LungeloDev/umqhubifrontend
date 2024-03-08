import Frontend from "./home";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Home() {
    const router = useRouter();
    const [env, setEnv] = useState(false);

    // checking server env file
    useEffect(() => {
        const checkEnvFile = async () => {
            const { data } = await axios.get(process.env.backend_url)
            if (data?.status === true && data?.env === false) {
                await router.push('/setting/')
            } else {
                setEnv(pre => pre = true)
            }
        }
        checkEnvFile();
    }, [])


    if (env === true) {
        return <Frontend />
    }

    return <></>

}
