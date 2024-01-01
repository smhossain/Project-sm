import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getLatestQueries, resetGetQueries } from '../features/query/querySlice'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import QueryItem from '../components/QueryItem'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

// This is /queries page
function Queries() {
  const { t } = useTranslation('latest-queries')
  const dispatch = useDispatch()
  const { queries, isLoading, isSuccessQueries, isError, message } =
    useSelector((state) => state.query)

  useEffect(() => {
    dispatch(getLatestQueries(i18next.resolvedLanguage))
  }, [dispatch])

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
  }, [isError, message])

  useEffect(() => {
    return () => {
      if (isSuccessQueries) {
        dispatch(resetGetQueries())
      }
    }
  }, [dispatch, isSuccessQueries])

  return (
    <>
      <div className='container mt-5'>
        <h2>{t('latest_queries')}</h2>
        {isLoading && (
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>
              <Spinner />
            </span>
          </div>
        )}
        {queries && queries.length === 0 ? (
          <div className='alert alert-info my-4'>{t('no_queries')}</div>
        ) : (
          <div className='row'>
            {(queries || []).map((query) => (
              <div key={query._id} className='col-lg-6'>
                <QueryItem query={query} editable={false} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Queries
