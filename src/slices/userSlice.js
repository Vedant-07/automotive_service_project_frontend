import { createSlice } from '@reduxjs/toolkit'

// structure of userState = {
//     userName: "",
//     userEmail: "",
//     userPhoneNumber: "",
//     userAddress: "",
//     role: "",
//     yearsOfExperience: "",
//     serviceDepartment: "",
// }

const initialState = null; 

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => action.payload,
    removeUser: () => null,
    // update just some fields
    updateUser: (state, action) => ({ ...state, ...action.payload })
  },
})

export const { addUser, removeUser, updateUser } = userSlice.actions;

export default userSlice.reducer;   
