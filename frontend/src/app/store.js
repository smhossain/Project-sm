import { configureStore } from '@reduxjs/toolkit'
import queryReducer from '../features/query/querySlice'
import surahReducer from '../features/surah/surahSlice'
import ayahReducer from '../features/ayah/ayahSlice'
import tafseerReducer from '../features/tafseer/tafseerSlice'
import tagReducer from '../features/tag/tagSlice'
import audioReducer from '../features/audio/audioSlice'
import authReducer from '../features/auth/authSlice'

export const store = configureStore({
  reducer: {
    query: queryReducer,
    surah: surahReducer,
    ayah: ayahReducer,
    tafseer: tafseerReducer,
    tag: tagReducer,
    audio: audioReducer,
    auth: authReducer
  }
})
