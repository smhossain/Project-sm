import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllQueries } from '../features/query/querySlice'
import { useTranslation } from 'react-i18next'
import Pagination from '../components/Pagination'
import QueryItem from '../components/QueryItem'
import Spinner from '../components/Spinner'

function ManageQueriesAll() {
  const { t } = useTranslation('latest-queries')
  const dispatch = useDispatch()
  const { queries, isLoading, isError, message } = useSelector(
    (state) => state.query
  )

  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)

  useEffect(() => {
    dispatch(
      getAllQueries({
        page: currentPage,
        limit: limit
      })
    )
  }, [currentPage, limit, dispatch])

  const { results = [], count = 0, pageCount = 1 } = queries || {}

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

  return (
    <div className='container-fluid mt-5'>
      <h1>{t('manage_all_queries_page')}</h1>
      <div className='alert alert-light' role='alert'>
        {t('count', { count })}
      </div>
      <div className='alert alert-info'>{t('manage_all_queries')}</div>
      <h5>{t('all_queries')}</h5>
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

      {isPagination() ? (
        <nav aria-label='Page navigation example' className='my-5'>
          <ul className='pagination justify-content-center'>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
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
  )
}

export default ManageQueriesAll
