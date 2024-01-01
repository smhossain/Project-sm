import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import tagService from './tagService'

const initialState = {
  tags: [],
  tagsById: {},
  tagsAr: [],
  tagsEn: [],
  subTags: [],
  subTagsByMainTagId: {},
  isLoading: false,
  isError: false,
  message: ''
}

export const getAllMainTags = createAsyncThunk(
  'tag/getAllMainTags',
  async (_, thunkAPI) => {
    try {
      return await tagService.getAllMainTags()
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

export const getSubTagsForTag = createAsyncThunk(
  'tag/getSubTagsForTag',
  async (tagId, thunkAPI) => {
    try {
      return await tagService.getSubTagsForTag(tagId)
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

export const getAllTagsWithSubTags = createAsyncThunk(
  'tag/getAllTagsWithSubTags',
  async (lang, thunkAPI) => {
    try {
      return await tagService.getAllTagsWithSubTags(lang)
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

export const updateTag = createAsyncThunk(
  'tag/updateTag',
  async (newTag, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await tagService.updateTag(newTag, token)
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

export const deleteTag = createAsyncThunk(
  'tag/deleteTag',
  async (tagId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await tagService.deleteTag(tagId, token)
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

export const create = createAsyncThunk(
  'tag/create',
  async (newTag, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await tagService.create(newTag, token)
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

export const findById = createAsyncThunk(
  'tag/findById',
  async (tagId, thunkAPI) => {
    try {
      return await tagService.findById(tagId)
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

export const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllMainTags.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllMainTags.fulfilled, (state, action) => {
        state.isLoading = false
        state.tagsAr = action.payload.filter((item) => item.language === 'ar')
        state.tagsEn = action.payload.filter((item) => item.language === 'en')
      })
      .addCase(getAllMainTags.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getSubTagsForTag.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getSubTagsForTag.fulfilled, (state, action) => {
        state.isLoading = false
        const { mainTagId, data } = action.payload
        state.subTagsByMainTagId[mainTagId] = data
      })
      .addCase(getSubTagsForTag.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getAllTagsWithSubTags.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllTagsWithSubTags.fulfilled, (state, action) => {
        state.isLoading = false
        state.tags = action.payload
      })
      .addCase(getAllTagsWithSubTags.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(findById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(findById.fulfilled, (state, action) => {
        state.isLoading = false
        state.tagsById[action.payload.data._id] = action.payload
      })
      .addCase(findById.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateTag.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        const { success, data } = action.payload
        state.isLoading = false
        if (success === true) {
          if (data.parentId === null) {
            // Updating a main tag
            const index = state.tags.data.findIndex(
              (tag) => tag._id === data._id
            )
            if (index !== -1) {
              state.tags.data[index] = data
            }
          } else {
            // Updating a subtag
            // Find the main tag that this subtag belongs to
            const mainTagIndex = state.tags.data.findIndex(
              (tag) => tag._id === data.parentId
            )
            if (mainTagIndex !== -1) {
              // Find the subtag within the main tag
              const subTagIndex = state.tags.data[
                mainTagIndex
              ].subTags.findIndex((subTag) => subTag._id === data._id)
              if (subTagIndex !== -1) {
                // Update the subtag
                state.tags.data[mainTagIndex].subTags[subTagIndex] = data
              }
            }
          }
        }
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(create.pending, (state) => {
        state.isLoading = true
      })
      .addCase(create.fulfilled, (state, action) => {
        state.isLoading = false
        const { success, data } = action.payload

        if (success) {
          if (data.parentId === null) {
            // New main tag
            state.tags.data.push(data)
          } else {
            // New subtag
            // Find the main tag that this subtag belongs to
            const mainTagIndex = state.tags.data.findIndex(
              (tag) => tag._id === data.parentId
            )
            if (mainTagIndex !== -1) {
              // Add the subtag to the main tag's subTags array
              state.tags.data[mainTagIndex].subTags.push(data)
            }
          }
        }
      })
      .addCase(create.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteTag.pending, (state) => {
        state.message = ''
        state.isLoading = true
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.isLoading = false
        const deletedTagId = action.meta.arg

        // Check if the deleted tag is a main tag
        const mainTagIndex = state.tags.data.findIndex(
          (tag) => tag._id === deletedTagId
        )
        if (mainTagIndex !== -1) {
          // Remove the main tag and all its subtags
          state.tags.data.splice(mainTagIndex, 1)
        } else {
          // If it's a subtag, find its main tag and remove the subtag
          state.tags.data.forEach((mainTag) => {
            const subTagIndex = mainTag.subTags.findIndex(
              (subTag) => subTag._id === deletedTagId
            )
            if (subTagIndex !== -1) {
              mainTag.subTags.splice(subTagIndex, 1)
            }
          })
        }
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  }
})

export default tagSlice.reducer
