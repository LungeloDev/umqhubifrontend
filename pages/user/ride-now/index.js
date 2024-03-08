import React, {useEffect, useState} from 'react';
import {Button, Drawer, Form, Radio, Space} from 'antd';
import UserLayout from "../../../layouts/user";
import {useFetch} from "../../../helpers/hooks";
import {fetchOnGoingRide, fetchServiceCategoryList} from "../../../helpers/backend_helper";
import SearchInput from "../../../components/form/search";
import SlickServiceCategories from "../../../components/user/ride/service_categories";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ServiceLocationMap from "../../../components/user/ride/map";
import RideLocationDestination from "../../../components/user/ride/ride_location_destination";
import {useRouter} from "next/router";
import {storeUserMapDestination, storeUserMapLocation} from "../../../redux/user-ride/actions";
import {useDispatch} from "react-redux";

const RideNow = () => {
    const {push} = useRouter();
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const [serviceCategories, setServiceCategories] = useFetch(fetchServiceCategoryList);
    const [locationSearch, setLocationSearch] = useState()
    const [location, setLocation] = useState({lat: 0, lng: 0});
    const [address, setAddress] = useState({lat: 0, lng: 0});
    const [serviceCategory, setServiceCategory] = useState()
    const [searchInput, setSearchInput] = useState(true)
    const [open, setOpen] = useState(false);

    useEffect(()=>{
        if (!!serviceCategory) {
            dispatch(storeUserMapLocation({}))
            dispatch(storeUserMapDestination({}))
        }
    },[serviceCategory])

    const handleOnnFocus = (e = {}) => {
        if(e?.type === 'focus' && serviceCategory?._id) {
            setOpen(true);
        }
    }

    useEffect(() => {
        fetchOnGoingRide().then(async userMSG => {
            if(userMSG?.error === false) {
                await push('/user/ride-now/ride')
            }
        })
    }, [])

    return (
        <section className={'relative'}>
            <ServiceLocationMap  setLocation={setLocation} setAddress={setAddress} />
            <div className={'flex justify-center'}>
                <div className={'absolute bottom-[20%] md:left-[5%] h-[200px] w-[90vw] md:w-1/2  bg-amber-200 rounded-md'}>
                    <div className={'mt-8'} title={`${searchInput === true && 'Please select a service first'}`}>
                        <SearchInput disabled={searchInput} onFocus={handleOnnFocus} className="w-full ml-1" placeholder={`${searchInput === true ? 'Please select a service first' : "Where would you go?"}`} onChange={e => setLocationSearch(e.target.value)}/>
                    </div>
                    {/*category services*/}
                    <div className={'mx-[5%]'}>
                        <SlickServiceCategories setSearchInput={setSearchInput} serviceCategory={serviceCategory} categories={serviceCategories?.categories} setServiceCategory={setServiceCategory} />
                    </div>
                </div>
            </div>

            <Drawer
                title="Location Details"
                placement={'bottom'}
                closable={true}
                onClose={() => setOpen(false)}
                visible={open}
                key={'bottom'}
                height={550}
                destroyOnClose
            >
                <RideLocationDestination
                    serviceCategory={serviceCategory}
                    form={form}
                />
            </Drawer>
        </section>
    );
};

RideNow.layout = UserLayout;
export default RideNow;