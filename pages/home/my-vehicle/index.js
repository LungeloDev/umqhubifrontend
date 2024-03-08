import Title from "../../../components/frontend/common/title";
import HomeLayout from "../../../layouts/home";
import {useFetch} from "../../../helpers/hooks";
import {
    fetchEarnWithShare,
} from "../../../helpers/backend_helper";
import Button from "../../../components/common/button";
import React, {useEffect} from "react";
import {useRouter} from "next/router";
import jwt_decode from "jwt-decode";

const MyDocuments = () => {
    const router = useRouter()
    const {query} = useRouter();
    const [contents] = useFetch(fetchEarnWithShare);

    useEffect(() => {
        if (!!query?.token) {
            const token = query?.token;
            localStorage.setItem('authToken', token);
        }
    }, [query?.token])

    return (
        <div>
            <div>
                <Title heading={contents?.section_1?.title} paragraph={contents?.section_1?.description}/>
                <div className={'flex justify-content-center my-5 border-2 border-dotted py-4 border-main'}>
                    <Button className={'text-capitalize hover:bg-twSecondary-shade700 hover:shadow-lg'}
                            onClick={async () => {
                                const token = localStorage.getItem('authToken') ?? '';
                                const decoded = token && jwt_decode(token);
                                await router.push("/home/my-vehicle/edit?driver="+decoded?._id)
                            }}
                    >
                        Update My Documents
                    </Button>
                </div>
            </div>
        </div>
    )
}
MyDocuments.layout = HomeLayout
export default MyDocuments