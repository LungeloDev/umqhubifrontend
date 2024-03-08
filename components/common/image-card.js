import React from 'react';

const ImageCard = ({ image }) => {

    return (
        <div className='h-48 bg-white'>
            <img src={`${image}`} alt="product-image" className='object-cover object-center h-48 w-full rounded-[4px]'

            // raw css
            // style={{
            //     objectFit: 'cover',
            //     objectPosition: '50% 50%',
            //     height: '31vh',
            //     borderRadius: '5px',
            //     width: '100%',

            // }}
            />
        </div>
    );
};

export default ImageCard;


export const ProductCard = ({ product }) => {
    return (
        <section className='mt-5 gap-2'>
            <Row>
                {
                    products?.docs?.map((product, i) =>
                        <Col md={6} lg={4} xl={3} key={i}>
                            <div className='border shadow-sm h-80 w-64 bg-gray-100 rounded-md p-2 overflow-y-auto card-overflow_css mb-4'>
                                <ImageCard image={product?.images[0]} />

                                <p className='mt-3 text-gray-800 font-medium text-[16px]'>{product?.name}</p>

                                <div className='flex justify-between items-center mt-4'>
                                    <span className='inline-block text-gray-800'>${product?.price}</span>

                                    <button className={`btn btn-primary btn-sm font-size-13 flex gap-2 items-center`}>
                                        <FaCartPlus />
                                        Add to cart
                                    </button>
                                </div>
                            </div>
                        </Col>
                    )
                }
            </Row>
        </section>
    )
}

/**
 
// css for scrollbar
.card-overflow_css {
    &::-webkit-scrollbar {
        width: 2px;
    }
    &::-webkit-scrollbar-thumb {
        background: #aaa;
    } 
} 

*/
