import i18next from 'i18next'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getTafseersByIds } from '../features/tafseer/tafseerSlice'
import Modal from 'react-modal'
import Select from 'react-select'

function AddAudioModal({
  isOpen,
  onRequestClose,
  surah,
  nextPartNumber,
  onSave,
  tafseers = [],
  editingAudio
}) {
  const [audioUrl, setAudioUrl] = useState('')
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')
  const [partNumber, setPartNumber] = useState(+nextPartNumber)
  const [selectedTafseers, setSelectedTafseers] = useState([])
  const [validationErrors, setValidationErrors] = useState({})
  const [tafseerOptions, setTafseerOptions] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation('tafseer')
  const dispatch = useDispatch()

  const { tafseersForIds } = useSelector((state) => state.tafseer)

  const truncateText = (text, maxLength = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  useEffect(() => {
    // Populate tafseer options whenever tafseers prop changes
    const newTafseerOptions = tafseers.map((tafseer) => ({
      value: tafseer._id,
      label: `Part ${tafseer.number}: ${truncateText(tafseer.text)}`
    }))
    setTafseerOptions(newTafseerOptions)
    if (isOpen) {
      setTimeout(() => {
        const inputElement = document.getElementById('audioUrlInput')
        if (inputElement) {
          inputElement.focus()
        }
      }, 0)
      setIsLoading(true)

      if (editingAudio && Array.isArray(editingAudio.tafseers)) {
        // Populate form fields with existing audio metadata for editing
        setAudioUrl(editingAudio.url)
        setMinutes(Math.floor(editingAudio.duration / 60))
        setSeconds(editingAudio.duration % 60)
        setPartNumber(editingAudio.partNumber)

        const ids = editingAudio.tafseers || []

        if (
          ids.length > 0 &&
          !tafseersForIds.some((tafseer) => ids.includes(tafseer._id))
        ) {
          // Only dispatch if the IDs have not been fetched yet
          dispatch(getTafseersByIds(ids))
        } else {
          // Set preselected values when tafseersForIds is updated and contains the necessary data
          const preselected = tafseersForIds
            .map((tafseer) => {
              return {
                value: tafseer._id,
                label: `Part ${tafseer.number}: ${truncateText(tafseer.text)}`
              }
            })
            .filter(Boolean) // This will remove any null or undefined values
          setSelectedTafseers(preselected)
          setIsLoading(false)
        }
      } else {
        resetFormFields()
      }
    }
  }, [
    isOpen,
    editingAudio,
    nextPartNumber,
    tafseers,
    dispatch,
    tafseersForIds,
    isLoading
  ])

  const resetFormFields = () => {
    setAudioUrl('')
    setMinutes('')
    setSeconds('')
    setPartNumber(+nextPartNumber)
    setSelectedTafseers([])
    setValidationErrors({})
  }

  const handleTafseerChange = (selectedOptions) => {
    setSelectedTafseers(selectedOptions || [])
  }

  // Validation logic
  const validateInputs = () => {
    let errors = {}

    // Convert minutes and seconds to numbers for validation
    const minutesValue = minutes === '' ? 0 : parseInt(minutes, 10)
    const secondsValue = seconds === '' ? 0 : parseInt(seconds, 10)

    // uncomment later

    // const urlPattern = new RegExp(
    //   '^(https?:\\/\\/)?' + // protocol
    //     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    //     '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    //     '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    //     '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    //     '(\\#[-a-z\\d_]*)?$',
    //   'i'
    // ) // fragment locator

    // if (!urlPattern.test(audioUrl)) {
    //   errors.audioUrl = `${t('url_error')}`
    // }

    // Validate minutes
    if (isNaN(minutesValue) || minutesValue < 0) {
      errors.minutes = `${t('minutes_error')}`
    }

    // Validate seconds
    if (isNaN(secondsValue) || secondsValue < 0 || secondsValue > 59) {
      errors.seconds = `${t('seconds_error')}`
    }

    // Check if duration is at least 1 minute
    const totalDurationInSeconds = minutes * 60 + seconds
    if (totalDurationInSeconds < 60) {
      errors.duration = `${t('duration_error')}`
    }

    // Validate if at least one Tafseer is selected
    if (selectedTafseers.length === 0) {
      errors.tafseers = `${t('tafseers_error')}`
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Input onChange handlers
  const handleMinutesChange = (e) => {
    setMinutes(e.target.value)
  }

  const handleSecondsChange = (e) => {
    setSeconds(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateInputs()) {
      return // Stop submission if validation fails
    }
    const totalDuration = minutes * 60 + seconds // Convert to total seconds
    const tafseerIds = selectedTafseers.map((t) => t.value)

    const audioToSave = {
      surah: surah._id,
      partNumber: nextPartNumber,
      url: audioUrl,
      duration: totalDuration,
      tafseers: tafseerIds
    }
    onSave(audioToSave)
  }

  const customStyles = {
    content: {
      direction: i18next.resolvedLanguage === 'ar' ? 'rtl' : 'ltr',
      width: '50vw',
      height: '70vh'
    }
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <form onSubmit={handleSubmit} className='p-3'>
        <div className='mb-3'>
          <label className='form-label'>{t('surah_name')}</label>
          <input
            type='text'
            className='form-control'
            value={surah.name}
            disabled
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>{t('url')}</label>
          <input
            type='text'
            id='audioUrlInput'
            className={`form-control ${
              validationErrors.audioUrl ? 'is-invalid' : ''
            }`}
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            aria-label='Audio URL'
          />
          {validationErrors.audioUrl && (
            <div className='invalid-feedback'>{validationErrors.audioUrl}</div>
          )}
        </div>
        <div className='mb-3'>
          <label className='form-label'>{t('duration')}</label>
          <div className='d-flex align-items-center'>
            <div className='me-2'>
              <label htmlFor='minutes' className='form-label me-1'>
                {t('minutes')}
              </label>
              <input
                type='number'
                id='minutes'
                className={`form-control ${
                  validationErrors.minutes ? 'is-invalid' : ''
                }`}
                placeholder={t('minutes')}
                value={minutes}
                onChange={handleMinutesChange}
                min='0'
              />
              {validationErrors.minutes && (
                <div className='invalid-feedback'>
                  {validationErrors.minutes}
                </div>
              )}
            </div>
            <div>
              <label htmlFor='seconds' className='form-label me-1'>
                {t('seconds')}
              </label>
              <input
                type='number'
                id='seconds'
                className={`form-control ${
                  validationErrors.seconds ? 'is-invalid' : ''
                }`}
                placeholder={t('seconds')}
                value={seconds}
                onChange={handleSecondsChange}
                max='59'
                min='0'
              />
              {validationErrors.seconds && (
                <div className='invalid-feedback'>
                  {validationErrors.seconds}
                </div>
              )}
            </div>
            {validationErrors.duration && (
              <div className='invalid-feedback'>
                {validationErrors.duration}
              </div>
            )}
          </div>
        </div>
        <div className='mb-3'>
          <label className='form-label'>{t('sequence')}</label>
          <input
            type='number'
            id='partNumber'
            className='form-control'
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>{t('select_tafseers')}</label>

          <Select
            options={tafseerOptions}
            defaultValue={isLoading ? t('loading') : selectedTafseers}
            isMulti
            onChange={handleTafseerChange}
            className={validationErrors.tafseers ? 'is-invalid' : ''}
            isSearchable
            placeholder={t('select')}
          />

          {validationErrors.tafseers && (
            <div className='invalid-feedback'>{validationErrors.tafseers}</div>
          )}
        </div>
        <div className='d-flex justify-content-end'>
          <button type='submit' className='btn btn-primary me-2'>
            {t('save')}
          </button>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={onRequestClose}
          >
            {t('cancel')}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddAudioModal
