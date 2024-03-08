import {FiSearch} from "react-icons/fi";
import { initI18n } from "../../contexts/i18n";

const SearchInput = ({className, value, onChange, placeholder, onFocus, disabled=false}) => {
    const i18n = initI18n()
    return (
        <div className="relative mr-2">
            <input
                className={`form-input !p-2 !ps-8 ${className}`}
                style={{borderRadius: 4}}
                onFocus={onFocus}
                disabled={disabled}
                value={value} onChange={onChange} placeholder={i18n.t(placeholder || 'Search')}/>
            <FiSearch className="absolute top-3 start-2.5 text-gray-500"/>
        </div>

    )
}
export default SearchInput