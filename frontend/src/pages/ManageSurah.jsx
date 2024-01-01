import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getSurah } from '../features/surah/surahSlice'
import {
  getAyahs,
  addAyah,
  resetAdd,
  resetGetAyah
} from '../features/ayah/ayahSlice'
import { useDispatch, useSelector } from 'react-redux'
import { FaPlus } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import SurahItem from '../components/SurahItem'
import Spinner from '../components/Spinner'
import AyahItem from '../components/AyahItem'
import Pagination from '../components/Pagination'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
const _ = require('lodash')

// This page is /admin/manage-surahs/:surahId where you can edit the Surah and add Ayah to it
// It uses SurahItem to list the Surahs and AyahItem for adding an Ayah

function ManageSurah() {
  const customStyles = {
    content: {
      width: '600px',
      top: '50%',
      left: i18next.resolvedLanguage === 'ar' ? 'initial' : '50%',
      right: i18next.resolvedLanguage === 'ar' ? '80%' : 'auto%',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      position: 'relative'
    }
  }

  Modal.setAppElement('#root')

  const { t } = useTranslation('surah', 'general')

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [ayahText, setAyahText] = useState('')
  const [ayah, setAyah] = useState('')
  const [multipleAdd, setMultipleAdd] = useState(false)
  const [addError, setAddError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(50)

  const navigate = useNavigate()

  const handleMultipleAdd = (e) => {
    setMultipleAdd(e.target.checked)
  }

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  const { surah, isLoading, isError, message } = useSelector(
    (state) => state.surah
  )

  const {
    ayahs,
    isLoading: ayahsLoading,
    isError: ayahError,
    message: ayahMessage,
    isSuccessAdd
  } = useSelector((state) => state.ayah)

  const params = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getSurah(params.surahId)).then(
      dispatch(
        getAyahs({ surahId: params.surahId, page: currentPage, limit: limit })
      )
    )

    if (isError) {
      toast.error(message)
    }

    if (ayahError) {
      toast.error(ayahMessage)
    }

    if (isSuccessAdd) {
      setAyahText('')
      setAyah('')
    }
  }, [
    isError,
    ayahError,
    message,
    ayahMessage,
    params.surahId,
    isSuccessAdd,
    currentPage,
    limit,
    dispatch
  ])

  // clean up
  useEffect(() => {
    return () => {
      dispatch(resetAdd())
      dispatch(resetGetAyah())
    }
  }, [dispatch])

  // when adding Ayahs, the Ayahs are prepared first
  const prepareData = () => {
    // if one Ayah is being added
    if (!multipleAdd) {
      return {
        text: ayahText,
        ayahNo: ayah,
        surah: params.surahId,
        surahName: surah.name
      }
    } else {
      // If multiple Ayahs being added
      // Split the text into verses using the regular expression
      try {
        const ayahArray = ayahText
          .split(/\(\d+\)/)
          .filter((verse) => verse.trim() !== '')

        // Remove leading and trailing whitespace from each verse
        const cleanedVerses = ayahArray.map((verse) => verse.trim())

        // Extract verse numbers
        const extractedVerseNumbers = ayahText
          .match(/\(\d+\)/g)
          .map((number) => Number(number.replace(/\(|\)/g, '')))

        // Create an array of objects containing verse number and text
        const ayahObjects = cleanedVerses.map((verse, index) => ({
          ayahNo: extractedVerseNumbers[index],
          text: verse,
          surah: params.surahId,
          surahName: surah.name
        }))
        return ayahObjects
      } catch (error) {
        setAddError(error)
        toast.error(addError)
      }
    }
  }

  // determine if pagination needs to be rendered
  const isPagination = () => {
    if (ayahs !== null) {
      if (ayahs.pageCount > 1) {
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
      if (prevPage === ayahs.pageCount) return prevPage
      return prevPage + 1
    })
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const onAyahSubmit = (e) => {
    e.preventDefault()
    const ayahData = prepareData()
    dispatch(addAyah(ayahData))
    dispatch(resetAdd())
    closeModal()
    navigate(`/admin/manage-surahs/${params.surahId}`)
  }

  if (isLoading || ayahsLoading) {
    return <Spinner />
  }

  return (
    <>
      {/* render Surah information */}
      {surah && (
        <SurahItem
          key={surah._id}
          surah={surah}
          editable={false}
          type='surahs'
        />
      )}
      {/* Render add Ayah button */}
      <div className='btn-right'>
        <button onClick={openModal} className='btn btn-primary mb-2 query-btn'>
          <FaPlus /> {t('add_ayah')}
        </button>
      </div>

      {/* Modal that opens when Add Ayah is clicked */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel='Add Ayahs'
      >
        <h2>{t('add_ayah')}</h2>
        {/* <button className='btn-close' onClick={closeModal}>
          X
        </button> */}
        <form onSubmit={onAyahSubmit}>
          <div className='form-group'>
            <label htmlFor='multiple'>
              <input
                id='multiple'
                type='checkbox'
                checked={multipleAdd}
                onChange={handleMultipleAdd}
              />{' '}
              {t('add_multiple_ayahs')}
            </label>
            <textarea
              name='text'
              id='text'
              className='form-textarea'
              placeholder={multipleAdd ? t('ayahs_text') : t('ayah_text')}
              value={ayahText}
              onChange={(e) => setAyahText(e.target.value)}
            ></textarea>
            {!multipleAdd && (
              <>
                <label htmlFor='ayah'>{t('ayah_number')}</label>
                <input
                  id='ayah'
                  type='number'
                  className='form-control'
                  value={ayah}
                  placeholder='1-30'
                  autoComplete='on'
                  onChange={(e) => setAyah(e.target.value)}
                />
              </>
            )}
          </div>
          <div className='form-group'>
            <button className='btn btn-primary mb-2' type='submit'>
              {t('add_button')}
            </button>
            <button
              className='btn btn-secondary ms-2 mb-2'
              type='button'
              onClick={closeModal}
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </Modal>

      <div className='card'>
        <div className='card-header'>
          {t('no_of_ayahs')}: {ayahs === null ? '' : ayahs.count}
        </div>
        <div className='card-body'>
          {ayahs.message && t('no_ayahs')}
          {ayahMessage !== '' ? t('not_found') : ''}
          {ayahs === null || _.isEmpty(ayahs)
            ? ''
            : ayahs.results.map((item) => (
                <AyahItem key={item._id} ayah={item} />
              ))}
        </div>
      </div>
      <br />
      {isPagination() ? (
        <nav aria-label='Page navigation example'>
          <ul className='pagination justify-content-center'>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className='page-link'
                disabled={currentPage === 1}
                onClick={handlePrevPage}
              >
                {t('previous')}
              </button>
            </li>
            <Pagination
              pageCount={ayahs.pageCount}
              paginate={paginate}
              currentPage={currentPage}
            />
            <li
              className={`page-item ${
                currentPage === ayahs.pageCount ? 'disabled' : ''
              }`}
            >
              <button className='page-link' onClick={handleNextPage}>
                {t('next')}
              </button>
            </li>
          </ul>
        </nav>
      ) : (
        ''
      )}
    </>
  )
}

export default ManageSurah
