import Accordion from 'react-bootstrap/Accordion'
import Modal from 'react-bootstrap/Modal'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { deleteTafseer, updateTafseer } from '../features/tafseer/tafseerSlice'
import React, { useState } from 'react'
import { updateAyahsMulti } from '../features/ayah/ayahSlice'
import { toast } from 'react-toastify'
import TafseerText from './TafseerText'

function TafseerAyah({
  ayahTafseer,
  eventKey,
  defaultActiveKey,
  editable,
  isIntroduction = false
}) {
  const { t } = useTranslation('tafseer')
  const [showModal, setShowModal] = useState(false)
  const [editedText, setEditedText] = useState(ayahTafseer.text)
  const [editedNumber, setEditedNumber] = useState(ayahTafseer.number)

  const dispatch = useDispatch()
  const { availableNumber } = useSelector((state) => state.tafseer)

  const handleDelete = () => {
    const ayahsOfTafseer = ayahTafseer.ayahs
    const modifyAyahs = ayahsOfTafseer.map(({ _id }) => {
      return { _id, isTafseerAssociated: false, surah: ayahTafseer.surah }
    })
    const properDelete = async () => {
      try {
        await dispatch(deleteTafseer(ayahTafseer._id)).unwrap()
        await dispatch(updateAyahsMulti(modifyAyahs)).unwrap()
      } catch (error) {
        toast.error(error.message ? error.message : 'An error occurred')
      }
    }

    properDelete()
    toast.success(t('tafseer_deleted'))
  }

  const handleEditClick = (e) => {
    e.preventDefault()
    setShowModal(true)
  }

  const handleCancel = () => {
    setShowModal(false)
  }

  const handleSave = () => {
    dispatch(
      updateTafseer({
        _id: ayahTafseer._id,
        text: editedText,
        number: editedNumber
      })
    )
    setShowModal(false)
  }

  return (
    <div className='row'>
      <div className='col'>
        <Accordion defaultActiveKey={defaultActiveKey}>
          <Accordion.Item eventKey={eventKey} className='accordion-item'>
            <Accordion.Header className='rightToLeft'>
              <div className='d-flex justify-content-between align-items-center w-100'>
                <div className='container flex-grow-1'>
                  {isIntroduction ? (
                    t('intro')
                  ) : ayahTafseer &&
                    Array.isArray(ayahTafseer.ayahs) &&
                    ayahTafseer.ayahs.length > 0 ? (
                    ayahTafseer.ayahs.map((ayah, index) => (
                      <span key={ayah.ayahNo}>
                        <strong>
                          {'('}
                          {ayah.ayahNo}
                          {') '}
                        </strong>
                        {ayah.text}{' '}
                      </span>
                    ))
                  ) : (
                    <p className='display-4'>{t('no_tafseer')}</p>
                  )}
                </div>
              </div>
            </Accordion.Header>
            <Accordion.Body className='rightToLeft'>
              <TafseerText
                text={ayahTafseer.text}
                references={ayahTafseer.references}
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      {editable && (
        <div className='col-md-auto'>
          <div className='edit-controls d-flex flex-column align-items-end'>
            <button
              type='button'
              className='btn btn-outline-primary btn-sm mb-2'
              onClick={(e) => handleEditClick(e)}
            >
              {t('edit')}
            </button>
            <button
              type='button'
              className='btn btn-outline-danger btn-sm'
              onClick={handleDelete}
            >
              {t('delete')}
            </button>
          </div>
        </div>
      )}

      <Modal show={showModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{t('edit_tafseer')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Display ayahs - not editable */}
          {(ayahTafseer.ayahs || []).map((ayah, index) => (
            <p key={index}>
              <strong>{`(${ayah.ayahNo}) `}</strong>
              {ayah.text}
            </p>
          ))}
          {/* Textarea for editable text */}
          <textarea
            className='form-control'
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          {/* Input for number, editable */}
          <input
            type='number'
            className='form-control my-2'
            value={editedNumber}
            onChange={(e) => setEditedNumber(e.target.value)}
          />
          {/* Show available number */}
          <div className='alert-info my-2'>
            {t('available_number_for_use')}: {availableNumber.lastNumber}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={handleCancel}
          >
            {t('cancel')}
          </button>
          <button
            type='button'
            className='btn btn-primary'
            onClick={handleSave}
          >
            {t('save')}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

TafseerAyah.defaultProps = {
  ayahTafseer: { ayahs: [], text: '', number: '' },
  editable: false
}

export default TafseerAyah
