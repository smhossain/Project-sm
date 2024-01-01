import { useState, useEffect } from 'react'
import { addQuery, resetAddQuery } from '../features/query/querySlice'
import { getAllMainTags } from '../features/tag/tagSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

function SubmitNewQuery() {
  const { t } = useTranslation('latest-queries')
  const { isLoading, isError, isSuccessAdd, message } = useSelector(
    (state) => state.query
  )

  const {
    tagsEn,
    tagsAr,
    isLoading: isLoadingTags,
    isError: isErrorTags,
    message: messageTags
  } = useSelector((state) => state.tag)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [question, setQuestion] = useState('')
  const [mainTag, setMainTag] = useState({})
  const [validationErrors, setValidationErrors] = useState({})

  const validateForm = () => {
    let errors = {}

    if (!name.trim()) errors.name = t('name_required')

    if (email.trim() && !/\S+@\S+\.\S+/.test(email)) {
      errors.email = t('valid_email_required')
    }

    if (!question.trim()) {
      errors.question = t('question_required')
    } else if (question.trim().length < 10) {
      errors.question = t('question_minimum_length')
    }

    // Check if mainTag is defined and has a name property
    if (!mainTag || !mainTag.name || !mainTag.name.trim()) {
      errors.mainTag = t('tags_required')
    }

    setValidationErrors(errors)

    return Object.keys(errors).length === 0
  }

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getAllMainTags()) // fetch all the tags

    if (isSuccessAdd) {
      dispatch(resetAddQuery())
    }
  }, [dispatch, isSuccessAdd])

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isErrorTags) {
      toast.error(messageTags)
    }
  }, [isError, message, isErrorTags, messageTags])

  const onSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      const query = {
        name,
        email,
        question,
        mainTag: mainTag._id,
        isPublishable: false,
        answer: null,
        language: i18next.resolvedLanguage
      }
      dispatch(addQuery(query))
        .unwrap()
        .then(() => {
          toast.success('Your query has been successfully submitted.')
          dispatch(resetAddQuery())
          navigate('/queries/all')
        })
        .catch((error) => {
          toast.error(error.message ? error.message : 'An error occurred')
        })

      // Reset form fields
      setName('')
      setEmail('')
      setQuestion('')
      setMainTag({})
    }
  }

  return (
    <>
      {(isLoading || isLoadingTags) && (
        <div className='d-flex justify-content-center align-items-center mt-2'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>
              <Spinner />
            </span>
          </div>
        </div>
      )}
      <div className='container'>
        <h2 className='my-4'>{t('submit_query')}</h2>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label name='email' htmlFor='email'>
              {t('email')}
            </label>
            <input
              type='email'
              className='form-control'
              value={email}
              placeholder='name@example.com'
              onChange={(e) => {
                setEmail(e.target.value)
                setValidationErrors((prevErrors) => {
                  return { ...prevErrors, email: null }
                })
              }}
              id='email'
              autoComplete='on'
            />
            {validationErrors.email && (
              <div className='alert-danger mt-1'>{validationErrors.email}</div>
            )}
          </div>
          <div className='form-group'>
            <label name='text' htmlFor='text'>
              {t('name')}
            </label>
            <input
              type='text'
              className='form-control'
              value={name}
              placeholder={t('your_name')}
              onChange={(e) => {
                setName(e.target.value)
                setValidationErrors((prevErrors) => {
                  return { ...prevErrors, name: null }
                })
              }}
              id='text'
            />
            {validationErrors.name && (
              <div className='alert-danger mt-1'>{validationErrors.name}</div>
            )}
          </div>
          <div className='form-group'>
            <label name='query' htmlFor='query'>
              {t('query')}
            </label>
            <textarea
              className='form-control'
              name='query'
              id='query'
              rows='3'
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value)
                setValidationErrors((prevErrors) => ({
                  ...prevErrors,
                  question: null
                }))
              }}
            ></textarea>
            {validationErrors.question && (
              <div className='alert-danger'>{validationErrors.question}</div>
            )}
          </div>
          <div className='dropdown form-group'>
            <label name='tag' htmlFor='tag'>
              {t('category')}
            </label>
            <button
              className='btn dropdown-toggle btn-gold-on-white ml-2 ms-2'
              type='button'
              data-bs-toggle='dropdown'
              aria-expanded='false'
              name='tag'
              id='tag'
            >
              {mainTag.name === '' || mainTag.name === undefined
                ? i18next.resolvedLanguage === 'en'
                  ? 'Choose Category'
                  : 'اختر الفئة'
                : mainTag.name}
            </button>
            <ul className='dropdown-menu'>
              {i18next.resolvedLanguage === 'en' &&
                tagsEn.map((tag) => (
                  <li key={tag._id} onClick={() => setMainTag(tag._id)}>
                    <button
                      type='button'
                      className='dropdown-item'
                      style={{ cursor: 'pointer' }}
                    >
                      {tag.name}
                    </button>
                  </li>
                ))}
              {i18next.resolvedLanguage === 'ar' &&
                tagsAr.map((tag) => (
                  <li
                    key={tag._id}
                    onClick={() =>
                      setMainTag((prevState) => {
                        return { ...prevState, _id: tag._id, name: tag.name }
                      })
                    }
                  >
                    <button
                      type='button'
                      className='dropdown-item'
                      style={{ cursor: 'pointer' }}
                    >
                      {tag.name}
                    </button>
                  </li>
                ))}
            </ul>
            {validationErrors.mainTag && (
              <div className='alert-danger mt-1'>
                {validationErrors.mainTag}
              </div>
            )}
          </div>
          <div className='form-group'>
            <button type='submit' className='btn mb-2 mt-4 btn-green-on-white'>
              {t('submit')}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default SubmitNewQuery
