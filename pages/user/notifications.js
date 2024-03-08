import { Badge } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import Card from '../../components/common/card';
import { useI18n } from '../../contexts/i18n';
import { useUserContext } from '../../contexts/user';
import { fetchDashboardNotification, postDashboardNotification } from '../../helpers/backend_helper';
import { useFetch } from '../../helpers/hooks';
import UserLayout from '../../layouts/user';

const UserNotifications = () => {
    const i18n = useI18n()
    const user = useUserContext()
    const { push } = useRouter()
    const [notification, getNotification] = useFetch(fetchDashboardNotification)

    const handleChange = async (id, ticket_id) => {
        await postDashboardNotification({ _id: id })
        getNotification()
        push(`/${user?.role}/support-ticket/${ticket_id}`)
    }

    return (
        <div>
            <Card>
                <h1 className="text-gray-600 text-[16px] font-semibold tracking-wider">{!!i18n && i18n?.t("Notifications")}</h1>
            </Card>
            <Card>
                <div className='max-w-screen-sm mx-auto '>
                    {
                        notification?.notifications?.map(notification => <Badge
                            key={notification?._id}
                            dot={!notification?.read}
                            className='flex justify-between items-center border !border-twPrimary rounded-lg px-[14px] py-[15px] my-2'>
                            <div>
                                <p className='font-normal text-twContent'>{notification?.title}: {notification?.data?.ticket_id}</p>
                            </div>
                            <div>
                                <button onClick={() => handleChange(notification?._id, notification?.data?.ticket_id)} className='rounded-lg px-6 py-2 bg-twPrimary text-[#121212] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg'>Details</button>
                            </div>
                        </Badge>)
                    }
                </div>
            </Card>
        </div>
    );
};

UserNotifications.layout = UserLayout
export default UserNotifications;