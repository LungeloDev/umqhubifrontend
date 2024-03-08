import React, {useEffect} from 'react';
import ArticleCard from '../../common/articleCard';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {useFetch} from '../../../../helpers/hooks';
import {fetchBlogs, getLandingPageData} from '../../../../helpers/backend_helper';
import {useUserDataContext} from '../../../../contexts/userDataContext';

const Articles = () => {
  const {language} = useUserDataContext();
  const [data, getData] = useFetch(getLandingPageData, {}, false);
  const [blogs, getBlogs] = useFetch(fetchBlogs, {}, false);

  useEffect(() => {
    if (language) {
      getData({lang: language, pages: "blog"});
      getBlogs({type: "blog", lang: language});
    }

  }, [language]);

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
          arrows: false
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: false,
          arrows: false
        },
      },
    ],
  };

  const renderCards = blogs?.docs.map(article => <ArticleCard key={article?._id} {...article}></ArticleCard>)

  return (
    <div className="container">
      <div className="mt-20">
        <h3 className="text-center  font-medium text-4xl text-twContent">
          {data?.content?.header?.value?.title}
        </h3>
        <p className="text-center mt-[8px]  font-medium text-base text-twContent-muted">
          {data?.content?.header?.value?.subtitle}
        </p>
        {blogs?.docs.length > 2 ? (
          <div className="my-20">
            <Slider {...settings}>{renderCards}</Slider>
          </div>
        ) : (
          <div className="flex justify-center mt-10 gap-5">
            {blogs?.docs.map((article) => (
              <ArticleCard key={article?._id} {...article}></ArticleCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;