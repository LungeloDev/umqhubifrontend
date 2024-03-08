import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
};

const VehicleDetailsSlider = ({vehicleDetails}) => {

    return (
        <div className={'w-[80vw] md:w-[80%]'}>
            <Slider {...settings}>
                {
                    vehicleDetails?.images?.map((data, i) =>
                        <div key={i} className={'h-44 md:h-64 w-full'}>
                            <img src={data} alt="vehicle" className={'h-44 md:h-64 object-cover mx-auto inline-block rounded-lg'} />
                        </div>
                    )
                }
            </Slider>
        </div>
    );
};

export default VehicleDetailsSlider;