import {createContext, useContext, useEffect, useState} from "react"
import axios from "axios";

const I18nContext = createContext({})
export const useI18n = () => useContext(I18nContext)
export default I18nContext


export const initI18n = () => {
    const [languages, setLanguages] = useState()
    const [translations] = useState({})
    const [lang, setLang] = useState('en')
    const [direction, setDirection] = useState('ltr')


    useEffect(() => {
        (async () => {
            let {data} = await axios.get(process.env.backend_url + 'api/settings/language/translations')
            setLanguages(data?.data?.map(d => {
                translations[d.code] = d.translation
                return {
                    name: d.name, key: d.code, direction: d.rtl ? 'rtl' : 'ltr', default: d.default
                }
            }))
        })()
    }, [])


    useEffect(() => {
        if (languages) {
            let lang = localStorage.getItem('lang')
            if (lang) {
                changeLang(lang)
            } else {
                let defaultLang = languages?.find(d => d.default)
                if (defaultLang) {
                    changeLang(defaultLang.key)
                }
            }
        }
    }, [languages])

    useEffect(() => {
        document.documentElement.dir = direction
    }, [direction])

    const t = (key) => {
        if (!!key && languages?.length > 0) {
            let langKeys = localStorage.getItem('lang_keys')
            let data = !!langKeys ? JSON.parse(langKeys) : {}
            data[key.toLowerCase()] = ''
            localStorage.setItem('lang_keys', JSON.stringify(data))
        }
        return !!key && !!translations[lang] ? translations[lang][key.toLowerCase()] || key : key
    }

    const changeLang = key => {
        const lang = languages?.find(l => l.key === key)
        if (lang) {
            setLang(key)
            setDirection(lang.direction)
            localStorage.setItem('lang', key)
        }
    }

    return {
        languages, t, lang, direction, changeLang
    }
}