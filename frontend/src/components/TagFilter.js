import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllMainTags, getSubTagsForTag } from '../features/tag/tagSlice'
import i18next from 'i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const TagFilter = ({ onFilterChange, activeFilters }) => {
  const dispatch = useDispatch()
  const { tagsAr, tagsEn, subTagsByMainTagId } = useSelector(
    (state) => state.tag
  )
  const [selectedMainTag, setSelectedMainTag] = useState(null)

  useEffect(() => {
    dispatch(getAllMainTags())
  }, [dispatch])

  const selectMainTag = (tag) => {
    setSelectedMainTag(tag)
    dispatch(getSubTagsForTag(tag._id))
    onFilterChange({
      mainTag: { _id: tag._id, name: tag.name },
      tags: activeFilters.tags.map((t) => ({ _id: t._id, name: t.name }))
    }) // include subtags in the change
  }

  const selectSubTag = (subTag) => {
    const newTags = [...activeFilters.tags]
    const isFilterActive = newTags.some((tag) => tag._id === subTag._id)
    if (!isFilterActive) {
      newTags.push({ _id: subTag._id, name: subTag.name })
      onFilterChange({ mainTag: selectedMainTag, tags: newTags })
    }
  }

  const removeFilter = (filterId) => {
    const updatedTags = activeFilters.tags.filter((tag) => tag._id !== filterId)
    onFilterChange({ mainTag: selectedMainTag, tags: updatedTags })
  }

  // Call onFilterChange with null for mainTag when it is deselected
  const removeMainTag = () => {
    setSelectedMainTag(null)
    onFilterChange({ mainTag: null, tags: activeFilters.tags })
  }

  // Render buttons for tags or subtags
  const renderFilterButtons = (tags, sub = false) => {
    return (tags || []).map((tag) => (
      <button
        key={tag._id}
        className={`btn ${sub ? 'btn-outline-info' : 'btn-info'} mx-1 my-1`}
        onClick={() => (sub ? selectSubTag(tag) : selectMainTag(tag))}
      >
        {tag.name}
      </button>
    ))
  }

  const mainTags = i18next.resolvedLanguage === 'ar' ? tagsAr : tagsEn
  const subTags = selectedMainTag
    ? subTagsByMainTagId[selectedMainTag._id] || []
    : []

  return (
    <div className='d-flex flex-column align-items-end'>
      {/* Display active filters */}
      <div className='d-flex flex-wrap mb-3'>
        {selectedMainTag && (
          <span className='badge bg-primary mx-1 my-1'>
            {selectedMainTag.name}{' '}
            <FontAwesomeIcon icon={faTimes} onClick={removeMainTag} />
          </span>
        )}
        {activeFilters.tags.map((filter) => (
          <span key={filter._id} className='badge bg-secondary mx-1 my-1'>
            {filter.name}{' '}
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => removeFilter(filter._id)}
            />
          </span>
        ))}
      </div>
      {/* Render back button when subtags are visible */}
      {selectedMainTag && (
        <button
          onClick={() => {
            removeMainTag() // use the removeMainTag function which correctly handles the state update
          }}
          className='btn btn-secondary mb-3'
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      )}
      <div className='btn-group-vertical'>
        {/* Render main tags or subtags based on selection */}
        {!selectedMainTag
          ? renderFilterButtons(mainTags)
          : renderFilterButtons(subTags, true)}
      </div>
    </div>
  )
}

export default TagFilter
