import Slider from "react-slick";

const Brands = ({logos}) => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: logos?.length <= 6 ? logos?.length - 1 : 6,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 4000,
    cssEase: "linear",
    pauseOnHover: false,
    arrows: false,
  };

  return (
    <div>
      <div className="container ">
        <div className="py-4">
          <Slider {...settings}>
            {logos?.map((logo, i) => (
              <div key={i} className="">
                <img
                  className="p-1 opacity-20 w-[100px] h-full transition ease-in-out delay-150 hover:scale-110 duration-300"
                  src={logo}
                  alt=""
                ></img>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Brands;
