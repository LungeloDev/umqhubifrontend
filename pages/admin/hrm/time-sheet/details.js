import { ButtonGroup, Table } from "reactstrap";
import { fetchTimeSheet } from "../../../../helpers/backend_helper";
import moment from "moment";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import PageTitle from "../../../../components/common/page-title";
import MyCard from "../../../../components/common/MyCard";
import AdminLayout from "../../../../layouts/admin";
import { useI18n } from "../../../../contexts/i18n";

const TimeSheet = () => {
    const [type, setType] = useState('day')
    const i18n = useI18n();
    const [start, setStart] = useState()
    const [end, setEnd] = useState()
    const [activity, setActivity] = useState()
    const [days, setDays] = useState([])

    useEffect(() => {
        if (start) {
            setActivity(undefined)
            fetchTimeSheet({
                from: start?.toDate(),
                to: end?.toDate(),
                restaurant_id: localStorage.getItem('pickgo_restaurant') || ''
            })
                .then(({ error, data }) => {
                    if (error === false) {
                        setActivity(data)
                    }
                })
        }
        let days = []
        for (let i = start?.clone(); end?.isAfter(i); i?.add(1, 'days')) {
            days.push(i?.clone())
        }
        setDays(days)

    }, [start])

    useEffect(() => {
        setStart(moment().startOf(type))
        setEnd(moment().endOf(type))
    }, [type])


    let employeeMap = {}
    const getTimes = activity => {
        return {
            punch_in: {
                hour: moment(activity.punch_in).hours(),
                minute: moment(activity.punch_in).minutes(),
            },
            punch_out: {
                hour: moment(activity.punch_out || undefined).hours(),
                minute: moment(activity.punch_out || undefined).minutes(),
            }
        }
    }
    if (Array.isArray(activity)) {
        if (type === 'day') {
            activity?.forEach(activity => {
                let employee = employeeMap[activity?.employee_id]
                if (employee) {
                    employee.times.push(getTimes(activity))
                    employee.total += activity.working_time
                } else {
                    employeeMap[activity?.employee_id] = {
                        name: `${activity?.employee?.name}`,
                        times: [getTimes(activity)],
                        total: activity.working_time,
                    }
                }
            })
        } else {
            activity?.forEach(activity => {
                let employee = employeeMap[activity?.employee_id]
                if (employee) {
                    employee.times = {
                        [activity.date]: activity.working_time + (employee.times[activity.date] || 0)
                    }
                    employee.total += activity.working_time
                } else {
                    employeeMap[activity?.employee_id] = {
                        name: `${activity?.employee?.name}`,
                        times: {
                            [activity.date]: activity.working_time
                        },
                    }
                }
            })
        }
    }
    let employee = Object.values(employeeMap)
    const Toggle = ({ value, label }) => <button className={type === value ? 'btn btn-primary' : 'btn btn-light btn btn-outline-secondary'} onClick={() => setType(value)} > {label} </button>

    let colors = ['#009688', '#E57373', '#5C6BC0', '#03A9F4', '#EC407A', '#AB47BC', '#7E57C2']

    return (
        <>
            <PageTitle title={!!i18n && i18n?.t("Time Sheet")} />
            <MyCard
                title={!!i18n && i18n?.t("Time Sheet")}
                rightAction={(
                    <div className="flex items-center">
                        <div className="me-3 flex items-center">
                            <FiChevronLeft
                                onClick={() => {
                                    setStart(start?.clone().add(-1, type))
                                    setEnd(end?.clone().add(-1, type).endOf(type))
                                }}
                                size={22}
                                role="button"
                                className="mr-1.5" />
                            <input className="form-control bg-white text-center" style={{ width: 160 }} value={`${start?.format('Do, MMM')} ${type !== 'day' ? ' - ' + end?.format('Do, MMM') : ''}`} readOnly />
                            <FiChevronRight
                                role="button"
                                onClick={() => {
                                    setStart(start?.clone().add(1, type))
                                    setEnd(end?.clone().add(1, type).endOf(type))
                                }}
                                size={22} className="ml-1.5" />
                        </div>
                        <ButtonGroup>
                            <Toggle value="month" label="Month" />
                            <Toggle value="day" label="Day" />
                            <Toggle value="week" label="Week" />
                        </ButtonGroup>
                    </div>
                )}
            >
                <div className="table-responsive">
                    <Table style={{ minWidth: type === 'month' ? 2000 : 800 }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                {type === 'day' ? (
                                    <>
                                        <th>12 AM</th>
                                        <th>3 AM</th>
                                        <th>6 AM</th>
                                        <th>9 AM</th>
                                        <th>12 PM</th>
                                        <th>3 PM</th>
                                        <th>6 PM</th>
                                        <th>9 PM</th>
                                        <th>12 AM</th>
                                    </>
                                ) : (
                                    <>
                                        {days?.map((day, index) => <th key={index}>{day.format(type === 'week' ? 'ddd' : 'D')}</th>)}
                                    </>
                                )}
                                <th>Total</th>
                            </tr>
                        </thead>
                        {/* <TableLoader loading={!activity}> */}
                        {employee?.map((employee, ind) => (
                            <tr key={ind}>
                                <td>{employee.name}</td>
                                {type === 'day' ? Array.from({ length: 9 }).map((_, index) => {
                                    let start = index * 3
                                    let end = start + 2
                                    return (
                                        <td className="px-0 relative" key={index}>
                                            {employee.times?.map((times, index) => {
                                                if (times.punch_in.hour >= start && times.punch_in.hour <= end) {
                                                    if (times.punch_out.hour >= start && times.punch_out.hour <= end) {
                                                        let startTime = ((times.punch_in.hour - start) * 60 + times.punch_in.minute) / 180 * 100
                                                        let endTime = 100 - ((times.punch_out.hour - start) * 60 + times.punch_out.minute) / 180 * 100
                                                        return <div key={index}
                                                            style={{ left: `${startTime}%`, right: `${endTime}%`, backgroundColor: colors[ind % colors.length] }}
                                                            className="h-3 absolute top-1 rounded-md" />
                                                    } else {
                                                        let startTime = ((times.punch_in.hour - start) * 60 + times.punch_in.minute) / 180 * 100
                                                        return <div key={index} style={{ left: `${startTime}%`, right: '0%', backgroundColor: colors[ind % colors.length] }}
                                                            className="h-3 absolute top-1 rounded-l-md" />
                                                    }
                                                }
                                                if (times.punch_out.hour >= start && times.punch_out.hour <= end) {
                                                    let endTime = 100 - ((times.punch_out.hour - start) * 60 + times.punch_out.minute) / 180 * 100
                                                    return <div key={index} style={{ left: `0%`, right: `${endTime}%`, backgroundColor: colors[ind % colors.length] }}
                                                        className="h-3 absolute top-1 rounded-r-md" />
                                                }
                                                if (times.punch_in.hour < start && times.punch_out.hour > end) {
                                                    return <div key={index} style={{ left: '0%', right: '0%', backgroundColor: colors[ind % colors.length] }}
                                                        className="h-3 absolute top-1" />
                                                }
                                                return <span key={index} />
                                            })}
                                        </td>
                                    )
                                }) : (
                                    <>
                                        {days?.map((day, index) => <td key={index}>{getTimeFormat(employee.times[day.format('YYYY-MM-DD')] || 0)}</td>)}
                                    </>
                                )}
                                <td className="">
                                    {getTimeFormat(type === 'day' ? employee.total : Object.values(employee.times).reduce((acc, item) => acc + (item || 0), 0))}
                                </td>
                            </tr>
                        ))}
                    </Table>
                </div>
            </MyCard>
        </>
    )
}
TimeSheet.layout = AdminLayout
export default TimeSheet

export const getTimeFormat = seconds => {
    return seconds > 0 ? `${(seconds / 3600).toFixed(0)}:${((seconds / 60 >> 0) % 60).toString().padStart(2, '0')}` : ''
}