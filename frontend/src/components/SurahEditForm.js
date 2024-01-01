// SurahEditForm.jsx
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateSurah } from '../features/surah/surahSlice'
import { useTranslation } from 'react-i18next'
import Multiselect from 'multiselect-react-dropdown'

function SurahEditForm({ surah, onSave, onCancel }) {
  // initialize the state with Surah's data
  const [surahName, setSurahName] = useState(surah.name)
  const [section, setSection] = useState(surah.section)
  const [noOfAyahs, setNoOfAyahs] = useState(surah.noOfAyahs)
  const [number, setNumber] = useState(surah.number)
  const [about, setAbout] = useState(surah.about)
  const [editedSection, setEditedSection] = useState(surah.section)

  const dispatch = useDispatch()

  const { t } = useTranslation('surah')

  useEffect(() => {
    setSurahName(surah.name)
    setSection(surah.section)
    setNoOfAyahs(surah.noOfAyahs)
    setNumber(surah.number)
    setAbout(surah.about)
  }, [surah])

  const handleUpdate = (e) => {
    e.preventDefault()

    const updatedSurah = {
      _id: surah._id,
      name: surahName,
      noOfAyahs: noOfAyahs,
      number: number,
      about: about,
      section: editedSection
    }

    dispatch(updateSurah(updatedSurah))
    onSave()
  }

  const sectionsInput = Array.from({ length: 30 }, (_, i) => i + 1)

  return (
    <form onSubmit={handleUpdate}>
      <div className='card-header'>
        <Multiselect
          placeholder={t('choose_sections')}
          showCheckbox={true}
          isObject={false}
          options={sectionsInput}
          selectedValues={section}
          onRemove={(e) => setEditedSection(e)}
          onSelect={(e) => setEditedSection(e)}
        />
      </div>
      <div className='card-body'>
        <label for='surahName' class='form-label'>
          {t('surah_name')}
        </label>
        <input
          type='text'
          id='surahName'
          value={surahName}
          onChange={(e) => setSurahName(e.target.value)}
          className='form-control'
        />
        <label for='ayahs' class='form-label'>
          {t('no_of_ayahs')}
        </label>
        <input
          type='number'
          id='ayahs'
          value={noOfAyahs}
          onChange={(e) => setNoOfAyahs(e.target.value)}
          className='form-control'
        />
        <label for='number' class='form-label'>
          {t('surah_sequence')}
        </label>
        <input
          type='number'
          id='number'
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className='form-control'
        />
        <label htmlFor='about'>{t('about_surah')}</label>
        <textarea
          name='text'
          id='about'
          className='form-textarea'
          placeholder={t('about_surah')}
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        ></textarea>
        <button type='submit' className='btn btn-sm btn-primary mt-2'>
          {t('save')}
        </button>
        <button
          type='button'
          onClick={onCancel}
          className='btn btn-sm btn-secondary ms-2 mt-2'
        >
          {t('cancel')}
        </button>
      </div>
    </form>
  )
}

export default SurahEditForm
