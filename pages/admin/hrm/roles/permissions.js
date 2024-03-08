import Head from 'next/head';
import {useRouter} from 'next/router';
import React from 'react';
import {useSite} from '../../../../contexts/site';
import AdminLayout, {havePermission} from '../../../../layouts/admin';
import {Checkbox} from "antd";
import Table from '../../../../components/common/table';
import Button from '../../../../components/common/button';
import {useFetch, useAction} from '../../../../helpers/hooks';
import {fetchPermissions, fetchRole, postPermissions} from '../../../../helpers/backend_helper';
import {useUserContext} from '../../../../contexts/user';
import {useState} from 'react';
import {useEffect} from 'react';
import PageTitle from "../../../../components/common/page-title";
import Card from "../../../../components/common/card";

const Roles = () => {
    const site = useSite();
    const {query, push} = useRouter()
    const [role, getRoles] = useFetch(fetchRole)
    const [elements] = useFetch(fetchPermissions)
    const user = useUserContext();
    const [update, setUpdate] = useState(false)
    const reload = () => setUpdate(!update)
    const [permissions, setPermissions] = useState([])

    useEffect(() => {
        if (query?._id) {
            getRoles({...query, permissions: true})
        }
    }, [query?._id])

    useEffect(() => {
        if (role?._id) {
            setPermissions(role?.permissions)
        }
    }, [role?._id])

    const isChecked = data => {
        if (data?.child) {
            for (let c of data.child) {
                if (permissions?.includes(c?.permission)) {
                    return true
                }
            }
        }
        if (permissions.includes(data?.permission)) {
            return true
        }
        return false
    }

    const handleChange = (e, data) => {
        if (e.target.checked === true) {
            if (data.child) {
                setPermissions([...permissions, ...data?.child?.map(d => d.permission)])
            } else {
                permissions.push(data.permission)
            }
        } else {
            let p = data?.child ? data?.child?.map(d => d.permission) : [data.permission]
            setPermissions(permissions?.filter(d => !p.includes(d)))
        }
        reload()
    }

    const admin = user?.role === 'admin' ;
    const Check = ({d}) => <Checkbox onChange={e => handleChange(e, d)} checked={isChecked(d)}/>

    const columns = [
        {text: '#', dataField: '', formatter: (_, d) => <Check d={d}/>},
        {text: 'Name', dataField: 'name'},
        {
            text: 'Create',
            dataField: '',
            formatter: (_, data) => data.child && (admin || havePermission(`${data?.permission}_create`, user?.permission)) &&
                <Check d={data?.child?.find(d => d.permission === `${data?.permission}_create`)}/>
        },
        {
            text: 'Edit',
            dataField: '',
            formatter: (_, data) => data.child && (admin || havePermission(`${data?.permission}_edit`, user?.permission)) &&
                <Check d={data?.child?.find(d => d.permission === `${data?.permission}_edit`)}/>
        },
        {
            text: 'Delete',
            dataField: '',
            formatter: (_, data) => data.child && (admin || havePermission(`${data?.permission}_delete`, user?.permission)) &&
                <Check d={data?.child?.find(d => d.permission === `${data?.permission}_delete`)}/>
        },
        {
            text: 'View',
            dataField: '',
            formatter: (_, data) => data.child && (admin || havePermission(`${data?.permission}_show`, user?.permission)) &&
                <Check d={data?.child?.find(d => d.permission === `${data?.permission}_show`)}/>
        },
    ]

    return (
        <>
            <PageTitle title="Roles"/>
            <Card>
                <h2 className="text-xl">Permissions - <span className="text-danger">( {role?.name} )</span></h2>
                <Table
                    noHeader
                    pagination={false}
                    noActions={true}
                    shadow={false}
                    columns={columns}
                    data={elements?.filter(d => {
                        if (admin) {
                            return true
                        }
                        if (havePermission(d.permission, user?.permission)) {
                            return true
                        }
                        if (d?.child) {
                            for (let c of d.child) {
                                if (havePermission(c.permission, user?.permission)) {
                                    return true
                                }
                            }
                        }
                        return false
                    })?.map(d => {
                        return {
                            ...d,
                            child: d?.child ? admin ? d.child : d.child?.filter(d => havePermission(d.permission, user?.permission)) : undefined
                        }
                    })}
                />
                <Button onClick={() => {
                    return useAction(postPermissions, {role: query._id, permissions}, () => {
                        push('/admin/hrm/roles')
                    })
                }}>Save</Button>
            </Card>
        </>
    )
}
Roles.layout = AdminLayout
export default Roles;