import React, {useEffect, useState} from 'react';
import ServiceLocationMap from "../../../components/user/ride/map";
import {Drawer, Form, Input, Space, Rate, message} from "antd";
import {useSite} from "../../../contexts/site";
import {useRouter} from "next/router";
import UserLayout from "../../../layouts/user";
import {useFetch} from "../../../helpers/hooks";
import {fetchUserTripList, postReview} from "../../../helpers/backend_helper";
import Button from "../../../components/common/button";
const { TextArea } = Input;

const desc = ['very bad', 'bad', 'average', 'good', 'excellent'];

const ReviewRating = () => {
    const site = useSite()
    const {push, query} = useRouter();
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState('bottom');
    const [location, setLocation] = useState({lat: 0, lng: 0});
    const [address, setAddress] = useState({lat: 0, lng: 0});
    const [ratingInfo, setRatingInfo] = useState({rating: 4, review: ""});
    const [tripData, getTripData] = useFetch(fetchUserTripList, {}, false)

    useEffect(() => {
        if (query?.trip) {
            getTripData({_id: query?.trip})
            setOpen(true)
        }
    }, [query?.trip])

    const handleRating = (e) => {
        switch (e) {
            case 1: {
                setRatingInfo({rating: e, review: desc[e-1]})
                break
            }
            case 2: {
                setRatingInfo({rating: e, review: desc[e-1]})
                break
            }
            case 3: {
                setRatingInfo({rating: e, review: desc[e-1]})
                break
            }
            case 4: {
                setRatingInfo({rating: e, review: desc[e-1]})
                break
            }
            case 5: {
                setRatingInfo({rating: e, review: desc[e-1]})
                break
            }
        }
    }

    return (
        <div>
            <ServiceLocationMap setLocation={setLocation} setAddress={setAddress}/>
            <Drawer
                title="Feedback"
                placement={placement}
                onClose={() => setOpen(false)}
                visible={open}
                key={placement}
                extra={
                    <Space>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                    </Space>
                }
                height={500}
                destroyOnClose
            >
                <div className={'md:w-2/3 mx-auto'}>
                    <h1 className={'flex justify-center'}>
                        <Rate allowHalf={false} value={ratingInfo?.rating} onChange={handleRating}/>
                    </h1>
                    <h1 className={'capitalize text-green-500 text-center text-[20px] font-semibold tracking-wider my-3'}>{desc[ratingInfo?.rating - 1]}</h1>
                    <h1 className={'text-gray-500 text-center text-[16px] tracking-wider mb-4'}>You rated {`"${tripData?.docs[0]?.driver?.name}"`} <span className={'font-semibold text-amber-500'}>{ratingInfo?.rating}</span> start</h1>
                    <Form
                        onFinish={async (values) => {
                            const data = {
                                ...values,
                                ...ratingInfo,
                                driver: tripData?.docs[0]?.driver?._id,
                                trip: tripData?.docs[0]?._id,
                            }
                            delete data?.review;
                            const res = await postReview(data)
                            if(res?.error === false) {
                                message.success(res?.msg)
                                push(`/user/payment-list/`)
                            } else {
                                message.success('Please try again...')
                            }
                        }}
                    >
                        <Form.Item name={'comment'}>
                            <TextArea rows={4} placeholder={'Write something...'} row={3} />
                        </Form.Item>
                        <Button>Submit</Button>
                    </Form>
                </div>
            </Drawer>
        </div>
    );
};

ReviewRating.layout = UserLayout;
export default ReviewRating;