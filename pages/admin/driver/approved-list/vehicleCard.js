import React from 'react';
import Card from '../../../../components/common/card';

const VehicleCard = ({ data }) => {

    return (
        <div>
            {/* vehicle information */}
            <Card>
                <div className="border-b gap-3 pt-2">
                    <span className="text-lg font-medium text-twContent">Name : </span>
                    <span className="text-lg capitalize text-teal-500">{data?.name} - {data?.model_name}</span>
                </div>
                <div className="border-b pt-2">
                    <span className="text-lg font-medium text-twContent">Service : </span>
                    <span className="text-lg capitalize text-teal-500">{data?.service?.name}</span>
                </div>
                <div className="border-b pt-2">
                    <span className="text-lg font-medium text-twContent">Service Category : </span>
                    <span className="text-lg capitalize text-teal-500">{data?.categories?.name}</span>
                </div>
            </Card>

            {/* Vehicle Image  */}
            <Card>
                <h3 className='text-gray-600 text-[16px] font-semibold tracking-wider mb-2'>Vehicle Images:</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    {
                        data?.images?.map((image, i) => <img key={i} className='shadow-sm' src={image} />)
                    }
                </div>
            </Card>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {/* vehicle specification  */}
                <Card>
                    <h3 className='text-gray-600 text-[16px] font-semibold tracking-wider'>Vehicle specification:</h3>
                    <div>
                        {data &&
                            Object.entries(data?.specifications).map(([key, value]) => (
                                <div key={value} className="grid grid-cols-2 border-b pt-2">
                                    <span className="text-lg font-medium text-twContent">{key}</span>
                                    <span className="text-lg font-bold text-twContent">{value}</span>
                                </div>
                            ))
                        }
                    </div>
                </Card>

                {/* vehicle features  */}
                <Card>
                    <h3 className='text-gray-600 text-[16px] font-semibold tracking-wider'>Vehicle Features:</h3>
                    <div>
                        {
                            data &&
                            Object.entries(data?.features).map(([key, value]) => (
                                <div key={value} className="grid grid-cols-2 border-b pt-2">
                                    <span className="text-lg font-medium text-twContent">{key}</span>
                                    <span className="text-lg font-bold text-twContent">{value}</span>
                                </div>
                            ))
                        }
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default VehicleCard;