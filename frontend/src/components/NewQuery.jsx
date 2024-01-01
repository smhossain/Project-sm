import { useState, useEffect } from 'react'
import { addQuery, resetAddQuery } from '../features/query/querySlice'
import { getAllMainTags } from '../features/tag/tagSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

function NewQuery() {
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
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      errors.email = t('valid_email_required')

    if (!question.trim()) {
      errors.question = t('question_required')
    } else if (question.trim().length < 10) {
      errors.question = t('question_minimum_length')
    }

    if (!mainTag.name.trim()) errors.mainTag = t('tags_required')

    setValidationErrors(errors)

    return Object.keys(errors).length === 0 // Returns true if no errors
  }

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getAllMainTags()) // fetch all the tags

    if (isError) {
      toast.error(message)
    }

    if (isErrorTags) {
      toast.error(messageTags)
    }

    if (isSuccessAdd) {
      dispatch(resetAddQuery())
    }
  }, [
    dispatch,
    isError,
    isSuccessAdd,
    navigate,
    message,
    isErrorTags,
    messageTags
  ])

  // check if input is arabic
  function isArabicInput(input) {
    const arabicRegex = /^[\u0600-\u06FF\s]+$/ // Regular expression for Arabic characters
    return arabicRegex.test(input)
  }

  const sanitizeInputForArabic = (input) => {
    if (i18next.resolvedLanguage === 'ar' && !isArabicInput(input)) {
      return input.replace(/[^\u0600-\u06FF\s]/g, '') // Remove non-Arabic characters
    }
    return input
  }

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
      setName('')
      setEmail('')
      setQuestion('')
      setMainTag('')
    }
  }

  if (isLoading || isLoadingTags) {
    return <Spinner />
  }
  return (
    <>
      <h2>{t('submit_query')}</h2>
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
            <div className='alert-danger'>{validationErrors.email}</div>
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
            <div className='alert-danger'>{validationErrors.name}</div>
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
            // prevent non-Arabic characters from being typed
            onKeyDown={(e) => {
              if (i18next.resolvedLanguage === 'ar') {
                const key = e.key
                const isArabic = /^[\u0600-\u06FF\s]$/.test(key)
                const allowedKeys = [
                  'Backspace',
                  'ArrowUp',
                  'ArrowDown',
                  'ArrowLeft',
                  'ArrowRight',
                  'Shift',
                  'Control',
                  'Alt',
                  'Meta',
                  'Enter',
                  'Tab',
                  'Escape',
                  ...Array.from({ length: 12 }, (_, i) => `F${i + 1}`) // F1 to F12
                ]
                if (!isArabic && !allowedKeys.includes(key)) {
                  e.preventDefault()
                }
              }
            }}
            onPaste={(e) => {
              if (i18next.resolvedLanguage === 'ar') {
                // Delay handling so the value is pasted before we check it
                setTimeout(() => {
                  setQuestion((prevValue) => sanitizeInputForArabic(prevValue))
                }, 0)
              }
            }}
            onChange={(e) => {
              const inputValue = sanitizeInputForArabic(e.target.value)

              setValidationErrors((prevErrors) => {
                return { ...prevErrors, question: null }
              })

              // Update the state with the sanitized input value
              setQuestion(inputValue)
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
            <div className='alert-danger'>{validationErrors.mainTag}</div>
          )}
        </div>
        <div className='form-group'>
          <button type='submit' className='btn mb-2 btn-green-on-white'>
            {t('submit')}
          </button>
        </div>
      </form>
    </>
  )
}

export default NewQuery
