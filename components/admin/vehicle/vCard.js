import {useRouter} from 'next/router';
import React from 'react';
import {TiEdit} from 'react-icons/ti';
import swalAlert from '../../common/alert';
import {RiDeleteBin6Line} from 'react-icons/ri';
import {ImPriceTags} from 'react-icons/im';
import {delService} from "../../../helpers/backend_helper";
import {useAction} from "../../../helpers/hooks";

const VehicleCard = ({data = {}, getVehicles}) => {
    const router = useRouter();

    const handleEditButton = (id) => {
        router.push(`/admin/services/edit/?_id=${id}`)
    }

    // delete
    const handleDeleteButton = async (id) => {
        let {isConfirmed} = await swalAlert.confirm(
            "Are you want to delete this Vehicle",
            "Yes, Delete"
        );
        if (isConfirmed) {
            await useAction(delService, {_id: id}, () => {
                getVehicles();
            })
        }
    };


    return (
        <section className='border-[1px] rounded border-main h-[400px] my-2'>
            <img className='h-[250px] w-[350px] mx-auto shadow-sm rounded p-2 mt-2' src={data?.image}
                 style={{objectFit: 'cover', objectPosition: '50% 50%'}} alt=""/>

            <div className='relative  h-[140px] mx-2'>
                <p className='text-[22px] font-medium capitalize my-2 mx-2'>{data?.name}</p>
                <p className='text-[16px] mx-2'>{data?.description}</p>
                <div className='flex flex-wrap items-center justify-between absolute bottom-4 mx-2 w-[95%] text-[14px]'>
                    {/*<span className='mb-0'>Riders: {data?.totalRegisteredCount ?? '0'}</span>*/}
                    <div className='flex gap-2'>
                        <button onClick={() => handleEditButton(data?._id)}
                                className='bg-green-500  p-2 text-white rounded' title="Update"><TiEdit/>
                        </button>
                        <button onClick={() => handleDeleteButton(data?._id)}
                                className='bg-red-500  p-2 text-white rounded' title="Delete">
                            <RiDeleteBin6Line/></button>
                        <button className='bg-cyan-500  p-2 text-white rounded' title="Set price"
                                onClick={() => router.push('/admin/services/fare-management')}><ImPriceTags/></button>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default VehicleCard;