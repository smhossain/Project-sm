import axios from 'axios'

const API_URL = '/api/queries/'

// Get latest queries
const getLatestQueries = async (lang) => {
  const response = await axios.get(API_URL + `latest?lang=${lang}`)
  return response.data
}

const getAllQueries = async (queryData) => {
  const { page, limit, isPublishable, lang, filters, searchTerm } = queryData
  let queryParameter = `?page=${page}&limit=${limit}`

  // Add lang parameter only if it's defined
  if (lang) {
    queryParameter += `&lang=${lang}`
  }

  if (isPublishable) {
    queryParameter += `&pub=true`
  }

  // Add search term parameter only if it's defined
  if (searchTerm) {
    queryParameter += `&search=${encodeURIComponent(searchTerm)}`
  }

  // Include filters if they exist, as a single JSON stringified object
  if (filters) {
    const filterParams = {}
    if (filters.mainTag) {
      filterParams.mainTag = filters.mainTag
    }
    if (filters.tags && filters.tags.length > 0) {
      filterParams.tags = filters.tags.map((tag) => tag._id)
    }
    queryParameter += `&filters=${encodeURIComponent(
      JSON.stringify(filterParams)
    )}`
  }

  const response = await axios.get(API_URL + `all${queryParameter}`)
  return response.data
}

const addQuery = async (queryData) => {
  const response = await axios.post(API_URL, queryData)
  return response.data
}

const getUnAnsweredQueries = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.get(API_URL + 'unanswered', config)
  return response.data
}

const answerQuery = async (queryAnswer, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.put(
    API_URL + queryAnswer._id,
    queryAnswer,
    config
  )
  return response.data
}

const deleteQuery = async (queryId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.delete(API_URL + queryId, config)
  return response.data
}

const queryService = {
  getLatestQueries,
  getAllQueries,
  addQuery,
  getUnAnsweredQueries,
  answerQuery,
  deleteQuery
}

export default queryService
