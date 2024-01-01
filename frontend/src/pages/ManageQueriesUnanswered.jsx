import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUnansweredQueries } from '../features/query/querySlice'
import { useTranslation } from 'react-i18next'
import QueryItem from '../components/QueryItem'
import Spinner from '../components/Spinner'

function ManageQueriesUnanswered() {
  const { t } = useTranslation('latest-queries')
  const dispatch = useDispatch()
  const { queries, isLoading, isError, message } = useSelector(
    (state) => state.query
  )

  const { count, results } = queries

  useEffect(() => {
    dispatch(getUnansweredQueries())
  }, [dispatch])

  return (
    <div className='container-fluid mt-5'>
      <h1>{t('manage_unanswered_queries_page')}</h1>
      <div className='alert alert-info mt-3'>
        {t('manage_unanswered_queries')}
      </div>
      <div className='alert alert-light' role='alert'>
        {t('count', { count })}
      </div>
      <h4>{t('unanswered_queries')}</h4>

      {count === 0 && (
        <div className='alert alert-info my-4'>{t('no_queries')}</div>
      )}

      {isLoading && (
        <div
          className='d-flex justify-content-center align-items-center'
          style={{ minHeight: '200px' }}
        >
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>
              <Spinner />
            </span>
          </div>
        </div>
      )}

      {isError && <div className='alert alert-danger my-4'>{message}</div>}

      <div className='row gy-4'>
        {results &&
          (results || []).map((query) => (
            <div key={query._id} className='col-md-6'>
              <QueryItem query={query} editable={true} />
            </div>
          ))}
      </div>
    </div>
  )
}

export default ManageQueriesUnanswered
