import axios from 'axios'

const API_URL = '/api/tags/'

const getAllMainTags = async () => {
  const response = await axios.get(API_URL + '/main')
  return response.data
}

const getSubTagsForTag = async (tagId) => {
  const response = await axios.get(API_URL + `${tagId}/subtags`)
  return response.data
}

const getAllTagsWithSubTags = async (lang) => {
  const response = await axios.get(API_URL + `all-with-subtags?lang=${lang}`)
  return response.data
}

const findById = async (tagId) => {
  const response = await axios.get(API_URL + tagId)
  return response.data
}

const updateTag = async (newTag, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const { _id } = newTag
  const response = await axios.put(API_URL + _id, newTag, config)
  return response.data
}

const create = async (newTag, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.post(API_URL, newTag, config)
  return response.data
}

const deleteTag = async (tagId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.delete(API_URL + tagId, config)
  return response.data
}

const tagService = {
  getAllMainTags,
  getSubTagsForTag,
  getAllTagsWithSubTags,
  findById,
  updateTag,
  create,
  deleteTag
}

export default tagService
