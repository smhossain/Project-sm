import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

// Get user from local storage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user: user ? user : null,
  users: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
}

export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      return await authService.register(user)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const getUserById = createAsyncThunk(
  'auth/getUserById',
  async (userId, thunkAPI) => {
    const existingUser = thunkAPI.getState().auth.users[userId]
    if (existingUser) {
      return existingUser // User data already fetched, no need to fetch again
    }
    try {
      const token = thunkAPI.getState().auth.user.token
      return await authService.getUserById(userId, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout()
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset(state) {
      state.isError = false
      state.isSuccess = false
      state.isLoading = false
      state.message = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = payload
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.isLoading = false
        state.isError = true
        state.message = payload
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = payload
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.isLoading = false
        state.isError = true
        state.message = payload
      })
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUserById.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.isSuccess = true
        state.users[payload._id] = payload
      })
      .addCase(getUserById.rejected, (state, { payload }) => {
        state.isLoading = false
        state.isError = true
        state.message = payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
  }
})

export const { reset } = authSlice.actions

export default authSlice.reducer
