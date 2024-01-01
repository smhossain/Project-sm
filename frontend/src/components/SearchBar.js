import React, { useState, useEffect, useMemo, useRef } from 'react'
import { debounce } from 'lodash'
import { useTranslation } from 'react-i18next'

const SearchBar = ({ context, onSearch, surahName, searchTerm }) => {
  const { t } = useTranslation('general')
  const [inputValue, setInputValue] = useState('') // Only one state hook needed

  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputValue])

  const SearchIcon = () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      fill='currentColor'
      className='bi bi-search'
      viewBox='0 0 16 16'
    >
      <path d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z' />
    </svg>
  )

  useEffect(() => {
    setInputValue(searchTerm)
  }, [searchTerm])

  const debouncedSearch = useMemo(() => debounce(onSearch, 500), [onSearch])

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const handleInputChange = (event) => {
    const newValue = event.target.value
    setInputValue(newValue) // Update state
    debouncedSearch(newValue) // Debounce the search function call
  }

  const getPlaceholderText = () => {
    switch (context) {
      case 'queries':
        return `${t('search_in')} ${t('queries')}`
      case 'surah':
        return `${t('search_in_surah')} ${surahName}`
      default:
        return `${t('search_in')} ${t('tafseers')}`
    }
  }

  return (
    <div className='input-group mb-3'>
      <span className='input-group-text' id='search-label'>
        <SearchIcon />
      </span>
      <input
        ref={inputRef}
        type='search'
        value={inputValue}
        onChange={handleInputChange}
        placeholder={getPlaceholderText()}
        className='form-control'
        aria-label='Search'
        aria-describedby='search-label'
      />
    </div>
  )
}

export default SearchBar
