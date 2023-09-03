import { ADD_TO_CART, REMOVE_FROM_CART } from './cartActionTypes';

const initialState = {
  items: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case REMOVE_FROM_CART: {
      const newBasket = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: newBasket,
      };
    }
    default: {
      return state;
    }
  }
};

export default cartReducer;
