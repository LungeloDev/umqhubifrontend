import {Form, message, Switch} from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, {useEffect, useState} from 'react';
import Button from '../../../../components/common/button';
import Table from '../../../../components/common/table';
import { useSite } from '../../../../contexts/site';
import {
    delServiceLocation,
    fetchServiceLocations,
    postServiceLocation, postSettings,
} from '../../../../helpers/backend_helper';
import { useAction, useFetch } from '../../../../helpers/hooks';
import AdminLayout from "../../../../layouts/admin";
import Card from '../../../../components/common/card';
import { initI18n } from '../../../../contexts/i18n';
import FormInput from "../../../../components/form/input";


const LocationService = () => {
    const site = useSite();
    const i18n = initI18n();
    const [form] = Form.useForm();
    const { push } = useRouter();
    const [locations, getLocations, { loading, error }] = useFetch(fetchServiceLocations);

    useEffect(() => {
        if(!!site?.max_distance || site.max_distance === 0) {
            form.setFieldsValue({max_distance: site?.max_distance})
        }
    }, [site?.max_distance]);

    let columns = [
        {
            dataField: 'name', text: 'Name',
            formatter: name => <span className='capitalize'>{name}</span>
        },
        {
            dataField: 'address', text: 'Address',
            formatter: address => <span className=''>{address}</span>
        },
        {
            dataField: 'country', text: 'Country',
            formatter: country => <span className='capitalize'>{country}</span>
        },
        {
            dataField: 'location_type', text: 'Location Type',
            formatter: location_type => <span className=''>{location_type}</span>
        },
        {
            dataField: 'timezone', text: 'Timezone',
            formatter: timezone => <span className='capitalize'>{timezone?.label}</span>
        },
        {
            dataField: 'active', text: 'Active Status',
            formatter: (active, data) =>  <Switch onChange={(e) => useAction(postServiceLocation, {_id: data?._id, active: e}, ()=> getLocations())} checkedChildren={'Active'} unCheckedChildren={'Inactive'} checked={active} />
        },
    ];


    let action = (
        <div className="flex">
            <Button className="mr-2" onClick={() => { push('/admin/services/location/add') }}>
                {!!i18n && i18n?.t("Add Location")}
            </Button>
        </div>)


    return (
        <section>
            <Head>
                <title>Locations</title>
            </Head>
            <Card className={'shadow-sm text-font_color font-semibold'}>
                <h1 className=''>
                    {!!i18n && i18n?.t("Service Location List")}
                </h1>
            </Card>
            <Card className={'shadow-sm text-font_color font-semibold'}>
                <Form
                    form={form}
                    onFinish={async (values) => {
                        return useAction(postSettings, values, () => {getLocations()})
                    }}
                    layout={'vertical'}
                >
                    <FormInput
                        name={'max_distance'}
                        label={!!i18n && i18n?.t('The maximum search distance from the user (in meters)')}
                        required
                        placeholder={!!i18n && i18n?.t('Please enter maximum distance')}
                        type={'number'}
                        extra={'Set 0 (zero) to remove search limitations' }
                    />

                    <Button>Submit</Button>
                </Form>
            </Card>
            <div className='card_container'>
                <Table
                    columns={columns}
                    data={locations}
                    pagination={true}
                    noActions={false}
                    action={action}
                    indexed={true}
                    shadow={false}
                    onEdit={(data) => {
                        push(`/admin/services/location/edit?_id=${data._id}`)
                    }}
                    onDelete={delServiceLocation}
                    onReload={getLocations}
                    error={error}
                    loading={loading}
                />
            </div>
        </section>
    );
};
LocationService.layout = AdminLayout;
export default LocationService;