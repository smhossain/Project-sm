import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { register, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(true)
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

  const handleNameChange = (e) => {
    setName(e.target.value)
    setFormSubmitted(false)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setFormSubmitted(false)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setFormSubmitted(false)
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
    setFormSubmitted(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setPasswordsMatch(false)
      return
    }

    setFormSubmitted(true)

    const userData = { name, email, password }
    dispatch(register(userData))
  }

  return (
    <div className='container mt-3'>
      <h2>{t('please_create_account')}</h2>
      {isError && ( // Display error alert if error exists
        <div className='alert alert-danger' role='alert'>
          {message}
        </div>
      )}
      {isLoading && <Spinner />} {/* Display spinner if loading */}
      <form onSubmit={handleSubmit} className='mt-4'>
        <div className='mb-3'>
          <label htmlFor='name' className='form-label'>
            {t('name')}:
          </label>
          <input
            type='text'
            className='form-control'
            id='name'
            value={name}
            onChange={handleNameChange}
          />
        </div>
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
        <div className='mb-3'>
          <label htmlFor='confirmPassword' className='form-label'>
            {t('password2')}:
          </label>
          <input
            type='password'
            className={`form-control ${
              (!confirmPassword || !passwordsMatch) && formSubmitted
                ? 'is-invalid'
                : ''
            }`}
            id='confirmPassword'
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onBlur={() => setFormSubmitted(true)}
          />
          {!confirmPassword && formSubmitted && (
            <div className='invalid-feedback'>{t('password_required')}</div>
          )}
        </div>
        <button type='submit' className='btn btn-primary'>
          {t('register')}
        </button>
      </form>
    </div>
  )
}

export default Register
