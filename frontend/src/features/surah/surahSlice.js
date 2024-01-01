import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import surahService from './surahService'

const initialState = {
  surahs: [],
  surah: '',
  isError: false,
  isSuccessAdd: false,
  isSuccessGet: false,
  isLoading: false,
  message: ''
}

export const addSurah = createAsyncThunk(
  'surah/add',
  async (surahData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await surahService.addSurah(surahData, token)
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

export const getAllSurahs = createAsyncThunk(
  'surah/getAll',
  async (_, thunkAPI) => {
    try {
      return await surahService.getAllSurahs()
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

export const getSurah = createAsyncThunk(
  'surah/getSurah',
  async (surahId, thunkAPI) => {
    try {
      return await surahService.getSurah(surahId)
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

export const deleteSurah = createAsyncThunk(
  'surah/delete',
  async (surahId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await surahService.deleteSurah(surahId, token)
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

export const updateSurah = createAsyncThunk(
  'surah/update',
  async (editedSurah, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await surahService.updateSurah(editedSurah, token)
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

export const surahSlice = createSlice({
  name: 'surah',
  initialState,
  reducers: {
    resetAdd: (state) => {
      state.isSuccessAdd = false
    },
    resetGet: (state) => {
      state.isSuccessGet = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addSurah.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addSurah.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessAdd = true
        state.surah = action.payload
      })
      .addCase(addSurah.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.surah = ''
        state.message = action.payload
      })
      .addCase(getAllSurahs.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllSurahs.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessGet = true
        state.surahs = action.payload
      })
      .addCase(getAllSurahs.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.surahs = []
        state.message = action.payload
      })
      .addCase(deleteSurah.fulfilled, (state, action) => {
        state.isLoading = false
        state.surahs = state.surahs.filter(
          (item) => item._id !== action.payload._id
        )
      })
      .addCase(updateSurah.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateSurah.fulfilled, (state, action) => {
        state.isLoading = false

        const { _id } = action.payload
        const index = state.surahs.findIndex((surah) => surah._id === _id)
        if (index !== -1) {
          state.surahs[index] = action.payload
        }
      })
      .addCase(getSurah.fulfilled, (state, action) => {
        state.isLoading = false
        state.surah = action.payload
      })
      .addCase(getSurah.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.surah = []
        state.message = action.payload
      })
      .addCase(getSurah.pending, (state) => {
        state.isLoading = true
      })
  }
})

export const { resetAdd, resetGet } = surahSlice.actions
export default surahSlice.reducer
