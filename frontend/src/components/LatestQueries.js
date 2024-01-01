import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getLatestQueries, resetGetQueries } from '../features/query/querySlice'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import QueryItem from '../components/QueryItem'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

function LatestQueries() {
  const { t } = useTranslation('latest-queries')
  const dispatch = useDispatch()
  const { queries, isLoading, isSuccessQueries, isError, message } =
    useSelector((state) => state.query)

  const lang = i18next.resolvedLanguage

  useEffect(() => {
    dispatch(getLatestQueries(lang))
    if (isError) {
      toast.error(message)
    }
  }, [dispatch, isError, message, lang])

  useEffect(() => {
    return () => {
      if (isSuccessQueries) {
        dispatch(resetGetQueries())
      }
    }
  }, [dispatch, isSuccessQueries])

  if (isLoading) {
    return (
      <div className='container text-center mt-5'>
        <Spinner />{' '}
      </div>
    )
  }
  return (
    <div className='container mt-5'>
      <hr className='my-4' />
      <div className='row'>
        <h2 className='display-6 text-center mt-2'>{t('latest_queries')}</h2>
      </div>
      <div className='row'>
        <h1 className='display-3 text-center'>{t('latest_posts_1')}</h1>
        <h1 className='display-3 text-center mb-4'>{t('latest_posts_2')}</h1>
      </div>
      {queries.length === 0 ? (
        <div className='alert alert-info my-4'>{t('no_queries')}</div>
      ) : (
        <div className='row'>
          {!queries.message &&
            queries.map((query) => (
              <div key={query._id} className='col-4 mt-2'>
                <QueryItem key={query._id} query={query} editable={false} />
              </div>
            ))}
        </div>
      )}
      <div className='row mt-4'>
        <div className='col-4'></div>
        <div className='col-4 text-center'>
          <Link
            className='btn btn-primary btn-lg btn-green-on-white'
            to={'queries/all'}
          >
            {t('go_to_queries')}
          </Link>
        </div>
        <div className='col-4'></div>
      </div>
    </div>
  )
}

export default LatestQueries
