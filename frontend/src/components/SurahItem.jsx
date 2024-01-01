import { deleteSurah } from '../features/surah/surahSlice'
import { deleteTafseersOfSurah } from '../features/tafseer/tafseerSlice'
import { deleteAyahsOfSurah } from '../features/ayah/ayahSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Spinner from './Spinner'
import SurahEditForm from './SurahEditForm'

// This is the card that shows the information about a Surah
// It takes three props, the surah object, editable boolean (the editable version is for manage-surahs page, non-editable for surahs & tafseers pages)
// type prop (surah or tafseer) used for the Link property to take the user to the details of the surah page
function SurahItem({ surah, editable, type }) {
  const [itemEdit, setItemEdit] = useState(false)

  const { t } = useTranslation('surah')

  const dispatch = useDispatch()
  const location = useLocation()
  const { isLoading } = useSelector((state) => state.ayah)

  const handleDelete = () => {
    if (
      window.confirm(
        'Are you sure you want to delete the Surah along with all its Ayahs and Tafseers?'
      )
    ) {
      dispatch(deleteSurah(surah._id))
    }
  }

  const toggleEdit = () => {
    setItemEdit(!itemEdit)
  }

  if (isLoading) {
    return <Spinner />
  }
  // when edit button is on
  return (
    <div className='card'>
      {editable && itemEdit ? (
        <>
          <SurahEditForm
            surah={surah}
            onSave={toggleEdit}
            onCancel={toggleEdit}
          />
        </>
      ) : (
        // when edit button is off
        <>
          {/* if it's editable, then delete and edit buttons rendered in the header of the card */}
          <div className='card-header'>
            {t('sections')}{' '}
            {Array.isArray(surah.section) &&
              surah.section.map((sec) => sec + ' ')}
            {editable && (
              <button
                onClick={handleDelete}
                className='btn btn-outline-danger btn-sm'
              >
                {t('delete')}
              </button>
            )}
            {editable && (
              <button
                onClick={toggleEdit}
                className='btn btn-outline-primary btn-sm ms-2'
              >
                {t('edit')}
              </button>
            )}
          </div>
          {/* Here is the card body where details about the Surah are rendered */}
          <div className='card-body'>
            <blockquote className='blockquote mb-0'>
              {/* if we are in /admin/manage-surahs or manage-ayahs, then, the Surah name is a link otherwise it's a regular name */}
              {location.pathname === `/admin/manage-${type}/${surah._id}` ? (
                <p>{surah.name}</p>
              ) : (
                <p>
                  <Link className='link' to={`${surah._id}`}>
                    {surah.name}
                  </Link>
                </p>
              )}
              <p>
                {t('surah_number')}
                {surah.number}
              </p>
              <footer className='blockquote-footer'>
                {t('ayahs')} {surah.noOfAyahs}
              </footer>
            </blockquote>
          </div>
        </>
      )}
    </div>
  )
}

export default SurahItem
