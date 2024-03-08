import ReactPaginate from "react-paginate";
import {useI18n} from "../../contexts/i18n";

const Pagination = ({page, total, limit, totalPages, onPageChange, onSizeChange}) => {
    const i18n = useI18n()
    return (
        <div className="flex flex-wrap justify-between mb-2">
            <div className="flex items-center">
                {onSizeChange && (
                    <div className="flex items-center mr-3 text-sm text-gray-500 h-[24px]">
                        Show
                        <select value={limit} onChange={(e) => {
                            onSizeChange(+e.target.value)
                        }} className="h-[24px] px-1 rounded mx-2 text-center focus:outline-0">
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                )}
                <p className="!mb-3 md:!mb-0 text-sm text-gray-500">
                    Showing {((page - 1) * limit) + 1 || 0}
                    &nbsp;to {Math.min(total || 0, (page * limit) || 0)} of {total || 0} entries
                </p>
            </div>

            <ReactPaginate
                breakLabel="..."
                previousLabel={!!i18n.t ? i18n?.t("Previous") : "Previous"}
                disabledLinkClassName="text-gray-300"
                previousLinkClassName="text-sm bg-gray-100  hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded-l"
                nextLinkClassName="text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded-r"
                pageLinkClassName="text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4"
                pageClassName="!mb-3 md:!mb-0"
                activeLinkClassName="text-primary"
                nextLabel={!!i18n.t ? i18n?.t("Next") : "Next"}
                className="flex flex-wrap"
                onPageChange={({selected}) => onPageChange(selected + 1)}
                pageRangeDisplayed={3}
                pageCount={totalPages || 1}
                renderOnZeroPageCount={null}
            />
        </div>
    )
}
export default Pagination