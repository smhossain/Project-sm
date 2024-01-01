import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import {
  addSurah,
  resetAdd,
  getAllSurahs,
  resetGet
} from '../features/surah/surahSlice'
import Spinner from '../components/Spinner'
import SurahItem from '../components/SurahItem'
import NewSurahModal from '../components/NewSurahModal'

// It's /admin/manage-surahs page which shows all the surahs
// You can also add a new Surah in this page
function ManageSurahs() {
  const [name, setSurahName] = useState('')
  const [noOfAyahs, setNoOfAyahs] = useState(1)
  const [section, setSection] = useState([])
  const [number, setNumber] = useState(1)
  const [about, setAbout] = useState('')
  const [showModal, setShowModal] = useState(false)

  const resetState = () => {
    setSurahName('')
    setNoOfAyahs(1)
    setSection(1)
    setAbout('')
    setNumber(1)
    setSection([])
    setShowModal(false)
  }

  const { t } = useTranslation('surah')

  const sectionsInput = Array.from({ length: 30 }, (_, i) => i + 1) // initialize array for 30 sections to be displayed for checkbox for adding a new Surah

  const handleCheckBoxChange = (e) => {
    let isSelected = e.target.checked
    let value = parseInt(e.target.value)

    if (isSelected) {
      setSection([...section, value])
    } else {
      setSection((prevData) => {
        return prevData.filter((id) => {
          return id !== value
        })
      })
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleShowModal = () => {
    setShowModal(true)
  }

  const { surahs, isError, isLoading, isSuccessAdd, isSuccessGet, message } =
    useSelector((state) => state.surah)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllSurahs())

    if (isError) {
      toast.error(message)
    }

    return () => {
      if (isSuccessAdd) {
        resetState()
        dispatch(resetAdd())
      }
      if (isSuccessGet) {
        dispatch(resetGet())
      }
    }
  }, [dispatch, isError, isSuccessAdd, message, isSuccessGet])

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(addSurah({ name, section, noOfAyahs, number, about }))

    resetState()
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <div className='mt-2 mb-4'>
        <h1>{t('all_surahs')}</h1>
      </div>
      <div className='alert alert-info'>{t('here_you_can')}</div>
      <button
        onClick={handleShowModal}
        className='btn btn-primary mb-2 query-btn'
      >
        {t('add_surah')}
      </button>
      <div className='wrapper'>
        {surahs.length === 0 ? (
          <p>{t('no_surahs')}</p>
        ) : (
          surahs.map((surah) => (
            <SurahItem
              key={surah._id}
              surah={surah}
              editable={true}
              type='surahs'
            />
          ))
        )}
      </div>
      <NewSurahModal
        show={showModal}
        handleClose={handleCloseModal}
        onSubmit={onSubmit}
        name={name}
        setName={setSurahName}
        noOfAyahs={noOfAyahs}
        setNoOfAyahs={setNoOfAyahs}
        number={number}
        setNumber={setNumber}
        about={about}
        setAbout={setAbout}
        section={section}
        setSection={setSection}
        handleCheckBoxChange={handleCheckBoxChange}
        sectionsInput={sectionsInput}
      />
    </>
  )
}

export default ManageSurahs
