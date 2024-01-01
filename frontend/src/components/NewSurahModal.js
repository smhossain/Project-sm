import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const NewSurahModal = ({
  show,
  handleClose,
  onSubmit,
  name,
  setName,
  noOfAyahs,
  setNoOfAyahs,
  number,
  setNumber,
  about,
  setAbout,
  section,
  setSection,
  handleCheckBoxChange,
  sectionsInput
}) => {
  const { t } = useTranslation('surah')

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('add_surah')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label htmlFor='name'>{t('surah_name')}</label>
            <input
              id='name'
              type='text'
              className='form-control'
              value={name}
              placeholder='بقرة'
              autoComplete='on'
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='noOfAyahs'>{t('no_of_ayahs')}</label>
            <input
              id='noOfAyahs'
              type='number'
              className='form-control'
              value={noOfAyahs}
              placeholder='1'
              autoComplete='on'
              onChange={(e) => setNoOfAyahs(e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='number'>{t('surah_sequence')}</label>
            <input
              id='number'
              type='number'
              className='form-control'
              value={number}
              placeholder='1'
              autoComplete='on'
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
          <div>
            <p className='form-label'>{t('select_sections')}</p>
          </div>
          {sectionsInput.map((item) => (
            <div
              key={item}
              className='custom-control custom-checkbox custom-control-inline'
            >
              <input
                type='checkbox'
                value={item}
                checked={section.includes(item)}
                onChange={handleCheckBoxChange}
                className='custom-control-input'
                id={item}
              />
              <label className='custom-control-label' htmlFor={item}>
                {item}
              </label>
            </div>
          ))}
          <div className='form-group'>
            <label htmlFor='about'>{t('about_surah')}</label>
            <textarea
              name='text'
              id='about'
              className='form-textarea'
              placeholder={t('ayah_text')}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            ></textarea>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          {t('close')}
        </Button>
        <Button variant='primary' onClick={onSubmit}>
          {t('add_surah')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default NewSurahModal
