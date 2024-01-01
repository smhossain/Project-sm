import { useState, React, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  searchTafseers,
  resetSearchResults
} from '../features/tafseer/tafseerSlice'
import { useTranslation } from 'react-i18next'
import Spinner from '../components/Spinner'
import SearchBar from '../components/SearchBar'
import TafseerAyah from '../components/TafseerAyah'
import TafseerSide from '../components/TafseerSide'

function TafseerSearch() {
  const { t } = useTranslation('tafseer')
  const dispatch = useDispatch()
  const { searchResults, isLoading, isError, message } = useSelector(
    (state) => state.tafseer
  )

  const { results, count } = searchResults
  const [searchTerm, setSearchTerm] = useState('')

  // Directly dispatch search or reset action when searchTerm changes
  useEffect(() => {
    if (searchTerm.trim()) {
      dispatch(searchTafseers({ searchTerm }))
    } else {
      dispatch(resetSearchResults())
    }
  }, [searchTerm, dispatch])

  return (
    <div className='container'>
      <div className='row text-center mt-2'>
        <h1>{t('search_for')}</h1>
      </div>
      <div className='row text-center mt-2'>
        <h5>{t('you_can_search')}</h5>
      </div>
      <div className='row mt-4'>
        <div className='col-md-2'></div>
        <div className='col-md-8'>
          <SearchBar context='tafseers' onSearch={setSearchTerm} />
        </div>
        <div className='col-md-2'></div>
      </div>
      {isError && (
        <div className='alert alert-danger' role='alert'>
          {message}
        </div>
      )}
      <div className='row'>
        {count === 0 && (
          <div className='alert alert-info my-3'>{t('no_match')}</div>
        )}
        {count > 0 && (
          <div className='alert alert-success my-3' role='alert'>
            {t('matches_found', { count })}
          </div>
        )}
        {results &&
          (results || []).map((tafseer, i) => (
            <>
              <div className='row'>
                <div className='col'>
                  <TafseerAyah
                    ayahTafseer={tafseer}
                    eventKey={i}
                    defaultActiveKey={i}
                    editable={false}
                    key={i}
                  />
                </div>
                <div className='col-md-auto'>
                  <TafseerSide text={tafseer.text} />
                </div>
              </div>
            </>
          ))}
      </div>
    </div>
  )
}

export default TafseerSearch
