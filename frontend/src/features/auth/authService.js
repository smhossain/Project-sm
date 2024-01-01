import axios from 'axios'

const API_URL = '/api/users/'

// register a new user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Login a user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Get user by id
const getUserById = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.get(API_URL + userId, config)
  return response.data
}

// Logout a user
const logout = () => {
  localStorage.removeItem('user')
}

const authService = {
  register,
  getUserById,
  logout,
  login
}

export default authService
