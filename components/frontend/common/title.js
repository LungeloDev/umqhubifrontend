const Title = ({ heading, paragraph }) => {
    return (
        <div className="bg-yellow-50 text-center py-16 font-Poppins">
            <div className="container">
                <h1 className="font-medium text-[40px] text-twContent-header">{heading}</h1>
                <p className="font-medium text-lg text-twContent-light mt-[20px]">{paragraph}</p>
            </div>
        </div>
    );
}

export default Title;