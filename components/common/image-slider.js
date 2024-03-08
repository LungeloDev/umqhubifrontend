import {useEffect, useState} from "react";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import {useI18n} from "../../contexts/i18n";

const ImageSlider = ({images, className = 'w-[300px] mx-auto', height = 300, offer}) => {
    const [current, setCurrent] = useState()
    const i18n = useI18n()
    useEffect(() => {
        if(images?.length > 0) {
            setCurrent(images[0])
        }
    }, [images])

    return (
        <>
            <div className={className}>
                <div className="relative">
                    <Zoom>
                        <img style={{width: '100%', height}}
                             src={current || '/img/product.png'} alt=""/>
                    </Zoom>
                    <div className="absolute right-2 top-2">
                        {offer && <img className="w-24" src={`/icons/offer_${i18n.lang || 'en'}.png`} alt=""/>}
                    </div>
                </div>

                <div className="flex -mx-2 mt-4">
                    {images?.map((img, index) => (
                        <div className="px-2">
                            <img src={img} role="button" onClick={() => setCurrent(img)} alt="" key={index} className="w-8 h-8 border"/>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
export default ImageSlider