import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false)

  const { t } = useTranslation('general')

  const dispatch = useDispatch()
  const nav = useNavigate()

  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        nav('/admin')
      } else {
        nav('/')
      }
    }
    return () => {
      dispatch(reset())
    }
  }, [user, isLoading, dispatch, nav])

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setFormSubmitted(false)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setFormSubmitted(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setFormSubmitted(true)

    const userData = { email, password }
    dispatch(login(userData))
  }

  return (
    <div className='container mt-3'>
      <h2>{t('login')}</h2>
      {isError && ( // Display error alert if error exists
        <div className='alert alert-danger' role='alert'>
          {message}
        </div>
      )}
      {isLoading && <Spinner />} {/* Display spinner if loading */}
      <form onSubmit={handleSubmit} className='mt-4'>
        <div className='mb-3'>
          <label htmlFor='email' className='form-label'>
            {t('email')}:
          </label>
          <input
            type='email'
            className={`form-control ${
              !email && formSubmitted ? 'is-invalid' : ''
            }`}
            id='email'
            value={email}
            onChange={handleEmailChange}
            onBlur={() => setFormSubmitted(true)}
          />
          {!email && formSubmitted && (
            <div className='invalid-feedback'>{t('email_required')}</div>
          )}
        </div>
        <div className='mb-3'>
          <label htmlFor='password' className='form-label'>
            {t('password')}:
          </label>
          <input
            type='password'
            className={`form-control ${
              !password && formSubmitted ? 'is-invalid' : ''
            }`}
            id='password'
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => setFormSubmitted(true)}
          />
          {!password && formSubmitted && (
            <div className='invalid-feedback'>{t('password_required')}</div>
          )}
        </div>
        <button type='submit' className='btn btn-primary'>
          {t('login')}
        </button>
      </form>
    </div>
  )
}

export default Login
