import Head from 'next/head';
import React from 'react';
import AdminLayout from "../../../layouts/admin";

const UserReport = () => {

    return (
        <div>
            <section className='bg-white min-h-screen rounded-md p-2'>
                <Head>
                    <title>Report</title>
                </Head>
                <div className='card_container'>
                    <p className='text-center font-base'>Welcome!</p>
                </div>
            </section>
        </div>
    );
};
UserReport.layout = AdminLayout
export default UserReport;