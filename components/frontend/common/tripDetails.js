import {Card, Rate} from "antd";
import {useState} from "react";
import {useI18n} from "../../../contexts/i18n";
import {fetchProfile} from "../../../helpers/backend_helper";
import Table from "../../common/table"

const TripDetails = ({tripDetails, getTripDetails, currency_code}) => {
    const i18n = useI18n();
    const [role, setRole] = useState(null)

    fetchProfile().then(({error, data}) => {
        if (error === false) {
            setRole(data?.role)
        }
    })

    const column = [
        {
            dataField: '_id', text: 'Id',
            formatter: (_, data) => (<div className=''> <span className='capitalize'>{data?._id}</span></div>)
        },
        {
            dataField: 'amount', text: 'Amount',
            formatter: (_, data) => (<div className=''> <span className=''>{data?.amount}</span></div>)
        },
        {
            dataField: 'method', text: 'Method',
            formatter: (_, data) => (<div className=''> <span className=''>{data?.method}</span></div>)
        },
    ];

    return (
        <div>
            {/* header  */}
            <div className="h-16 border bg-white flex items-center justify-center text-[18px] font-semibold rounded-md">
                <h1 className="">{!!i18n && i18n?.t("Trip Details")}</h1>
            </div>

            {/* Trip Information  */}
            <Card className="shadow-sm mt-4 " title={!!i18n && i18n?.t("Trip Details")} >
                <div className="lg:flex mb-[4px] gap-10">
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold">{!!i18n && i18n?.t("Pickup Location")}</h1>
                        <div className="mt-3">
                            <iframe
                                title="Map"
                                src={`https://maps.google.com/maps?q=${tripDetails?.pickupLocation?.lat},${tripDetails?.pickupLocation?.lng}&output=embed`}
                                className="w-full"
                                height="350"
                                style={{border: 0}}
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                    <div className="flex-1 ">
                        <h1 className="text-lg font-semibold ">{!!i18n && i18n?.t("Drop Address")}</h1>
                        <div className="mt-3">
                            <iframe
                                title="Map"
                                src={`https://maps.google.com/maps?q=${tripDetails?.dropLocation?.lat},${tripDetails?.dropLocation?.lng}&output=embed`}
                                className="w-full"
                                height="350"
                                style={{border: 0}}
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </Card >

            {/* Rating  */}
            <Card title={!!i18n && i18n?.t("Rating")} className="shadow-sm mt-2">
                <div>
                    <div className="mt-1 space-y-2">
                        <h4 className="text-md font-semibold"> Rating: {<Rate allowHalf value={tripDetails?.rating?.rating} disabled />}</h4>
                        <h4 className="text-md font-semibold"> Comment: {tripDetails?.rating?.comment}</h4>
                    </div>
                </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-x-10 h-fit">
                <div className="grid grid-cols-1">

                    {/* driver details  */}
                    <Card className="shadow-sm mt-[10px] " title={!!i18n && i18n?.t("Driver Details")}>
                        <div className="grid grid-cols-3 border-b py-[8px] px-2 items-center">
                            <p>Photo</p>
                            <img className="h-28" src={tripDetails?.driver?.image} alt="" />
                        </div>
                        <div className="grid grid-cols-3 border-b py-[8px] px-2 capitalize">
                            <p>Name</p>
                            <p className="col-span-2 ">{tripDetails?.driver?.name}</p>
                        </div>
                        <div className="grid grid-cols-3 border-b py-[8px] px-2">
                            <p>Phone</p>
                            <p className="col-span-2 ">{tripDetails?.driver?.phone}</p>
                        </div>
                        <div className="grid grid-cols-3 border-b py-[8px] px-2">
                            <p>Email</p>
                            <p className="col-span-2 ">{tripDetails?.driver?.email}</p>
                        </div>
                    </Card>

                    {/* payment information */}
                    <Card className="shadow-sm mt-[10px]" title={!!i18n && i18n?.t("Payment Details")}>
                        <div className="grid grid-cols-3 border-b py-[8px] px-2">
                            <p>Total Distance</p>
                            <p className="col-span-2 ">{tripDetails?.distance.toFixed(2)} km</p>
                        </div>
                        <div className="grid grid-cols-3 border-b py-[8px] px-2">
                            <p>SubTotal</p>
                            <p className="col-span-2 ">{`${currency_code ? currency_code : ""} ${tripDetails?.subtotal.toFixed(2) || 0}`}</p>
                        </div>
                        <div className="grid grid-cols-3 border-b py-[8px] px-2">
                            <p>Discount</p>
                            <p className="col-span-2 ">{`${currency_code ? currency_code : ""} ${tripDetails?.discount?.amount.toFixed(2) || 0}`}</p>
                        </div>
                        <div className="grid grid-cols-3 border-b py-[8px] px-2">
                            <p>VAT</p>
                            <p className="col-span-2 ">{`${currency_code ? currency_code : ""} ${tripDetails?.vat?.toFixed(2) || 0}`}</p>
                        </div>
                        <div className="grid grid-cols-3 border-b py-[8px] px-2">
                            <p>Total Fare</p>
                            <p className="col-span-2 ">{`${currency_code ? currency_code : ""} ${tripDetails?.total.toFixed(2) || 0}`}</p>
                        </div>
                        <div className="grid grid-cols-3 border-b py-[8px] px-2">
                            <p>Paid</p>
                            <p className="col-span-2 inline-block text-green-500">{`${currency_code ? currency_code : ""} ${tripDetails?.paid.toFixed(2) || 0}`} </p>
                        </div>
                        {
                            tripDetails?.total - tripDetails?.paid > 0 &&
                            (<div className="grid grid-cols-3 border-b py-[8px] px-2">
                                <p>Due</p>
                                <p className="col-span-2 inline-block text-red-500">{`${currency_code ? currency_code : ""} ${tripDetails?.due.toFixed(2) || 0}`} </p>
                            </div>)
                        }
                        {role === "driver" ?
                            <div className="grid grid-cols-3 border-b py-[8px] px-2">
                                <p>Earning</p>
                                <p className="col-span-2 inline-block text-blue-500">{`${currency_code ? currency_code : ""} ${tripDetails?.subtotal.toFixed(2) || 0}`} <span className='text-twWarning'>{tripDetails?.due > 0 ? "(expected)" : ""}</span></p>
                            </div>
                            :
                            <div className="grid grid-cols-3 border-b py-[8px] px-2">
                                <p>Driver Earning</p>
                                <p className="col-span-2 inline-block text-blue-500">{`${currency_code ? currency_code : ""} ${tripDetails?.subtotal.toFixed(2) || 0}`} <span className='text-twWarning'>{tripDetails?.due > 0 ? "(expected)" : ""}</span></p>
                            </div>
                        }

                        {/* payment breakdown  */}
                        {
                            tripDetails?.paid > 0 &&
                            <div className='mt-3'>
                                <Table
                                    title={"Payment Breakdown"}
                                    columns={column}
                                    data={tripDetails?.payments}
                                    pagination={false}
                                    noActions={true}
                                    indexed={true}
                                    shadow={false}
                                    onReload={getTripDetails}
                                    textCenter={true}
                                />
                            </div>
                        }
                    </Card>
                </div>

                {/* user Information  */}
                <div className="grid grid-cols-1 h-fit">
                    <Card className="shadow-sm mt-[10px] " title={!!i18n && i18n?.t("Customer Details")}>
                        <div className="grid grid-cols-3 border-b py-[8px] px-2 capitalize">
                            <p>Name</p>
                            <p className="col-span-2 ">{tripDetails?.user?.name}</p>
                        </div>
                        <div className="grid grid-cols-3 border-b py-[8px] px-2">
                            <p>Phone</p>
                            <p className="col-span-2 ">{tripDetails?.user?.phone}</p>
                        </div>
                        <div className="grid grid-cols-3 border-b py-[8px] px-2">
                            <p>Email</p>
                            <p className="col-span-2 ">{tripDetails?.user?.email}</p>
                        </div>
                    </Card>

                    {/* vehicle info  */}
                    <Card className="shadow-sm mt-[10px] " title={!!i18n && i18n?.t("Vehicle Details")}>
                        <div className="grid md:grid-cols-3 border-b py-[8px] px-2 items-center">
                            <p>Photo</p>
                            <img className="h-28" src={tripDetails?.vehicle?.images[0]} alt="" />
                        </div>
                        <div className="grid grid-cols-3 border-b py-[8px] px-2">
                            <p>Vehicle Name</p>
                            <p className="col-span-2 ">{tripDetails?.vehicle?.name}</p>
                        </div>
                        <div className="grid grid-cols-3 border-b py-[8px] px-2">
                            <p>Model</p>
                            <p className="col-span-2 ">{tripDetails?.vehicle?.model_name}</p>
                        </div>
                    </Card>
                </div>
            </div >
        </div >
    );
};

export default TripDetails;
