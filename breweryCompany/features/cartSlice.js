import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect';


const initialState={
    items: [],
}
export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    addToBasket: (state, action) => {
     state.items = [...state.items,action.payload]
    },
    removeFromBasket: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id)

      let newBasket = [...state.items]

      if(index>=0){
        newBasket.splice(index,1);
      }else{
        console.warn('product (id : ${action.payload.id}) not in basket!')
      }
      state.items=newBasket;
    },
      clearCart: state => {
      state.items = []; 
  },
  },
})

// Action creators are generated for each case reducer function
export const { addToBasket, removeFromBasket, clearCart} = basketSlice.actions


export const selectBasketItems = (state)=> state.basket.items

// export const selectBasketItemsWithId = (state,id) => state.basket.items.filter((item)=>item.id ===id)
export const selectBasketItemsWithId = createSelector(
  [selectBasketItems, (_, id) => id], // Selector input functions
  (items, id) => items.filter((item) => item.id === id) // Selector output function
);

export const selectBasketTotal = (state) =>state.basket.items.reduce((total, item)=> total+= item.price,0)


export default basketSlice.reducer