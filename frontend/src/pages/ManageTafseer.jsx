import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { resetGetAyah, getNoTafseerAyahs } from '../features/ayah/ayahSlice'
import { getSurah } from '../features/surah/surahSlice'
import {
  getTafseersForSurah,
  getAvailableNumber,
  addTafseer,
  resetGetTafseer
} from '../features/tafseer/tafseerSlice'
import { toast } from 'react-toastify'
import { Modal } from 'react-bootstrap'
import Spinner from '../components/Spinner'
import Multiselect from 'multiselect-react-dropdown'
import Pagination from '../components/Pagination'
import TafseerAyah from '../components/TafseerAyah'
import { useTranslation } from 'react-i18next'

// This page is /admin/manage-tafseers/:surahId
function ManageTafseer() {
  const params = useParams()
  const dispatch = useDispatch()

  const { t } = useTranslation('tafseer')

  const { surah, isLoading } = useSelector((state) => state.surah)
  const { noTafseerAyahs, isLoading: ayahIsLoading } = useSelector(
    (state) => state.ayah
  )
  const {
    tafseers,
    availableNumber,
    isLoading: tafseerIsLoading
  } = useSelector((state) => state.tafseer)

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [text, setText] = useState('')
  const [selectedAyahs, setSelectedAyahs] = useState([])
  const [audioFile, setAudioFile] = useState('')
  const [audioStartTime, setAudioStartTime] = useState('')
  const [audioEndTime, setAudioEndTime] = useState('')
  const [number, setNumber] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)

  const [referenceInputs, setReferenceInputs] = useState([])
  const [references, setReferences] = useState({})

  // Check if introduction exists
  const [isIntroductionExists, setIsIntroductionExists] = useState(false)

  useEffect(() => {
    // Ensure tafseers.results is defined before accessing its properties
    if (tafseers && tafseers.results) {
      setIsIntroductionExists(
        tafseers.results.length > 0 && tafseers.results[0].number === 1
      )
    }
  }, [tafseers.results])

  const { results = [], count = 0, pageCount = 1 } = tafseers || {}

  // determine if pagination needs to be rendered
  const isPagination = () => {
    if (results !== null) {
      if (pageCount > 1) {
        return true
      }
      return false
    }
    return false
  }

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => {
      if (prevPage === 1) return prevPage
      return prevPage - 1
    })
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => {
      if (prevPage === pageCount) return prevPage
      return prevPage + 1
    })
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const resetFormFields = () => {
    setText('')
    setSelectedAyahs([])
    setAudioFile('')
    setAudioStartTime('')
    setAudioEndTime('')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Await each dispatch call that invokes an asyncThunk
        await dispatch(getSurah(params.surahId)).unwrap()
        await dispatch(getNoTafseerAyahs(params.surahId)).unwrap()
        await dispatch(
          getTafseersForSurah({
            surahId: params.surahId,
            page: currentPage,
            limit
          })
        ).unwrap()
        await dispatch(getAvailableNumber(params.surahId)).unwrap()
      } catch (error) {
        // All errors that occur in any of the async thunks will end up here
        toast.error(error.message ? error.message : 'An error occurred')
      }
    }

    fetchData()

    return () => {
      dispatch(resetGetAyah())
      dispatch(resetGetTafseer())
    }
  }, [dispatch, params.surahId, currentPage, limit])

  useEffect(() => {
    if (availableNumber && availableNumber.lastNumber != null) {
      setNumber(availableNumber.lastNumber)
    }
  }, [availableNumber])

  const multiselectOptions = (noTafseerAyahs.results || []).map((ayah) => ({
    label: `(${ayah.ayahNo}) ${ayah.text}`,
    _id: ayah._id,
    text: ayah.text,
    ayahNo: ayah.ayahNo
  }))

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  // Function to extract references and prepare input fields
  const analyzeTextForReferences = (text) => {
    const referenceRegex = /\[(\d+)\]/g
    let match
    const refInputs = []
    const refData = {}

    while ((match = referenceRegex.exec(text)) !== null) {
      if (!refData[match[1]]) {
        refInputs.push(match[1])
        refData[match[1]] = ''
      }
    }

    setReferenceInputs(refInputs)
    setReferences(refData)
  }

  // Handler for Tafseer text change
  const handleTextChange = (e) => {
    const newText = e.target.value
    setText(newText)
    analyzeTextForReferences(newText)
  }

  // Handler for reference input change
  const handleReferenceChange = (refNumber, value) => {
    setReferences({ ...references, [refNumber]: value })
  }

  // Check if all references are filled
  const areAllReferencesFilled = () => {
    return referenceInputs.every(
      (ref) => references[ref] && references[ref].trim() !== ''
    )
  }

  const onTafseerSubmit = (e) => {
    e.preventDefault()
    // create objects with {_id, ayahNo} for storing in Tafseer document
    // If adding the first Tafseer (introduction), ensure no Ayahs are associated
    const ayahsOfTafseer = !isIntroductionExists
      ? []
      : selectedAyahs.map(({ _id, ayahNo, text }) => ({ _id, ayahNo, text }))

    const newTafseer = {
      text: text,
      surah: params.surahId,
      ayahs: ayahsOfTafseer,
      number: isIntroductionExists ? number : 1,
      audioFile: audioFile,
      audioStartTime: audioStartTime,
      audioEndTime: audioEndTime,
      references: referenceInputs.map((refNumber) => ({
        refNumber: parseInt(refNumber),
        text: references[refNumber]
      }))
    }

    dispatch(addTafseer(newTafseer))
      .unwrap()
      .then(() => {
        toast.success(t('tafseer_added'))
        // Now fetch the availableNumber again to get the updated value
        return dispatch(getAvailableNumber(params.surahId)).unwrap()
      })
      .then((updatedNumber) => {
        // Assuming the payload contains the new number
        if (updatedNumber && updatedNumber.lastNumber != null) {
          setNumber(updatedNumber.lastNumber)
        }
      })
      .catch((error) => {
        toast.error(error.message ? error.message : 'An error occurred')
      })

    closeModal()
    resetFormFields()
  }

  return (
    <>
      <div className='card mt-4'>
        <div className='card-header'>
          <h5 className='card-title text-center'>
            {t('tafseer_surah')} {surah.name}
          </h5>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className='card-body'>
            <p className='card-text' dir='rtl'>
              {surah.about ? (
                surah.about.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))
              ) : (
                <span>{t('no_about_info')}</span>
              )}
            </p>
          </div>
        )}
        <div className='card-footer text-muted'>
          {isLoading ? (
            <Spinner /> // Or just display 'Loading...' or nothing at all
          ) : (
            `${t('no_of_Ayahs')}: ${surah.noOfAyahs}`
          )}
        </div>
      </div>
      {!tafseerIsLoading && (
        <div className='d-grid gap-2 d-md-flex justify-content-md-start'>
          <button onClick={openModal} className='btn btn-primary mb-2 mt-2'>
            {t('add_tafseer')}
          </button>
          <Link to='audio'>
            <button className='btn btn-primary mb-2 mt-2'>
              {t('add_audio')}
            </button>
          </Link>
        </div>
      )}

      <Modal show={modalIsOpen} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('add_tafseer')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onTafseerSubmit}>
            <div className='form-group'>
              {!isIntroductionExists && (
                <div className='alert alert-warning' role='alert'>
                  {t('please_add_intro')}
                </div>
              )}
              <textarea
                name='text'
                id='text'
                className='form-textarea'
                placeholder={
                  isIntroductionExists ? t('tafseer_text') : t('intro_text')
                }
                value={text}
                onChange={handleTextChange}
              ></textarea>
              {isIntroductionExists && (
                <label htmlFor='selectedAyah'>{t('ayah_no')}</label>
              )}
              {isIntroductionExists && (
                <Multiselect
                  placeholder={ayahIsLoading ? 'Loading...' : t('select_ayahs')}
                  style={{
                    option: { direction: 'rtl', textAlign: 'right' },
                    searchBox: { direction: 'rtl' }
                  }}
                  showCheckbox='true'
                  isObject={true}
                  options={multiselectOptions}
                  displayValue='label'
                  onRemove={(e) => {
                    setSelectedAyahs(e)
                  }}
                  onSelect={(e) => {
                    setSelectedAyahs(e)
                  }}
                />
              )}
              {isIntroductionExists &&
                noTafseerAyahs &&
                noTafseerAyahs.count === 0 &&
                noTafseerAyahs.message && (
                  <div className='alert-warning mt-2' role='alert'>
                    {noTafseerAyahs.message}
                  </div>
                )}
              {isIntroductionExists &&
                noTafseerAyahs &&
                noTafseerAyahs.count > 0 && (
                  <div className='alert-success mt-2' role='alert'>
                    {`${t('count_of_ayahs')} ${noTafseerAyahs.count}`}
                  </div>
                )}
              <label htmlFor='number'>{t('sequence')}</label>
              <input
                type='text'
                className='form-control'
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                disabled={!isIntroductionExists}
              />
              {/* Dynamically generated reference inputs */}
              {referenceInputs.map((refNumber) => (
                <div key={refNumber}>
                  <label>{`${t('reference')} ${refNumber}`}</label>
                  <input
                    type='text'
                    className='form-control'
                    value={references[refNumber]}
                    onChange={(e) =>
                      handleReferenceChange(refNumber, e.target.value)
                    }
                  />
                </div>
              ))}
              {isIntroductionExists && (
                <>
                  <label htmlFor='audioFile'>{t('audio_file_name')}</label>
                  <input
                    type='text'
                    className='form-control'
                    value={audioFile}
                    placeholder='xzy.mp4'
                    onChange={(e) => setAudioFile(e.target.value)}
                  />
                  <label htmlFor='audioStartTime'>{t('start_time')}</label>
                  <input
                    type='text'
                    className='form-control'
                    value={audioStartTime}
                    placeholder='12:37'
                    onChange={(e) => setAudioStartTime(e.target.value)}
                  />
                  <label htmlFor='audioEndTime'>{t('end_time')}</label>
                  <input
                    type='text'
                    className='form-control'
                    value={audioEndTime}
                    placeholder='15:03'
                    onChange={(e) => setAudioEndTime(e.target.value)}
                  />
                </>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={closeModal}
          >
            {t('cancel')}
          </button>
          <button
            type='submit'
            className='btn btn-primary'
            onClick={onTafseerSubmit}
            disabled={!areAllReferencesFilled()}
          >
            {t('add')}
          </button>
        </Modal.Footer>
      </Modal>

      {tafseerIsLoading ? (
        <Spinner />
      ) : (
        <>
          {count === 0 && (
            <div className='alert alert-info my-4'>{t('no_tafseer')}</div>
          )}
          <div className='custom-accordion'>
            {/* // Show the first tafseer ayah in the list as the introduction */}
            {results && results.length > 0 && (
              <TafseerAyah
                ayahTafseer={results[0]}
                editable={true}
                isIntroduction={true}
              />
            )}
            {/* Display all the tafseers, skipping the introduction */}
            {results &&
              results
                .filter((tafseer) => tafseer.number !== 1) // Skip the introduction
                .map((tafseer, i) => (
                  <TafseerAyah
                    key={tafseer._id}
                    ayahTafseer={tafseer}
                    editable={true}
                  />
                ))}

            {isPagination() ? (
              <nav aria-label='Page navigation example' className='my-5'>
                <ul className='pagination justify-content-center'>
                  <li
                    className={`page-item ${
                      currentPage === 1 ? 'disabled' : ''
                    }`}
                  >
                    <button
                      className='page-link'
                      disabled={currentPage === 1}
                      onClick={handlePrevPage}
                    >
                      Previous
                    </button>
                  </li>
                  <Pagination
                    pageCount={pageCount}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                  <li
                    className={`page-item ${
                      currentPage === pageCount ? 'disabled' : ''
                    }`}
                  >
                    <button className='page-link' onClick={handleNextPage}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            ) : (
              ''
            )}
          </div>
        </>
      )}
    </>
  )
}

export default ManageTafseer
