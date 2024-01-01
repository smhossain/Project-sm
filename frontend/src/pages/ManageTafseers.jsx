import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getAllSurahs } from '../features/surah/surahSlice'
import Spinner from '../components/Spinner'
import SurahItem from '../components/SurahItem'
import { useTranslation } from 'react-i18next'

function ManageTafseers() {
  const dispatch = useDispatch()
  const { t } = useTranslation('tafseer')
  // const { tafseers, isError, isLoading, isSuccessAdd, isSuccessGet, message} = useSelector((state) => state.tafseer)
  const { surahs, isError, isLoading, message } = useSelector(
    (state) => state.surah
  )

  useEffect(() => {
    dispatch(getAllSurahs())

    if (isError) {
      toast.error(message)
    }
  }, [dispatch, isError, message])

  if (isLoading) {
    return <Spinner />
  }
  return (
    <>
      <h1>{t('all_tafseers')}</h1>
      <div className='alert alert-info'>{t('here_you_can')}</div>
      <div className='wrapper'>
        {surahs.length === 0 ? (
          <p>{t('no_tafseer')}</p>
        ) : (
          surahs.map((surah) => (
            <SurahItem
              key={surah._id}
              surah={surah}
              editable={false}
              type='tafseers'
            />
          ))
        )}
      </div>
    </>
  )
}

export default ManageTafseers
