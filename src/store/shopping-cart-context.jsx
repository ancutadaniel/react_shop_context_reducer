import { useContext, useState, useReducer } from "react";
import { createContext } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

// 1 - Create a context object - help auto-complete
export const CartContext = createContext({
  items: [],
  totalAmount: 0,
  addItemToCart: () => {},
  updateItemQty: () => {},
});

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const updatedItems = [...state.items];
      const id = action.payload;

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === id
      );

      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === id);
        updatedItems.push({
          id: id,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return {
        ...state,
        items: updatedItems,
      };
    }

    case "UPDATE_ITEM": {
      const updatedItems = [...state.items];
      const { productId, amount } = action.payload;

      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === productId
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
        ...state,
        items: updatedItems,
      };
    }

    default:
      return state;
  }
};

export const CartContextProvider = ({ children }) => {
  const [shoppingCartState, dispatch] = useReducer(reducer, {
    items: [],
    totalAmount: 0,
  });

  function handleAddItemToCart(id) {
    dispatch({
      type: "ADD_ITEM",
      payload: id,
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    dispatch({
      type: "UPDATE_ITEM",
      payload: {
        productId,
        amount,
      },
    });
  }

  const ctxValue = {
    items: shoppingCartState.items,
    totalAmount: shoppingCartState.totalAmount,
    addItemToCart: handleAddItemToCart,
    updateItemQty: handleUpdateCartItemQuantity,
  };

  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
