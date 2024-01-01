import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllQueries, resetGetQueries } from '../features/query/querySlice'
import { useTranslation } from 'react-i18next'
import Pagination from '../components/Pagination'
import QueryItem from '../components/QueryItem'
import Spinner from '../components/Spinner'
import TagFilter from '../components/TagFilter'
import i18next from 'i18next'
import SearchBar from '../components/SearchBar'

function AllQueries() {
  const { t } = useTranslation('latest-queries', 'general')
  const dispatch = useDispatch()
  const { queries, isLoading, isSuccessQuery, isError, message } = useSelector(
    (state) => state.query
  )

  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(5)
  const [activeFilters, setActiveFilters] = useState({
    mainTag: null,
    tags: []
  })
  const [isSearching, setIsSearching] = useState(false)

  const performSearch = useCallback(
    (searchTerm) => {
      if (searchTerm.trim()) {
        setIsSearching(true)
        dispatch(
          getAllQueries({
            page: 1,
            limit: limit,
            searchTerm: searchTerm,
            lang: i18next.resolvedLanguage,
            filters: activeFilters
          })
        )
      } else {
        setIsSearching(false)
        // Fetch the original content again
        dispatch(
          getAllQueries({
            page: currentPage,
            limit: limit,
            isPublishable: true,
            lang: i18next.resolvedLanguage,
            filters: activeFilters
          })
        )
      }
    },
    [limit, dispatch, activeFilters, currentPage]
  )

  useEffect(() => {
    if (!isSearching) {
      dispatch(
        getAllQueries({
          page: currentPage,
          limit: limit,
          isPublishable: true,
          lang: i18next.resolvedLanguage,
          filters: activeFilters
        })
      )
    }
  }, [currentPage, limit, activeFilters, isSearching, dispatch])

  useEffect(() => {
    return () => {
      if (isSuccessQuery) {
        dispatch(resetGetQueries())
      }
    }
  }, [isSuccessQuery, dispatch])

  // When handleFilterChange is called, it should update the activeFilters state and reset search
  const handleFilterChange = (newFilters) => {
    setIsSearching(false)
    setActiveFilters(newFilters)
  }

  const { results = [], count = 0, pageCount = 1 } = queries || {}

  // determine if pagination needs to be rendered
  // When pagination is used, we should stop the search and show regular results
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

  const paginate = (pageNumber) => {
    setIsSearching(false)
    setCurrentPage(pageNumber)
  }

  const displayCount = () => {
    switch (count) {
      case 1:
        return t('count_one')
      case 2:
        return t('count_two')
      case count > 2 && count < 11:
        return t('count', { count })
      default:
        return t('count_after_ten', { count })
    }
  }

  return (
    <div className='container mt-5'>
      <div className='row'>
        <div className='col-md-4'></div>
        <div className='col-md-4'>
          <SearchBar context='queries' onSearch={performSearch} />
        </div>
        <div className='col-md-4'></div>
      </div>
      <div className='alert alert-success' role='alert'>
        {displayCount()}
      </div>
      <h5>{t('all_queries')}</h5>
      {isLoading && (
        <div className='d-flex justify-content-center align-items-center mt-2'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>
              <Spinner />
            </span>
          </div>
        </div>
      )}

      {isError && <div className='alert alert-danger my-4'>{message}</div>}

      {count === 0 && (
        <div className='alert alert-info my-4'>{t('no_queries')}</div>
      )}
      <div className='row'>
        <div className='col-md-10'>
          <div className='row gy-4'>
            {results &&
              (results || []).map((query) => (
                <div key={query._id} className='col-12'>
                  <QueryItem query={query} editable={false} />
                </div>
              ))}
          </div>
        </div>
        <div className='col-md-2'>
          <TagFilter
            onFilterChange={handleFilterChange}
            activeFilters={activeFilters}
          />
        </div>
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
                {t('previous', { ns: 'general' })}
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
                {t('next', { ns: 'general' })}
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

export default AllQueries
