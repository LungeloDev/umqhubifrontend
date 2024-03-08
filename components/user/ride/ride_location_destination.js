import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Skeleton} from 'antd';
import {MdShareLocation} from 'react-icons/md'
import {SlLocationPin} from 'react-icons/sl'
import {IoIosArrowDropright} from 'react-icons/io'
import {searchAddress} from "../../../helpers/map";
import {useDispatch, useSelector} from 'react-redux'
import {storeUserMapDestination, storeUserMapLocation} from "../../../redux/user-ride/actions";
import {useRouter} from "next/router";

const RideLocationDestination = ({serviceCategory, form}) => {
    const {push} = useRouter()
    const state = useSelector(state => state?.userLocation)
    const dispatch = useDispatch()
    const [addresses, setAddresses] = useState();
    const [destinationAddresses, setDestinationAddresses] = useState();
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [listName, setListName] = useState();

    useEffect(() => {
        if (state?.location || state?.destination) {
            form.setFieldsValue({
                location: state?.location?.formatted_address,
                destination: state?.destination?.formatted_address,
            })
            setRefresh(false)
        }
    }, [state?.location, state?.destination, refresh])

    const handleOnFocus = (e, value) => {
        setLoading(true)
        setListName(pre => pre = value)
    }

    const onChangeLocation = async (e) => {
        if (e.target.value?.length > 0) {
            const addr = await searchAddress(e.target.value, process.env.google_map)
            if (addr?.results?.length > 0) {
                setAddresses(addr?.results)
                setLoading(false)
            }
        }
    }

    const onChangeDestination = async (e) => {
        if (e.target.value?.length > 0) {
            const addr = await searchAddress(e.target.value, process.env.google_map)
            if (addr?.results?.length > 0) {
                setDestinationAddresses(addr?.results)
                setLoading(false)
            }
        }
    }

    return (
        <div className={'flex justify-center'}>
            <div className={'w-full md:w-[70vw] md:border md:border-2-twSecondary-shade800 p-3 rounded-lg shadow-lg'}>
                <Form
                    form={form}
                    onFinish={async (values) => {
                        await push(`/user/ride-now/transport?_id=${serviceCategory?._id}`)
                    }}
                    layout={'vertical'}
                >
                    <Form.Item
                        shouldUpdate
                        label="Your location"
                        name="location"
                        rules={[{required: true, message: 'Please input your location!'}]}
                        className={'relative'}
                        onChange={onChangeLocation}
                        extra={form.getFieldValue()?.location ? 'From : ' + (form.getFieldValue()?.location || '') : ''}
                    >
                        <MdShareLocation className={'absolute top-2.5 left-2 z-10'} size={18}/>
                        <Input
                            onBlur={() => {
                                setLoading(false)
                                setListName()
                            }}
                            onFocus={(e) => handleOnFocus(e, 'location')}
                            placeholder={'From...'}
                            className={'rounded-lg py-2 pl-8'}
                        />
                    </Form.Item>

                    <Form.Item
                        shouldUpdate
                        label="Destination"
                        name="destination"
                        rules={[{required: true, message: 'Please input your destination!'}]}
                        className={'relative'}
                        onChange={onChangeDestination}
                        extra={form.getFieldValue()?.destination ? 'To : ' + (form.getFieldValue()?.destination || '') : ''}
                    >
                        <SlLocationPin className={'absolute top-2.5 left-2 z-10'} size={18}/>
                        <Input
                            onBlur={() => {
                                setLoading(false)
                                setListName()
                            }}
                            onFocus={(e) => handleOnFocus(e, 'destination')}
                            placeholder={'To...'}
                            className={'rounded-lg py-2 pl-8'}
                        />
                    </Form.Item>

                    {
                        (form.getFieldValue()?.destination && form.getFieldValue()?.location) &&
                        <Button type="primary" htmlType="submit" className={'bg-teal-400 hover:bg-teal-300 text-gray-700 text-black font-medium text-[14px]'}>Confirm Location</Button>
                    }
                </Form>

                <div className="min-h-[100px] bg-gray-50 rounded-md mt-5">
                    <h6 className={'text-twContent font-medium py-2 px-2 text-[15px] mb-2'}><span
                        className={' border-b pb-1 inline-block'}>Select Your Location: </span></h6>
                    {
                        addresses?.length > 0 ?
                            <div className={'space-y-3 mb-3'}>
                                {
                                    addresses?.map((data, i) => <div key={i} className={''}>
                                        <p
                                            onClick={() => {
                                                dispatch(storeUserMapLocation(data))
                                                setAddresses()
                                                setRefresh(true)
                                            }}
                                            className={'bg-gray-50 hover:bg-gray-200 hover:cursor-pointer text-gray-500 border-2 border-cyan-500 border-opacity-30 py-1 px-2 rounded-md flex items-center gap-2 mx-2'}
                                        >
                                            <IoIosArrowDropright className={'text-cyan-500 text-opacity-60'} size={18}/>
                                            {data?.formatted_address}
                                        </p>
                                    </div>)
                                }
                            </div>
                            :
                            <div>
                                {
                                    (loading && listName === 'location') &&
                                    <Skeleton active className={'pb-4 px-2'}/>
                                }
                            </div>
                    }
                    {
                        destinationAddresses?.length > 0 ?
                            <div className={'space-y-3 mb-3'}>
                                {
                                    destinationAddresses?.map((data, i) => <div key={i} className={''}>
                                        <p
                                            onClick={() => {
                                                dispatch(storeUserMapDestination(data))
                                                setDestinationAddresses()
                                                setRefresh(true)
                                            }}
                                            className={'bg-gray-50 hover:bg-gray-200 hover:cursor-pointer text-gray-500 border-2 border-cyan-500 border-opacity-30 py-1 px-2 rounded-md flex items-center gap-2 mx-2'}
                                        >
                                            <IoIosArrowDropright className={'text-cyan-500 text-opacity-60'} size={18}/>
                                            {data?.formatted_address}
                                        </p>
                                    </div>)
                                }
                            </div>
                            :
                            <div>
                                {
                                    (loading && listName === 'destination') &&
                                    <Skeleton active className={'pb-4 px-2'}/>
                                }
                            </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default RideLocationDestination;