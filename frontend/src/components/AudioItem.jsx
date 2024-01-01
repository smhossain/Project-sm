import React from 'react'
import formatDuration from '../utils/formatDuration'
import { useTranslation } from 'react-i18next'

function AudioItem({ audio, onEdit, onDelete }) {
  const { t } = useTranslation('tafseer')
  const formattedDuration = formatDuration(audio.duration)

  return (
    <div className='card mb-2 my-2'>
      <div className='row g-0 align-items-start'>
        {' '}
        <div className='col-md-11'>
          <div className='card-body'>
            <h5 className='card-title'>
              {t('part')} {audio.partNumber}
            </h5>
            <p className='card-text'>
              <strong>{t('url')}:</strong>{' '}
              <a href={audio.url} target='_blank' rel='noopener noreferrer'>
                {audio.url}
              </a>
            </p>
            <p className='card-text'>
              <strong>{t('duration')}:</strong> {formattedDuration}
            </p>
            <p className='card-text'>
              <strong>{t('tafseers')}:</strong> {audio.tafseers.length}
            </p>
          </div>
        </div>
        <div className='col-md-1 flex-column align-self-center'>
          <button
            className='btn btn-small btn-primary mb-2'
            onClick={() => onEdit(audio)}
          >
            {t('edit')}
          </button>
          <button
            className='btn btn-small btn-danger'
            onClick={() => onDelete(audio._id)}
          >
            {t('delete')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AudioItem
