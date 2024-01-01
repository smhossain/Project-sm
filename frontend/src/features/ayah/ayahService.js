import axios from 'axios'

const API_URL = '/api/surahs/'

// add an ayah to a surah with surahId
const addAyah = async (ayahData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.post(
    API_URL + ayahData.surah + '/ayahs',
    ayahData,
    config
  )
  return response.data
}

// get all ayahs of a surah with surahId
const getAyahs = async (details) => {
  const { surahId, page, limit } = details
  const params = { page: page, limit: limit }
  const response = await axios.get(API_URL + surahId + '/ayahs', { params })
  return response.data
}

const getMultipleAyahs = async (ayahs, surahId) => {
  const response = await axios.get(API_URL + surahId + '/ayahs/multi', {
    params: ayahs
  })
  console.log(response.data)
  return response.data
}

// get all ayahs of a surah that don't have tafseer
const getNoTafseerAyahs = async (surahId) => {
  const response = await axios.get(API_URL + surahId + '/ayahs/no/tafseer')
  return response.data
}
// delete an ayah of a surah
const deleteAyah = async (surahId, ayahId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.delete(
    API_URL + surahId + '/ayahs/' + ayahId,
    config
  )
  return response.data
}

// update an ayah
const updateAyah = async (surahId, ayahId, ayahData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.put(
    API_URL + surahId + '/ayahs/' + ayahId,
    ayahData,
    config
  )
  return response.data
}

const updateAyahsMulti = async (ayahData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.put(
    API_URL + ayahData[0].surah + '/ayahs/multi',
    ayahData,
    config
  )
  return response.data
}

// delete Ayahs of a surah
const deleteAyahsOfSurah = async (surahId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.delete(API_URL + surahId + '/ayahs', config)
  return response.data
}

const ayahService = {
  addAyah,
  getAyahs,
  getMultipleAyahs,
  getNoTafseerAyahs,
  deleteAyah,
  updateAyah,
  updateAyahsMulti,
  deleteAyahsOfSurah
}

export default ayahService
