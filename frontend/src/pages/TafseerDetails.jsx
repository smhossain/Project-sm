import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getSurah } from '../features/surah/surahSlice'
import {
  getTafseersForSurah,
  searchTafseers,
  resetSearchResults
} from '../features/tafseer/tafseerSlice'
import { getAudioMetaDataBySurahId } from '../features/audio/audioSlice'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import TafseerAyah from '../components/TafseerAyah'
import Spinner from '../components/Spinner'
import Pagination from '../components/Pagination'
import TafseerSide from '../components/TafseerSide'
import React from 'react'
import AudioPlayer from '../components/audioPlayer/AudioPlayer'
import SearchBar from '../components/SearchBar'
import { debounce } from 'lodash'
import TafseerItem from '../components/TafseerItem'

// This is the /tafseer/all/:surahId page where the surah along with ayahs and tafseers in accordion format are shown
// The TafseerAyah is the accordion component
function TafseerDetails() {
  const params = useParams()
  const dispatch = useDispatch()

  const { t } = useTranslation('tafseer', 'general')

  const { surah, isLoading, isError, message } = useSelector(
    (state) => state.surah
  )

  const surahId = params.surahId

  const {
    tafseers,
    searchResults,
    isLoading: tafseerIsLoading,
    isError: tafseerIsError
  } = useSelector((state) => state.tafseer)
  const { results: searchReturn, count: searchCount } = searchResults

  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)
  const [showPlayer, setShowPlayer] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const { results = [], pageCount = 1 } = tafseers || {}

  useEffect(() => {
    console.log('component rerendered')
  })

  useEffect(() => {
    dispatch(getSurah(surahId))
    dispatch(getTafseersForSurah({ surahId, page: currentPage, limit }))
    dispatch(getAudioMetaDataBySurahId(surahId))

    if (isError) {
      toast.error(message)
    }
  }, [dispatch, surahId, isError, message, currentPage, limit])

  const debouncedSearchRef = useRef(
    debounce((term) => {
      if (term.trim()) {
        dispatch(searchTafseers({ searchTerm: term, surahId }))
      }
    }, 500)
  )

  useEffect(() => {
    const debouncedSearch = debouncedSearchRef.current
    debouncedSearch(searchTerm)

    return () => {
      debouncedSearch.cancel()
    }
  }, [searchTerm])

  const handleSearchTermChange = (newTerm) => {
    setSearchTerm(newTerm)

    if (!newTerm.trim()) {
      dispatch(resetSearchResults())
      debouncedSearchRef.current.cancel()
    }
  }

  const { audios, isLoading: audioIsLoading } = useSelector(
    (state) => state.audio
  )
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

  const handlePlayerShow = () => {
    setShowPlayer((prev) => !prev)
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const isSearchActive = searchTerm.trim().length > 0

  if (isLoading || tafseerIsLoading) {
    return <Spinner />
  }
  return (
    <>
      <div className='container py-4'>
        <div className='d-flex align-items-center mb-4'>
          <SearchBar
            context='surah'
            onSearch={handleSearchTermChange}
            surahName={surah.name}
            searchTerm={searchTerm}
          />
        </div>
        {!isSearchActive && (
          <div className='d-flex align-items-center mb-4'>
            <h4 className='mb-0 mr-2'>{t('listen_to_tafseer')}</h4>
            <button
              className='btn btn-sm btn-danger d-flex align-items-center justify-content-center ms-2'
              onClick={handlePlayerShow}
            >
              <span className='material-symbols-outlined'>play_arrow</span>
            </button>
          </div>
        )}
        {!audioIsLoading && !isSearchActive && (
          <div
            className={`d-flex justify-content-center mb-5 ${
              showPlayer ? 'audio-player-shown' : 'audio-player-hidden'
            }`}
          >
            <AudioPlayer audios={audios} handlePlayerShow={handlePlayerShow} />
          </div>
        )}
        <div className='row'>
          <div className='col'>
            <TafseerItem details={surah} trim={false} link={false} />
          </div>
          <div className='col-md-auto'></div>
        </div>

        <br />
        {/* Conditional Rendering Based on Search Active State */}
        {isSearchActive ? (
          <div className='row'>
            {/* Render Search Results */}
            {searchReturn && searchCount > 0 && (
              <div className='alert alert-info my-4'>
                {t('matches_found', { count: searchCount })}
              </div>
            )}
            {searchReturn && searchReturn.length > 0 ? (
              searchReturn.map((tafseer, i) => (
                <React.Fragment key={i}>
                  <div className='row'>
                    <div className='col'>
                      <TafseerAyah
                        ayahTafseer={tafseer}
                        eventKey={i}
                        defaultActiveKey={i}
                      />
                    </div>
                    <div className='col-md-auto'>
                      <TafseerSide text={tafseer.text} />
                    </div>
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div className='alert alert-info my-4'>
                {t('no_search_results')}
              </div>
            )}
          </div>
        ) : (
          <div className='row'>
            {(isError || tafseerIsError) && (
              <div className='alert alert-warning' role='alert'>
                {t('error')}
              </div>
            )}

            {/* // Show the first tafseer ayah in the list as the introduction */}
            {results && results.length > 0 && (
              <TafseerAyah
                ayahTafseer={results[0]}
                editable={false}
                isIntroduction={true}
              />
            )}
            {/* Render Regular Tafseer Content, skipping the introduction */}
            {results &&
              results
                .filter((tafseer) => tafseer.number !== 1) // Exclude the introduction
                .map((tafseer, i) => (
                  <React.Fragment key={i}>
                    <div className='row'>
                      <div className='col'>
                        <TafseerAyah
                          ayahTafseer={tafseer}
                          eventKey={i}
                          defaultActiveKey={i === 0 ? i : null}
                        />
                      </div>
                      <div className='col-md-auto'>
                        <TafseerSide text={tafseer.text} />
                      </div>
                    </div>
                  </React.Fragment>
                ))}
          </div>
        )}
        {!isSearchActive && isPagination() ? (
          <nav aria-label='Page navigation example' className='my-5'>
            <ul className='pagination justify-content-center'>
              <li
                className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
              >
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
    </>
  )
}

export default TafseerDetails
