import Head from 'next/head';
import React from 'react';
import moment from "moment";
import Card from '../../components/common/card';
import Table from '../../components/common/table';
import DriverLayout from '../../layouts/driver';

const Complain = () => {
    const document =
    {
        "error": false,
        "msg": "Successfully get services",
        "data": {
            "docs": [
                {
                    _id: 1,
                    complain_type: "Vehicle not clean",
                    date: "2023-01-30T10:32:02.373Z",
                    status: "",
                },
                {
                    _id: 2,
                    complain_type: "Vehicle not clean",
                    date: "2023-02-25T10:32:02.373Z",
                    payment_status: "",
                },
            ]
        }
    }

    let columns = [

        {
            dataField: 'complain_type', text: 'Complain Type',
            formatter: complain_type => <span className='capitalize'>{complain_type}</span>
        },
        {
            dataField: 'date', text: 'Submit Date',
            formatter: date => <span className='capitalize'>{moment(date).format("MMM DD, YYYY")}</span>
        },
        {
            dataField: 'payment_status', text: 'Status',
            formatter: status => <span
                className={`capitalize ${status?.toLowerCase() === '' && 'text-green-500'} 
                    ${status?.toLowerCase() === '' && 'text-yellow-500'}`}>
                {status}
            </span>
        },
    ]

    return (
        <div>
            <Head>
                <title>Complain</title>
            </Head>

            <Card className={'shadow-sm'}>
                <h1 className={'text-gray-600 text-[16px] font-semibold tracking-wider'}>Complain</h1>
            </Card>
            <Table
                indexed
                pagination
                columns={columns}
                data={document.data}
                // onReload={getCategories}
                // loading={loading}
                noActions={false}
                shadow={false}
            />
        </div>
    );
};

Complain.layout = DriverLayout
export default Complain;