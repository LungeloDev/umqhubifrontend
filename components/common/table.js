import SearchInput from "../form/search";
import {FaEye, FaPencilAlt, FaTimes, FaTrashAlt} from "react-icons/fa";
import {useActionConfirm} from "../../helpers/hooks";
import ReactPaginate from "react-paginate";
import {Modal} from "antd";
import {useState} from "react";
import {Loader} from "./preloader";
import {useUserContext} from "../../contexts/user";
import {havePermission} from "../../layouts/admin";
import {useI18n} from "../../contexts/i18n";
import Pagination from "./pagination";

const Table = ({
                   columns,
                   data,
                   indexed,
                   loading = false,
                   noActions,
                   actions,
                   afterActions,
                   action,
                   onView,
                   onEdit,
                   onDelete,
                   onReload,
                   pagination = false,
                   shadow = true,
                   title,
                   permission,
                   noHeader = false,
                   afterSearch,
                   onSearchChange,
               }) => {

    const i18n = useI18n()
    const {roles} = useUserContext()
    const checkPermissions = name => {
        if (permission) {
            return havePermission(name, roles)
        }
        return true
    }

    let cols = noActions ? columns : [...columns, {
        text: 'Action',
        dataField: 'no_actions',
        className: 'w-auto text-right',
        formatter: (noActions, data) => {
            return (
                <div className="flex justify-end">
                    {actions && actions(data)}
                    {onView && (
                        <button className="btn btn-outline-success btn-sm focus:shadow-none me-2"
                                title="View" onClick={() => onView(data)}>
                            <FaEye/>
                        </button>
                    )}
                    {data.disableEdit === 1 && !onView && data.disableDelete === 1 && !actions && '-'}
                    {onEdit && checkPermissions(permission + '_edit') && (data?.disableEdit !== 1) && (
                        <button className="btn btn-outline-primary btn-sm focus:shadow-none me-2"
                                title="Edit" onClick={() => onEdit(data)}>
                            <FaPencilAlt/>
                        </button>
                    )}
                    {onDelete && checkPermissions(permission + '_delete') && (data?.disableDelete !== 1) && (
                        <button className="btn btn-outline-danger btn-sm focus:shadow-none me-2"
                                title="Delete" onClick={async () => {
                            await useActionConfirm(
                                onDelete,
                                {_id: data._id},
                                onReload, 'Are you sure you want to delete this item?', 'Yes, Delete', !!i18n.t ? i18n.t() : false)
                        }}>
                            <FaTrashAlt/>
                        </button>
                    )}
                    {afterActions && afterActions(data)}
                </div>
            )
        }
    }]


    return (
        <>
            <div className={`w-full bg-white ${shadow ? 'shadow-lg' : ''} rounded-sm mb-4`}>
                {noHeader || (
                    <header className="px-4 pt-3 pb-2 border-b border-gray-100 flex justify-between flex-wrap">
                        {title ? (
                            <>
                                {typeof title === 'string' ?
                                    <h4 className="text-base font-medium text-gray-700">{title}</h4> : title}
                            </>
                        ) : (
                            <div className="flex flex-wrap ">
                                <SearchInput className="w-60 " onChange={e => {
                                    onReload({search: e.target.value || undefined, page: 1})
                                    onSearchChange && onSearchChange(e.target.value || '')
                                }}/>
                                {afterSearch}
                            </div>
                        )}
                        {checkPermissions(permission + '_create') && action}
                    </header>
                )}
                <div className="p-3 relative">
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full">
                            <thead className="text-xs font-semibold uppercase bg-gray-50 text-gray-500">
                            <tr>
                                {indexed && (
                                    <th className="p-2 whitespace-nowrap">
                                        <div className="font-semibold text-left">#</div>
                                    </th>
                                )}
                                {cols?.map((column, index) => (
                                    <th className="p-2 whitespace-nowrap" key={index}>
                                        <div
                                            className={`font-semibold ${column?.className}`}>{!!i18n.t && i18n.t(column.text)}</div>
                                        <div style={{fontSize: 10}}>{column.description}</div>
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td className="h-96 pb-16">
                                        <div className='absolute w-full flex justify-center'>
                                            <div className="loading"/>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {(pagination ? data?.docs : data)?.map((row, index) => (
                                        <tr key={index}>
                                            {indexed &&
                                                <td className="p-2 whitespace-nowrap text-gray-500">{(pagination ? (data?.page - 1) * data.limit : 0) + index + 1}</td>}
                                            {cols?.map((column, index) => (
                                                <td className={`p-2 whitespace-nowrap text-gray-500 ${column?.className || ''}`}
                                                    key={index}>
                                                    {column.formatter ? column.formatter(row[column.dataField], row) : (row[column.dataField] || '-')}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </>
                            )}
                            </tbody>
                        </table>
                    </div>
                    {pagination && (
                        <div className="pt-3 mt-1 border-t">
                            <Pagination page={data?.page} total={data?.totalDocs}
                                        onSizeChange={size => onReload({size})} limit={data?.limit}
                                        totalPages={data?.totalPages} onPageChange={page => onReload({page})}/>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
export default Table

export const TableImage = ({url}) => {
    const [image, setImage] = useState()
    return (
        <div className="w-inline-block h-8">
            <img role="button" src={url} alt="" onClick={() => setImage(url)}
                 style={{maxWidth: '100%', maxHeight: '100%'}}/>
            <Modal width={800} visible={image} onCancel={() => setImage(undefined)} footer={null}
                   bodyStyle={{padding: 0, zIndex: 60}}
                   closeIcon={<FaTimes size={18}
                                       className="bg-dark absolute inline-block right-4 rounded bg-gray-300 bg-opacity-25 text-white top-4"/>}>
                <img className="w-100" style={{minHeight: 400}} src={image} alt={''}/>
            </Modal>
        </div>
    )
}
