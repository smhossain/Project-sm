import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import tafseerService from './tafseerService'
import surahService from '../surah/surahService'

const initialState = {
  tafseers: [],
  tafseer: {},
  tafseersForIds: [],
  availableNumber: {},
  searchResults: [],
  isError: false,
  isSuccessAdd: false,
  isSuccessGet: false,
  isLoading: false,
  message: ''
}

export const getAllSurahsWithTafseers = createAsyncThunk(
  'tafseer/getAllSurahsWithTafseers',
  async (_, thunkAPI) => {
    try {
      const surahIds = await tafseerService.getAllSurahsWithTafseers()
      return await surahService.getSurahs(surahIds)
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

export const getTafseersWithNoAudioForSurah = createAsyncThunk(
  'tafseer/getTafseersWithNoAudioForSurah',
  async (surahId, thunkAPI) => {
    try {
      return await tafseerService.getTafseersWithNoAudioForSurah(surahId)
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

export const getTafseersByIds = createAsyncThunk(
  'tafseer/getTafseersByIds',
  async (ids, thunkAPI) => {
    try {
      return await tafseerService.getTafseersByIds(ids)
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

export const getAyahTafseer = createAsyncThunk(
  'tafseer/getAyahTafseer',
  async (ayahId, thunkAPI) => {
    try {
      return await tafseerService.getAyahTafseer(ayahId)
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

export const getTafseersForSurah = createAsyncThunk(
  'tafseer/getTafseersOfSurah',
  async (data, thunkAPI) => {
    try {
      return await tafseerService.getTafseersForSurah(data)
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

export const updateTafseer = createAsyncThunk(
  'tafseer/updateTafseer',
  async (editedTafseer, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await tafseerService.updateTafseer(editedTafseer, token)
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

export const deleteTafseer = createAsyncThunk(
  'tafseer/deleteTafseer',
  async (tafseerId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await tafseerService.deleteTafseer(tafseerId, token)
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

export const addTafseer = createAsyncThunk(
  'tafseer/addTafseer',
  async (tafseer, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await tafseerService.addTafseer(tafseer, token)
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

export const deleteTafseersOfSurah = createAsyncThunk(
  'tafseer/deleteTafseersOfSurah',
  async (surahId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await tafseerService.deleteTafseersOfSurah(surahId, token)
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

export const getAvailableNumber = createAsyncThunk(
  'tafseer/getNumer',
  async (surahId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await tafseerService.getAvailableNumber(surahId, token)
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

export const searchTafseers = createAsyncThunk(
  'tafseer/search',
  async (searchData, thunkAPI) => {
    try {
      const { searchTerm, surahId } = searchData
      return await tafseerService.searchTafseers(searchTerm, surahId)
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

export const tafseerSlice = createSlice({
  name: 'tafseer',
  initialState,
  reducers: {
    resetGetTafseer: (state) => {
      state.isSuccessGet = false
      state.tafseer = {}
      state.tafseers = []
    },
    resetSearchResults: (state) => {
      state.searchResults = []
      state.isLoading = false
      state.message = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSurahsWithTafseers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllSurahsWithTafseers.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessGet = true
        state.tafseers = action.payload
      })
      .addCase(getAllSurahsWithTafseers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getTafseersWithNoAudioForSurah.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTafseersWithNoAudioForSurah.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessGet = true
        state.tafseers = action.payload
      })
      .addCase(getTafseersWithNoAudioForSurah.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getTafseersByIds.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTafseersByIds.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessGet = true
        state.tafseersForIds = action.payload
      })
      .addCase(getTafseersByIds.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getAyahTafseer.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAyahTafseer.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessGet = true
        state.tafseer = action.payload
      })
      .addCase(getAyahTafseer.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getTafseersForSurah.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTafseersForSurah.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessGet = true
        state.tafseers = action.payload
      })
      .addCase(getTafseersForSurah.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getAvailableNumber.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAvailableNumber.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessGet = true
        state.availableNumber = action.payload
      })
      .addCase(getAvailableNumber.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.availableNumber = {}
        state.message = action.payload
      })
      .addCase(updateTafseer.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateTafseer.fulfilled, (state, action) => {
        state.isLoading = false
        const { _id } = action.payload
        const index = state.tafseers.results.findIndex(
          (tafseer) => tafseer._id === _id
        )
        if (index !== -1) {
          state.tafseers.results[index] = action.payload
        }
      })
      .addCase(deleteTafseer.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteTafseer.fulfilled, (state, action) => {
        state.isLoading = false
        state.tafseers = state.tafseers.results.filter(
          (item) => item._id !== action.payload._id
        )
      })
      .addCase(addTafseer.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addTafseer.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessGet = true
        state.tafseers.results.push(action.payload)
      })
      .addCase(addTafseer.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(searchTafseers.pending, (state) => {
        state.isLoading = true
        state.isError = false // Reset the error state
        state.message = '' // Clear any previous messages
      })
      .addCase(searchTafseers.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessGet = true
        state.searchResults = action.payload
        state.isError = false // Ensure error is false upon success
      })
      .addCase(searchTafseers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.searchResults = [] // Clear previous results
        state.message = action.error.message || 'Error fetching results' // Set the error message
      })
  }
})

export const { resetGetTafseer, resetSearchResults } = tafseerSlice.actions
export default tafseerSlice.reducer
