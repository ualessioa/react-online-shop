import { createContext, useReducer } from 'react'
import { DUMMY_PRODUCTS } from '../dummy-products';


export const CartContext = createContext({
    items: [],
    addItemToCart: () => {},
    updateItemQuantity: () => {},
})

function reducer(state, action){
    if (action.type === 'ADD_ITEM') {
        
    const updatedItems = [...state.items];

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === action.payload
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
        updatedItems.push({
          id: action.payload,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return {
        ...state,
        items: updatedItems,
      };
    } else if ((action.type === 'UPDATE_ITEM_QUANTITY')){
      const updatedItems = [...state.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === action.payload.productId
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += action.payload.amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
        items: updatedItems,
      };
    }

    return {...state,
        state}
}

export default function CartContextProvider({children}) {
    const [state, dispatch] = useReducer(reducer, {
    items: [],
  })



  function handleAddItemToCart(id) {
    dispatch({
        type: 'ADD_ITEM',
        payload: id
    })

  }

  function handleUpdateCartItemQuantity(productId, amount) {
    dispatch({
        type: 'UPDATE_ITEM_QUANTITY',
        payload: {productId, amount}
    })
  }

  const ctxValue = {
    items: state.items,
    addItemToCart: handleAddItemToCart,
    onUpdateCartItemQuantity: handleUpdateCartItemQuantity,
  }

  return (
    <CartContext.Provider value={ctxValue}>
        {children}
    </CartContext.Provider>
  )
}