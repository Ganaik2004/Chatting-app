import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    currentUser:null,
    error:null,
    loading:false,
    setSelectedChat:null,
    allchats:[],
    notification:[],
}
const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading = true;
        },
        signInSuccess:(state,action)=>{
            state.loading = false;
            state.currentUser = action.payload;           
    },
    signInFailure:(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
    signOutStart:(state)=>{
        state.loading = true;
    },
    deleteUserSuccess:(state,action)=>{
        state.currentUser = null;
        state.loading = false;
        state.error = null;
        state.allchats=[];
        state.setSelectedChat = null;
        state.notification=[]
    },
    deleteUserFailure:(state,action)=>{
        state.error = action.payload;
        state.loading = false;
    },
    setChat:(state,action)=>{
        state.setSelectedChat = action.payload;
    },
    allChats:(state,action)=>{
        state.allchats = action.payload;
    },
    setnotification:(state,action)=>{
        state.notification = action.payload;
    }
    }
})

export const {signInStart,signInSuccess,signInFailure,setnotification,allChats,signOutStart,setChat,deleteUserSuccess,deleteUserFailure} = userSlice.actions;
export default userSlice.reducer;