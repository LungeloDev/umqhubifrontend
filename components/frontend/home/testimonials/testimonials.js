import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TestimonialCard from "./testimonialCard";
import {fetchUserFeedbackSite} from "../../../../helpers/backend_helper";
import {useFetch} from "../../../../helpers/hooks";
import {useI18n} from "../../../../contexts/i18n";

const Testimonials = () => {
  const i18n = useI18n()
  const [feedback] = useFetch(fetchUserFeedbackSite);

  const settings = {
    // centerMode: true,
    infinite: true,
    autoplay: false,
    slidesToShow: 3,
    slidesToScroll: 3,
    speed: 500,
    dots: true,
    rtl: true,
    arrows: true,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          autoplay: false,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: false,
        },
      },
    ],
  };

  return (
    <div className="my-20">
      <div className="container">
        <div className="text-center">
          <h3 className="font-medium text-4xl text-twContent">
            {!!i18n?.t && i18n?.t("What Our Customers Says")}
          </h3>
          {/* feedback slider */}
          {feedback?.docs?.length > 2 ? (
            <Slider className="mt-10" {...settings}>
              {feedback?.docs?.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  data={testimonial}
                ></TestimonialCard>
              ))}
            </Slider>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 justify-items-center mt-10 gap-5">
              {feedback?.docs?.map((testimonial) => (
                <TestimonialCard
                  key={testimonial?._id}
                  data={testimonial}
                ></TestimonialCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
