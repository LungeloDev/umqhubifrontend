import React from 'react';
import {useRouter} from 'next/router';
import AdminLayout from "../../../../layouts/admin";
import Heading from "./heading";
import Info from "./info";

const AddInfo = () => {
    const {query} = useRouter();
    return (
        <div>
            <section className='min-h-screen rounded-md p-2'>
                <Heading query />
                <Info {...query} />
            </section>
        </div>
    );
};
AddInfo.layout = AdminLayout;
export default AddInfo;