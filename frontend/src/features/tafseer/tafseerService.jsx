import axios from 'axios'

const API_URL = '/api/tafseers/'

const getAllSurahsWithTafseers = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

const getTafseersWithNoAudioForSurah = async (surahId) => {
  const response = await axios.get(API_URL + `${surahId}/noaudio`)
  return response.data
}

const getTafseersByIds = async (ids) => {
  const response = await axios.post(API_URL + 'byIds', { ids })
  return response.data
}

const getAyahTafseer = async (ayahId) => {
  const response = await axios.get(API_URL + 'surah/' + ayahId)
  return response.data
}

const getTafseersForSurah = async (data) => {
  const { surahId, page, limit } = data
  const response = await axios.get(
    API_URL + `${surahId}?page=${page}&limit=${limit}`
  )
  return response.data
}

const getAvailableNumber = async (surahId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.get(API_URL + 'lastnumber/' + surahId, config)
  return response.data
}

const updateTafseer = async (editedTafseer, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.put(
    API_URL + editedTafseer._id,
    editedTafseer,
    config
  )
  return response.data
}

const deleteTafseer = async (tafseerId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.delete(API_URL + tafseerId, config)
  return response.data
}

const addTafseer = async (tafseer, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.post(API_URL, tafseer, config)
  return response.data
}

const deleteTafseersOfSurah = async (surahId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.delete(API_URL + 'remove/' + surahId, config)
  return response.data
}

const searchTafseers = async (searchTerm, surahId) => {
  let query = `search?query=${encodeURIComponent(searchTerm)}`
  if (surahId) {
    query += `&surahId=${encodeURIComponent(surahId)}`
  }
  const response = await axios.get(API_URL + query)
  return response.data
}

const tafseerService = {
  getAllSurahsWithTafseers,
  getTafseersWithNoAudioForSurah,
  getTafseersByIds,
  getAyahTafseer,
  getTafseersForSurah,
  getAvailableNumber,
  updateTafseer,
  deleteTafseer,
  deleteTafseersOfSurah,
  addTafseer,
  searchTafseers
}

export default tafseerService
