import React, {useState} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 776,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                initialSlide: 2
            }
        },
        {
            breakpoint: 550,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};


const SlickServiceCategories = ({categories = [], setSearchInput, serviceCategory, setServiceCategory}) => {

    return (
        <div className={'mt-4'}>
            <Slider {...settings} className={'gap-5'}>
                {
                    categories?.map((service, ind) => <p
                        key={ind} onClick={() => {
                            setServiceCategory(service)
                            setSearchInput(pre => pre = false)
                        }}
                        className={`${serviceCategory?._id === service?._id ? "bg-twSecondary-shade800" : "bg-twSecondary"} border-white px-4 py-2 hover:bg-twSecondary-shade800 rounded-md cursor-pointer`}
                    >
                            {service?.name}
                        </p>)
                }
            </Slider>
        </div>
    );
};

export default SlickServiceCategories;