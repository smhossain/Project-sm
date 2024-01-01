import axios from 'axios'

const API_URL = '/api/surahs/'

const addSurah = async (surahData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.post(API_URL, surahData, config)
  return response.data
}

const getAllSurahs = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

const getSurah = async (surahId) => {
  const response = await axios.get(API_URL + surahId)
  return response.data
}

const getSurahs = async (surahIds) => {
  const response = await axios.post(API_URL + 'tsurahs', surahIds)
  return response.data
}

const deleteSurah = async (surahId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.delete(API_URL + surahId, config)
  return response.data
}

const updateSurah = async (editedSurah, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.put(
    API_URL + editedSurah._id,
    editedSurah,
    config
  )
  return response.data
}

const surahService = {
  addSurah,
  getAllSurahs,
  deleteSurah,
  updateSurah,
  getSurah,
  getSurahs
}

export default surahService
