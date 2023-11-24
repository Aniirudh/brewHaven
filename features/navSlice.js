import { createSlice } from '@reduxjs/toolkit'

const initialState={
    origin: null,
    destination: null,
    travelTimeInformation: null,
    originalLocation:null,
    authToken:null
};

export const navSlice = createSlice({
    name: "nav",
    initialState,
    reducers: {
        setOrigin: (state, action) =>{
            state.origin = action.payload;
        },
        setDestiation: (state,action) =>{
            state.destination = action.payload;
        },
        setTravelTimeInformation: (state,action) =>{
            state.travelTimeInformation= action.payload;
        },
        setOriginalLocation: (state,action) =>{
            state.originalLocation = action.payload;
        },
        setAuthToken: (state,action) =>{
            state.authToken = action.payload
        }
    }
});

export const {setOrigin, setDestiation, setTravelTimeInformation, setOriginalLocation, setAuthToken} = navSlice.actions;

//selectors

export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectTravelTimeInformation = (state) => state.nav.travelTimeInformation;
export const selectOriginalLocation = (state) => state.nav.originalLocation;
export const selectAuthToken = (state) => state.nav.authToken;

export default navSlice.reducer;