import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import audioService from './audioService'

const initialState = {
  audios: [],
  audio: {},
  nextNumber: 1,
  isLoading: false,
  isError: false,
  message: ''
}

export const selectAudioById = (state, audioId) =>
  state.audios.find((audio) => audio._id === audioId)

export const createAudioMetaData = createAsyncThunk(
  'audio/createAudioMetaData',
  async (audioData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await audioService.createAudioMetaData(audioData, token)
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

export const deleteAudioMetaData = createAsyncThunk(
  'audio/deleteAudioMetaData',
  async (audioData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await audioService.deleteAudioMetaData(audioData, token)
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

export const updateAudioMetaData = createAsyncThunk(
  'audio/updateAudioMetaData',
  async (audioData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await audioService.updateAudioMetaData(audioData, token)
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

export const getAudioMetaDataBySurahId = createAsyncThunk(
  'audio/getAudioMetaDataBySurahId',
  async (surahId, thunkAPI) => {
    try {
      return await audioService.getAudioMetaDataBySurahId(surahId)
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

export const getNextPartNumber = createAsyncThunk(
  'audio/getNextPartNumber',
  async (surahId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await audioService.getNextPartNumber(surahId, token)
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

export const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAudioMetaData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createAudioMetaData.fulfilled, (state, action) => {
        state.isLoading = false
        state.audios = [...state.audios, action.payload]
      })
      .addCase(createAudioMetaData.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getAudioMetaDataBySurahId.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAudioMetaDataBySurahId.fulfilled, (state, action) => {
        state.isLoading = false
        state.audios = action.payload
      })
      .addCase(getAudioMetaDataBySurahId.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getNextPartNumber.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getNextPartNumber.fulfilled, (state, action) => {
        state.isLoading = false
        state.nextNumber = action.payload
      })
      .addCase(getNextPartNumber.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export default audioSlice.reducer
