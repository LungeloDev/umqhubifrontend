import {useI18n} from "../../contexts/i18n";

const Button = ({children, className, disabled, ...props}) => {
    const i18n = useI18n()
    return (
        <button {...props}
            disabled={disabled}
            className={`bg-main px-4 py-2.5 text-sm text-black rounded font-medium text-wra disabled:bg-main2 disabled:bg-opacity-40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${className}`}
            style={{whiteSpace: 'nowrap'}}>{!!i18n.t && typeof children === 'string' ? i18n.t(children) : children}</button>
    )
}
export default Button