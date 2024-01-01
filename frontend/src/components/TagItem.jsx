import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { updateTag } from '../features/tag/tagSlice'

const TagItem = ({
  tag,
  onDeleteMainTag,
  onDeleteSubTag,
  selectedLanguage
}) => {
  const { t } = useTranslation('latest-queries')
  const dispatch = useDispatch()

  const [isEditingMainTag, setIsEditingMainTag] = useState(false)
  const [editedMainTagName, setEditedMainTagName] = useState(tag.name)
  const [editingSubTagId, setEditingSubTagId] = useState(null)
  const [editedSubTagName, setEditedSubTagName] = useState('')

  const handleMainTagEditChange = (e) => {
    setEditedMainTagName(e.target.value)
  }

  const handleSubTagEditChange = (e) => {
    setEditedSubTagName(e.target.value)
  }

  const handleEditMainTagSubmit = () => {
    const newTag = {
      _id: tag._id,
      name: editedMainTagName,
      language: selectedLanguage,
      parentId: null
    }
    dispatch(updateTag(newTag))
    setIsEditingMainTag(false)
  }

  const handleEditSubTagSubmit = () => {
    const newSubTag = {
      _id: editingSubTagId,
      name: editedSubTagName,
      language: selectedLanguage,
      parentId: tag._id
    }
    dispatch(updateTag(newSubTag))
    setEditingSubTagId(null)
  }

  const handleCancelEdit = () => {
    setIsEditingMainTag(false)
    setEditingSubTagId(null)
  }

  return (
    <div className='card mb-3'>
      <div className='card-header'>
        {isEditingMainTag ? (
          <div className='d-flex align-items-center'>
            <input
              type='text'
              value={editedMainTagName}
              onChange={handleMainTagEditChange}
              className='form-control me-2'
            />
            <button
              className='btn btn-outline-success btn-sm'
              onClick={handleEditMainTagSubmit}
            >
              {t('save')}
            </button>
            <button
              className='btn btn-outline-secondary btn-sm ms-2'
              onClick={handleCancelEdit}
            >
              {t('cancel')}
            </button>
          </div>
        ) : (
          <>
            {tag.name}
            <button
              className='btn btn-outline-danger btn-sm float-end ms-2'
              onClick={() => onDeleteMainTag(tag._id)}
            >
              {t('delete')}
            </button>
            <button
              className='btn btn-outline-primary btn-sm float-end ms-2'
              onClick={() => setIsEditingMainTag(true)}
            >
              {t('edit')}
            </button>
          </>
        )}
      </div>
      <div className='card-body'>
        <h5 className='card-title'>{t('subtags')}</h5>
        {tag.subTags && tag.subTags.length > 0 ? (
          tag.subTags.map((subTag) => (
            <div
              key={subTag._id}
              className='d-flex justify-content-between align-items-center mb-2'
            >
              {editingSubTagId === subTag._id ? (
                <div className='d-flex align-items-center'>
                  <input
                    type='text'
                    value={editedSubTagName}
                    onChange={handleSubTagEditChange}
                    className='form-control me-2'
                  />
                  <button
                    className='btn btn-outline-success btn-sm'
                    onClick={handleEditSubTagSubmit}
                  >
                    {t('save')}
                  </button>
                  <button
                    className='btn btn-outline-secondary btn-sm ms-2'
                    onClick={handleCancelEdit}
                  >
                    {t('cancel')}
                  </button>
                </div>
              ) : (
                <>
                  <span>{subTag.name}</span>
                  <div>
                    <button
                      className='btn btn-outline-primary btn-sm me-2'
                      onClick={() => {
                        setEditingSubTagId(subTag._id)
                        setEditedSubTagName(subTag.name)
                      }}
                    >
                      {t('edit')}
                    </button>
                    <button
                      className='btn btn-outline-danger btn-sm'
                      onClick={() => onDeleteSubTag(subTag._id)}
                    >
                      {t('delete')}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>{t('no_subtags')}</p>
        )}
      </div>
    </div>
  )
}

export default TagItem
