import dynamic from 'next/dynamic';
import {useEffect, useState} from "react";
import {fetchDonutChartData} from "../../../helpers/backend_helper";
import moment from "moment";

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});

/*
*  Donut chart data structure
*  const data = {
*               labels: ['Completed', 'Cancelled'],
*               series: [2, 1],
*         };
* */

const TodayTripChart = () => {
    const [donutData, setDonutData] = useState({
        labels: [],
        series: [],
    });

    useEffect(() => {
        const params = {
            start: moment().startOf('day').toISOString(),
            end: moment().endOf('day').toISOString()
        }
        fetchDonutChartData(params).then(res => {
            if (res?.error === false) {
                setDonutData(res?.data)
            }
        })
    }, [])

    const labelToColorMap = {
        'completed': '#43A048',
        'declined': '#F44336',
        'pending': '#FFA525',
        'accepted': '#D139C8',
        'moving': '#FF8166',
        'start': '#0075FF',
    };

    const options = {
        chart: {
            type: 'donut',
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '50%', // adjust the size of the donut hole

                },
            },
        },
        labels: donutData?.labels,
        colors: donutData?.labels.map(label => labelToColorMap[label]),
        // colors: ['#43A048', '#FCEB55', '#FFA525', '#F44336']
        // dataLabels: {
        //     enabled: true,
        //     formatter: function (val, opts) {
        //         // Customize colors based on label names
        //         if (opts.w.globals.labels[opts.seriesIndex] === 'completed') {
        //             return {
        //                 style: {
        //                     color: '#43A048', // Color for 'Completed' label
        //                 },
        //             };
        //         } else if (opts.w.globals.labels[opts.seriesIndex] === 'declined') {
        //             return {
        //                 style: {
        //                     color: '#F44336',
        //                 },
        //             };
        //         }
        //     },
        // },
    };

    return (
        <div className='shadow-md rounded-xl py-[20px] p-[20px] bg-white lg:h-full'>
            <h1 className='text-[#414141] text-lg font-medium  ml-[20px]'>Today Trip</h1>
            <Chart
                options={options}
                series={donutData?.series}
                type="donut"
                width="100%"
                className="mt-16"
            />
        </div>
    );
};
export default TodayTripChart;
