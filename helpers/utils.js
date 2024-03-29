export const formatCard = (card, spacer = ' ') => {
    return card?.split('').map((d, index) => `${!!index && index % 4 === 0 ? spacer : ''}${d}`).join("") || '-'
}

export const languages = [
    {
        "label": "Abkhaz",
        "value": "ab"
    },
    {
        "label": "Afar",
        "value": "aa"
    },
    {
        "label": "Afrikaans",
        "value": "af"
    },
    {
        "label": "Akan",
        "value": "ak"
    },
    {
        "label": "Albanian",
        "value": "sq"
    },
    {
        "label": "Amharic",
        "value": "am"
    },
    {
        "label": "Arabic",
        "value": "ar"
    },
    {
        "label": "Aragonese",
        "value": "an"
    },
    {
        "label": "Armenian",
        "value": "hy"
    },
    {
        "label": "Assamese",
        "value": "as"
    },
    {
        "label": "Avaric",
        "value": "av"
    },
    {
        "label": "Avestan",
        "value": "ae"
    },
    {
        "label": "Aymara",
        "value": "ay"
    },
    {
        "label": "Azerbaijani",
        "value": "az"
    },
    {
        "label": "Bambara",
        "value": "bm"
    },
    {
        "label": "Bashkir",
        "value": "ba"
    },
    {
        "label": "Basque",
        "value": "eu"
    },
    {
        "label": "Belarusian",
        "value": "be"
    },
    {
        "label": "Bengali",
        "value": "bn"
    },
    {
        "label": "Bihari",
        "value": "bh"
    },
    {
        "label": "Bislama",
        "value": "bi"
    },
    {
        "label": "Bosnian",
        "value": "bs"
    },
    {
        "label": "Breton",
        "value": "br"
    },
    {
        "label": "Bulgarian",
        "value": "bg"
    },
    {
        "label": "Burmese",
        "value": "my"
    },
    {
        "label": "Catalan; Valencian",
        "value": "ca"
    },
    {
        "label": "Chamorro",
        "value": "ch"
    },
    {
        "label": "Chechen",
        "value": "ce"
    },
    {
        "label": "Chichewa; Chewa; Nyanja",
        "value": "ny"
    },
    {
        "label": "Chinese",
        "value": "zh"
    },
    {
        "label": "Chuvash",
        "value": "cv"
    },
    {
        "label": "Cornish",
        "value": "kw"
    },
    {
        "label": "Corsican",
        "value": "co"
    },
    {
        "label": "Cree",
        "value": "cr"
    },
    {
        "label": "Croatian",
        "value": "hr"
    },
    {
        "label": "Czech",
        "value": "cs"
    },
    {
        "label": "Danish",
        "value": "da"
    },
    {
        "label": "Divehi; Dhivehi; Maldivian;",
        "value": "dv"
    },
    {
        "label": "Dutch",
        "value": "nl"
    },
    {
        "label": "English",
        "value": "en"
    },
    {
        "label": "Esperanto",
        "value": "eo"
    },
    {
        "label": "Estonian",
        "value": "et"
    },
    {
        "label": "Ewe",
        "value": "ee"
    },
    {
        "label": "Faroese",
        "value": "fo"
    },
    {
        "label": "Fijian",
        "value": "fj"
    },
    {
        "label": "Finnish",
        "value": "fi"
    },
    {
        "label": "French",
        "value": "fr"
    },
    {
        "label": "Fula; Fulah; Pulaar; Pular",
        "value": "ff"
    },
    {
        "label": "Galician",
        "value": "gl"
    },
    {
        "label": "Georgian",
        "value": "ka"
    },
    {
        "label": "German",
        "value": "de"
    },
    {
        "label": "Greek, Modern",
        "value": "el"
    },
    {
        "label": "Guaraní",
        "value": "gn"
    },
    {
        "label": "Gujarati",
        "value": "gu"
    },
    {
        "label": "Haitian; Haitian Creole",
        "value": "ht"
    },
    {
        "label": "Hausa",
        "value": "ha"
    },
    {
        "label": "Hebrew (modern)",
        "value": "he"
    },
    {
        "label": "Herero",
        "value": "hz"
    },
    {
        "label": "Hindi",
        "value": "hi"
    },
    {
        "label": "Hiri Motu",
        "value": "ho"
    },
    {
        "label": "Hungarian",
        "value": "hu"
    },
    {
        "label": "Interlingua",
        "value": "ia"
    },
    {
        "label": "Indonesian",
        "value": "id"
    },
    {
        "label": "Interlingue",
        "value": "ie"
    },
    {
        "label": "Irish",
        "value": "ga"
    },
    {
        "label": "Igbo",
        "value": "ig"
    },
    {
        "label": "Inupiaq",
        "value": "ik"
    },
    {
        "label": "Ido",
        "value": "io"
    },
    {
        "label": "Icelandic",
        "value": "is"
    },
    {
        "label": "Italian",
        "value": "it"
    },
    {
        "label": "Inuktitut",
        "value": "iu"
    },
    {
        "label": "Japanese",
        "value": "ja"
    },
    {
        "label": "Javanese",
        "value": "jv"
    },
    {
        "label": "Kalaallisut, Greenlandic",
        "value": "kl"
    },
    {
        "label": "Kannada",
        "value": "kn"
    },
    {
        "label": "Kanuri",
        "value": "kr"
    },
    {
        "label": "Kashmiri",
        "value": "ks"
    },
    {
        "label": "Kazakh",
        "value": "kk"
    },
    {
        "label": "Khmer",
        "value": "km"
    },
    {
        "label": "Kikuyu, Gikuyu",
        "value": "ki"
    },
    {
        "label": "Kinyarwanda",
        "value": "rw"
    },
    {
        "label": "Kirghiz, Kyrgyz",
        "value": "ky"
    },
    {
        "label": "Komi",
        "value": "kv"
    },
    {
        "label": "Kongo",
        "value": "kg"
    },
    {
        "label": "Korean",
        "value": "ko"
    },
    {
        "label": "Kurdish",
        "value": "ku"
    },
    {
        "label": "Kwanyama, Kuanyama",
        "value": "kj"
    },
    {
        "label": "Latin",
        "value": "la"
    },
    {
        "label": "Luxembourgish, Letzeburgesch",
        "value": "lb"
    },
    {
        "label": "Luganda",
        "value": "lg"
    },
    {
        "label": "Limburgish, Limburgan, Limburger",
        "value": "li"
    },
    {
        "label": "Lingala",
        "value": "ln"
    },
    {
        "label": "Lao",
        "value": "lo"
    },
    {
        "label": "Lithuanian",
        "value": "lt"
    },
    {
        "label": "Luba-Katanga",
        "value": "lu"
    },
    {
        "label": "Latvian",
        "value": "lv"
    },
    {
        "label": "Manx",
        "value": "gv"
    },
    {
        "label": "Macedonian",
        "value": "mk"
    },
    {
        "label": "Malagasy",
        "value": "mg"
    },
    {
        "label": "Malay",
        "value": "ms"
    },
    {
        "label": "Malayalam",
        "value": "ml"
    },
    {
        "label": "Maltese",
        "value": "mt"
    },
    {
        "label": "Māori",
        "value": "mi"
    },
    {
        "label": "Marathi (Marāṭhī)",
        "value": "mr"
    },
    {
        "label": "Marshallese",
        "value": "mh"
    },
    {
        "label": "Mongolian",
        "value": "mn"
    },
    {
        "label": "Nauru",
        "value": "na"
    },
    {
        "label": "Navajo, Navaho",
        "value": "nv"
    },
    {
        "label": "Norwegian Bokmål",
        "value": "nb"
    },
    {
        "label": "North Ndebele",
        "value": "nd"
    },
    {
        "label": "Nepali",
        "value": "ne"
    },
    {
        "label": "Ndonga",
        "value": "ng"
    },
    {
        "label": "Norwegian Nynorsk",
        "value": "nn"
    },
    {
        "label": "Norwegian",
        "value": "no"
    },
    {
        "label": "Nuosu",
        "value": "ii"
    },
    {
        "label": "South Ndebele",
        "value": "nr"
    },
    {
        "label": "Occitan",
        "value": "oc"
    },
    {
        "label": "Ojibwe, Ojibwa",
        "value": "oj"
    },
    {
        "label": "Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",
        "value": "cu"
    },
    {
        "label": "Oromo",
        "value": "om"
    },
    {
        "label": "Oriya",
        "value": "or"
    },
    {
        "label": "Ossetian, Ossetic",
        "value": "os"
    },
    {
        "label": "Panjabi, Punjabi",
        "value": "pa"
    },
    {
        "label": "Pāli",
        "value": "pi"
    },
    {
        "label": "Persian",
        "value": "fa"
    },
    {
        "label": "Polish",
        "value": "pl"
    },
    {
        "label": "Pashto, Pushto",
        "value": "ps"
    },
    {
        "label": "Portuguese",
        "value": "pt"
    },
    {
        "label": "Quechua",
        "value": "qu"
    },
    {
        "label": "Romansh",
        "value": "rm"
    },
    {
        "label": "Kirundi",
        "value": "rn"
    },
    {
        "label": "Romanian, Moldavian, Moldovan",
        "value": "ro"
    },
    {
        "label": "Russian",
        "value": "ru"
    },
    {
        "label": "Sanskrit (Saṁskṛta)",
        "value": "sa"
    },
    {
        "label": "Sardinian",
        "value": "sc"
    },
    {
        "label": "Sindhi",
        "value": "sd"
    },
    {
        "label": "Northern Sami",
        "value": "se"
    },
    {
        "label": "Samoan",
        "value": "sm"
    },
    {
        "label": "Sango",
        "value": "sg"
    },
    {
        "label": "Serbian",
        "value": "sr"
    },
    {
        "label": "Scottish Gaelic; Gaelic",
        "value": "gd"
    },
    {
        "label": "Shona",
        "value": "sn"
    },
    {
        "label": "Sinhala, Sinhalese",
        "value": "si"
    },
    {
        "label": "Slovak",
        "value": "sk"
    },
    {
        "label": "Slovene",
        "value": "sl"
    },
    {
        "label": "Somali",
        "value": "so"
    },
    {
        "label": "Southern Sotho",
        "value": "st"
    },
    {
        "label": "Spanish; Castilian",
        "value": "es"
    },
    {
        "label": "Sundanese",
        "value": "su"
    },
    {
        "label": "Swahili",
        "value": "sw"
    },
    {
        "label": "Swati",
        "value": "ss"
    },
    {
        "label": "Swedish",
        "value": "sv"
    },
    {
        "label": "Tamil",
        "value": "ta"
    },
    {
        "label": "Telugu",
        "value": "te"
    },
    {
        "label": "Tajik",
        "value": "tg"
    },
    {
        "label": "Thai",
        "value": "th"
    },
    {
        "label": "Tigrinya",
        "value": "ti"
    },
    {
        "label": "Tibetan Standard, Tibetan, Central",
        "value": "bo"
    },
    {
        "label": "Turkmen",
        "value": "tk"
    },
    {
        "label": "Tagalog",
        "value": "tl"
    },
    {
        "label": "Tswana",
        "value": "tn"
    },
    {
        "label": "Tonga (Tonga Islands)",
        "value": "to"
    },
    {
        "label": "Turkish",
        "value": "tr"
    },
    {
        "label": "Tsonga",
        "value": "ts"
    },
    {
        "label": "Tatar",
        "value": "tt"
    },
    {
        "label": "Twi",
        "value": "tw"
    },
    {
        "label": "Tahitian",
        "value": "ty"
    },
    {
        "label": "Uighur, Uyghur",
        "value": "ug"
    },
    {
        "label": "Ukrainian",
        "value": "uk"
    },
    {
        "label": "Urdu",
        "value": "ur"
    },
    {
        "label": "Uzbek",
        "value": "uz"
    },
    {
        "label": "Venda",
        "value": "ve"
    },
    {
        "label": "Vietnamese",
        "value": "vi"
    },
    {
        "label": "Volapük",
        "value": "vo"
    },
    {
        "label": "Walloon",
        "value": "wa"
    },
    {
        "label": "Welsh",
        "value": "cy"
    },
    {
        "label": "Wolof",
        "value": "wo"
    },
    {
        "label": "Western Frisian",
        "value": "fy"
    },
    {
        "label": "Xhosa",
        "value": "xh"
    },
    {
        "label": "Yiddish",
        "value": "yi"
    },
    {
        "label": "Yoruba",
        "value": "yo"
    },
    {
        "label": "Zhuang, Chuang",
        "value": "za"
    }
]