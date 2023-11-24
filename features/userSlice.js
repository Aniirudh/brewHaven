import { createSlice } from '@reduxjs/toolkit'

const initialState={
    authToken:null,
    userId:null,
    trackOrderVisibility: false
};


export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {        
        setAuthToken: (state,action) =>{
            state.authToken = action.payload
        },
        setUserId: (state,action) =>{
            state.userId = action.payload
        },
        setTrackOrderVisibility: (state,action) =>{
            state.trackOrderVisibility = action.payload
        }
    }
});

export const {setAuthToken, setUserId, setTrackOrderVisibility} = userSlice.actions;

//selectors

export const selectAuthToken = (state) => state.user.authToken;
export const selectUserId = (state) => state.user.userId;
export const selectTrackOrderVisibility = (state) => state.user.trackOrderVisibility

export default userSlice.reducer;