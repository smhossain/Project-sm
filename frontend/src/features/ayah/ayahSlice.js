import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import ayahService from './ayahService'
const _ = require('lodash')

const initialState = {
  ayahs: [],
  noTafseerAyahs: [],
  tafseerAyahs: [],
  ayah: {},
  isError: false,
  isSuccessGet: false,
  isSuccessAdd: false,
  isLoading: false,
  message: ''
}

export const addAyah = createAsyncThunk(
  'ayah/create',
  async (ayahData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await ayahService.addAyah(ayahData, token)
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

export const getAyahs = createAsyncThunk(
  'ayah/getAll',
  async (details, thunkAPI) => {
    try {
      return await ayahService.getAyahs(details)
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

export const getMultipleAyahs = createAsyncThunk(
  'ayah/getMultipleAyahs',
  async (ayahs, thunkAPI) => {
    try {
      const { ayahsOfTafseer, surahId } = ayahs
      return await ayahService.getMultipleAyahs(ayahsOfTafseer, surahId)
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

export const getNoTafseerAyahs = createAsyncThunk(
  'ayah/getNoTafseerAyahs',
  async (surahId, thunkAPI) => {
    try {
      return await ayahService.getNoTafseerAyahs(surahId)
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

export const deleteAyah = createAsyncThunk(
  'ayah/deleteAyah',
  async (ayahData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const { surahId, ayahId } = ayahData
      return await ayahService.deleteAyah(surahId, ayahId, token)
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

export const updateAyah = createAsyncThunk(
  'ayah/updateAyah',
  async (ayahData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const { surah, _id } = ayahData
      return await ayahService.updateAyah(surah, _id, ayahData, token)
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

export const updateAyahsMulti = createAsyncThunk(
  'ayah/updateAyahsMulti',
  async (ayahData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await ayahService.updateAyahsMulti(ayahData, token)
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

export const deleteAyahsOfSurah = createAsyncThunk(
  'ayah/deleteAyahsOfSurah',
  async (surahId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await ayahService.deleteAyahsOfSurah(surahId, token)
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

export const ayahSlice = createSlice({
  name: 'ayah',
  initialState,
  reducers: {
    resetGetAyah: (state) => {
      state.isSuccessGet = false
      state.ayahs = []
      state.ayah = {}
      state.message = ''
    },
    resetAdd: (state) => {
      state.isSuccessAdd = false
      state.message = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAyahs.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAyahs.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessGet = true
        state.ayahs = action.payload
      })
      .addCase(getAyahs.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.ayahs = []
        state.message = action.payload
      })
      .addCase(getNoTafseerAyahs.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getNoTafseerAyahs.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessGet = true
        state.noTafseerAyahs = action.payload
      })
      .addCase(getNoTafseerAyahs.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.noTafseerAyahs = []
        state.message = action.payload
      })
      .addCase(addAyah.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addAyah.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessAdd = true
        if (_.isEmpty(state.ayahs) || state.ayahs === null) {
          state.ayahs = []
          state.ayahs.results = []
          state.ayahs.results.push(action.payload)
        } else {
          state.ayahs.results.push(action.payload)
        }
      })
      .addCase(addAyah.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteAyah.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteAyah.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessAdd = true
        state.ayahs.results = state.ayahs.results.filter(
          (item) => item._id !== action.payload._id
        )
      })
      .addCase(updateAyah.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateAyah.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessAdd = true
        // state.ayahs.results.map((item) =>
        //   item._id !== action.payload._id ? (item = action.payload) : item
        // )
        const { _id } = action.payload
        // const ayahs = state.ayahs.results.filter((ayah) => ayah._id !== _id)
        // state.ayahs = [...ayahs, action.payload]
        const index = state.ayahs.results.findIndex((ayah) => ayah._id === _id)
        if (index !== -1) {
          state.ayahs.results[index] = action.payload
        }
      })
      .addCase(updateAyahsMulti.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateAyahsMulti.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessAdd = true
      })
  }
})

export const { resetAdd, resetGetAyah } = ayahSlice.actions
export default ayahSlice.reducer
