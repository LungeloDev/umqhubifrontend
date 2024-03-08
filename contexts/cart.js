import { useContext, createContext, useState, useEffect } from 'react';

const CartContext = createContext({});

export function CartContextProvider(props) {
    const [cartItems, setCartItems] = useState(false);

    return (
        <CartContext.Provider value={{ cartItems, setCartItems }}>
            {props.children}
        </CartContext.Provider>
    )
}

export const useCarts = () => {
    return useContext(CartContext);
}