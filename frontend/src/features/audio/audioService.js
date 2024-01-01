import axios from 'axios'

const API_URL = '/api/audios/'

const updateAudioMetaData = async (audioData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const { _id } = audioData
  const response = await axios.put(API_URL + _id, audioData, config)
  return response.data
}

const createAudioMetaData = async (audioData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.post(API_URL, audioData, config)
  return response.data
}

const deleteAudioMetaData = async (audioId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.delete(API_URL + audioId, config)
  return response.data
}

const getAudioMetaDataBySurahId = async (surahId) => {
  const response = await axios.get(API_URL + `surah/${surahId}`)
  return response.data
}

const getNextPartNumber = async (surahId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.get(API_URL + `next/${surahId}`, config)
  return response.data
}

const audioService = {
  getAudioMetaDataBySurahId,
  getNextPartNumber,
  createAudioMetaData,
  updateAudioMetaData,
  deleteAudioMetaData
}

export default audioService
