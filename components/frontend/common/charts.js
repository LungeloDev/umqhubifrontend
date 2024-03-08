import React, {useState, useEffect} from 'react';
import dynamic from "next/dynamic";
import DateRangePicker from '../../form/date-range';
import {Form} from 'antd';
import moment from 'moment';
import {Col, Row} from "react-bootstrap";
import Button from "../../common/button";
import {useFetch} from "../../../helpers/hooks";
import {fetchDriverGraphData} from "../../../helpers/backend_helper";

const Chart = dynamic(() => import('../../charts/ApexChart/chart'), {ssr: false})

const EarningsChart = ({chartTitle}) => {
    const [getReportData, setReportData] = useFetch(fetchDriverGraphData);
    const [series, setSeries] = useState([]);
    const [date, setDate] = useState();
    const [options, setOptions] = useState({
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%',
            },

        },
        dataLabels: {
            enabled: true,
        },
        xaxis: {
            categories: [],
        },
        colors: ["#FFD428"],
        fill: {
            type: 'gradient',
            gradient: {
                // shade: 'none',
                type: "vertical",
                gradientToColors: ["#F9B776"], // optional, if not defined - uses the shades of same color in series
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 70, 100],

            }
        },
        title: {
            text: chartTitle,
            align: 'left',
            style: {
                fontSize: '20px',
            },
        },
        toolbar: {
            show: true,
            tools: {
                download: false,
            },
        },
    });

    useEffect(() => {
        if (typeof window !== "undefined" && getReportData?.length > 0) {
            setSeries([
                {
                    name: 'Earnings',
                    data: getReportData?.map((d) => d.earnings),
                },
            ]);
            setOptions((prevOptions) => ({
                ...prevOptions,
                xaxis: {
                    categories: getReportData?.map((d) => d.date),
                },
            }));
        }
    }, [getReportData?.length]);

    useEffect(() => {
        setReportData({
            start: moment().startOf('day').toISOString(),
            end: moment().endOf('day').toISOString()
        })
    },[])


    return (
        <div className='shadow-md rounded-xl p-[20px] bg-white'>
            <div>
                <Form layout="vertical" className="w-full" onFinish={values => {
                    setReportData({
                        start: values.date.start?.startOf('day').toISOString(),
                        end: values.date.end?.endOf('day').toISOString()
                    })
                }}>
                    <Row>
                        <Col md={3}>
                        </Col>
                        <Col md={4}>
                            <Form.Item
                                name="date"
                                initialValue={{
                                    start: moment(),
                                    end: moment()
                                }}
                                rules={[
                                    {required: true, message: 'Please select date'},
                                ]}>
                                <DateRangePicker left={true} onChange={setDate}/>
                            </Form.Item>
                        </Col>
                        <Col md={2} className={'pb-1'}>
                            <Button>Get Report</Button>
                        </Col>
                    </Row>
                </Form>
            </div>

            {typeof window !== "undefined" && < Chart
                options={options}
                series={series}
                type="bar"
                height={500}
            />}
        </div>
    );
}
export default EarningsChart