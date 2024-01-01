import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { create } from '../features/tag/tagSlice'
import { useTranslation } from 'react-i18next'

const AddTagForm = ({ lang, tags, closeModal }) => {
  const dispatch = useDispatch()

  const [newTagName, setNewTagName] = useState('')
  const [selectedMainTag, setSelectedMainTag] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState(lang)

  const { t } = useTranslation('latest-queries')

  const handleTagCreation = () => {
    const tagData = {
      name: newTagName,
      language: selectedLanguage,
      parentId: selectedMainTag === 'none' ? null : selectedMainTag
    }
    dispatch(create(tagData))
    closeModal()
  }

  return (
    <div className='container mt-5'>
      <h3>{t('add_tag')}</h3>
      <div className='mb-3'>
        <label htmlFor='languageSelect'>{t('language')}</label>
        <input
          type='text'
          className='form-control'
          id='languageSelect'
          value={lang === 'ar' ? 'العربية' : 'English'}
          disabled
        ></input>
      </div>
      <div className='mb-3'>
        <label htmlFor='mainTagSelect'>{t('main_tag')}</label>
        <select
          className='form-select'
          id='mainTagSelect'
          value={selectedMainTag}
          onChange={(e) => setSelectedMainTag(e.target.value)}
        >
          <option value='none'>{t('none')}</option>
          {(tags.data || []).map((tag) => (
            <option key={tag._id} value={tag._id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>
      <div className='mb-3'>
        <label htmlFor='newTagName'>{t('tag_name')}</label>
        <input
          type='text'
          className='form-control'
          id='newTagName'
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
        />
      </div>
      <button className='btn btn-primary ms-2' onClick={handleTagCreation}>
        {t('create_tag')}
      </button>
      <button
        type='button'
        className='btn btn-outline-secondary ms-2'
        onClick={() => closeModal()}
      >
        {t('cancel')}
      </button>
    </div>
  )
}

export default AddTagForm
