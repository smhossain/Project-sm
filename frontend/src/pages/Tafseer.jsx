import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getAllSurahsWithTafseers } from '../features/tafseer/tafseerSlice'
import { useTranslation } from 'react-i18next'
import TafseerItem from '../components/TafseerItem'
import Spinner from '../components/Spinner'

// This is the /tafseer page where the available tafseers are shown for the user
function Tafseer() {
  const dispatch = useDispatch()
  const { t } = useTranslation('tafseer')
  const { tafseers, isLoading, isError, message } = useSelector(
    (state) => state.tafseer
  )
  useEffect(() => {
    dispatch(getAllSurahsWithTafseers())

    if (isError) {
      toast.error(message)
    }
  }, [dispatch, message, isError])

  if (isLoading) {
    return <Spinner />
  }

  // Ensure tafseers is an array before mapping
  const tafseerList = Array.isArray(tafseers) ? tafseers : []

  return (
    <div className='container'>
      <h1 className='mb-3'>{t('all_tafseers')}</h1>
      <div className='row'>
        {tafseerList.map((item) => (
          <div className='col' key={item._id}>
            <TafseerItem details={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tafseer
