import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import queryService from './queryService'

const initialState = {
  queries: [],
  query: {},
  isError: false,
  isSuccessQueries: false,
  isSuccessAdd: false,
  isLoading: false,
  message: ''
}

export const addQuery = createAsyncThunk(
  'query/create',
  async (queryData, thunkAPI) => {
    try {
      return await queryService.addQuery(queryData)
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

export const getLatestQueries = createAsyncThunk(
  'query/getLatest',
  async (lang, thunkAPI) => {
    try {
      return await queryService.getLatestQueries(lang)
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

export const getUnansweredQueries = createAsyncThunk(
  'query/getUnanswered',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await queryService.getUnAnsweredQueries(token)
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

export const getAllQueries = createAsyncThunk(
  'query/getAllQueries',
  async (queryData, thunkAPI) => {
    try {
      return await queryService.getAllQueries(queryData)
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

export const answerQuery = createAsyncThunk(
  'query/answerQuery',
  async (queryAnswer, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await queryService.answerQuery(queryAnswer, token)
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

export const deleteQuery = createAsyncThunk(
  'query/delete',
  async (queryId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await queryService.deleteQuery(queryId, token)
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

export const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    resetGetQueries: (state) => {
      state.isSuccessQueries = false
    },
    resetAddQuery: (state) => {
      state.isSuccessAdd = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLatestQueries.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getLatestQueries.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessQueries = true
        state.queries = action.payload
      })
      .addCase(getLatestQueries.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.queries = []
        state.message = action.payload
      })
      .addCase(addQuery.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addQuery.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessAdd = true
        state.query = action.payload
      })
      .addCase(addQuery.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.query = []
        state.message = action.payload
      })
      .addCase(getUnansweredQueries.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUnansweredQueries.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessQueries = true
        state.queries = action.payload
      })
      .addCase(getUnansweredQueries.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.queries = []
        state.message = action.payload
      })
      .addCase(answerQuery.fulfilled, (state, action) => {
        state.isLoading = false
        const { _id } = action.payload
        const index = state.queries.results.findIndex(
          (query) => query._id === _id
        )
        if (index !== -1) {
          state.queries.results[index] = action.payload
        }
      })
      .addCase(deleteQuery.fulfilled, (state, action) => {
        state.isLoading = false
        state.queries = state.queries.results.filter(
          (item) => item._id !== action.payload._id
        )
      })
      .addCase(getAllQueries.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllQueries.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccessQueries = true
        state.queries = action.payload
      })
      .addCase(getAllQueries.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.queries = []
        state.message = action.payload
      })
  }
})

export const { resetGetQueries, resetAddQuery } = querySlice.actions
export default querySlice.reducer
