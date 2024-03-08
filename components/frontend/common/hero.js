import {useRouter} from "next/router";
import {useFetch} from "../../../helpers/hooks";
import {fetchSettings} from "../../../helpers/backend_helper";
import {useI18n} from "../../../contexts/i18n";

const Hero = ({heading, paragraph, image}) => {
  const i18n = useI18n()
  const [setting] = useFetch(fetchSettings);
  const router = useRouter();

  return (
    <div className="container">
      <div className="flex items-center md:max-h-[581px] md:min-h-[518px]">
        <div className="mt-[20px] lg:mt-10 gap-x-[20px] md:flex items-center flex flex-col-reverse md:flex-row md:gap-y-0 gap-y-[12px]">
          <div className="lg:w-1/2">
            <h2 className="font-semibold text-3xl lg:text-5xl text-twContent">
              {heading}
            </h2>
            <p className="mt-[8px] md:max-w-lg font-medium text-lg text-twContent-muted text-justify">
              {paragraph}
            </p>

            {/* CTA buttons  */}
            <div className="w-full mt-[70px] mb-[16px] lg:mb-0 flex flex-col md:flex-row gap-7">
              <button
                onClick={() => router.push("/home/earnWithShare")}
                className="px-[20px] lg:px-10 py-[20px] bg-twSecondary-shade800 text-white text-lg lg:text-xl font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                {!!i18n?.t ? i18n?.t("Earn With Share") : "Earn With Share"}
              </button>
              <a href={setting?.app_link?.android} target="_blank" className="px-[20px] lg:px-10 py-[20px] text-twSecondary-shade800 hover:text-twSecondary-shade700 border !border-twSecondary-shade800 hover:!border-twSecondary-shade700 text-lg lg:text-xl font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg text-center">
                {!!i18n?.t ? i18n?.t("Download App") : "Download App"}
              </a>
            </div>
          </div>
          <div className="lg:max-w-[554px] max-w-[450px]">
            <img className="mx-auto h-full w-full" src={image} alt="hero image"></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
