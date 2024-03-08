
const FeatureCard = ({ image, title, paragraph }) => {
  return (
    <div >
      <img className="mx-auto h-[186px]" src={image} alt="image"  ></img>
      <h3 className="text-2xl font-medium text-twContent-dark mt-[12px]">
        {title}
      </h3>
      <p className="text-sm text-twContent-dark">
        {paragraph}
      </p>
    </div>
  );
};

export default FeatureCard;
