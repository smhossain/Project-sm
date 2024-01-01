import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getSurah } from '../features/surah/surahSlice'
import { getTafseersWithNoAudioForSurah } from '../features/tafseer/tafseerSlice'
import {
  getAudioMetaDataBySurahId,
  getNextPartNumber,
  createAudioMetaData,
  updateAudioMetaData,
  deleteAudioMetaData
} from '../features/audio/audioSlice'
import { useTranslation } from 'react-i18next'
import SurahItem from '../components/SurahItem'
import AddAudioModal from '../components/AddAudioModal'
import AudioItem from '../components/AudioItem'
import Spinner from '../components/Spinner'

function AddAudio() {
  const { t } = useTranslation('tafseer')
  const params = useParams()
  const dispatch = useDispatch()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [editingAudio, setEditingAudio] = useState(null)

  const { surah, isLoading } = useSelector((state) => state.surah)
  const {
    audios,
    nextNumber,
    isLoading: isLoadingAudio
  } = useSelector((state) => state.audio)
  const { tafseers, isLoading: isLoadingTafseers } = useSelector(
    (state) => state.tafseer
  )

  useEffect(() => {
    dispatch(getSurah(params.surahId))
    dispatch(getTafseersWithNoAudioForSurah(params.surahId))
    dispatch(getAudioMetaDataBySurahId(params.surahId))
    dispatch(getNextPartNumber(params.surahId))
  }, [dispatch, params.surahId])

  const openModal = (audio = null) => {
    if (audio && audio.preventDefault) {
      setEditingAudio(null)
    } else {
      setEditingAudio(audio)
    }
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setEditingAudio(null)
    setModalIsOpen(false)
  }

  const handleSaveAudio = (audioData) => {
    if (editingAudio) {
      dispatch(updateAudioMetaData({ ...audioData, id: editingAudio._id }))
    } else {
      dispatch(createAudioMetaData(audioData))
    }
    closeModal()
  }

  const handleEditAudio = (audio) => {
    openModal(audio)
  }

  const handleDeleteAudio = (audioId) => {
    if (window.confirm(t('confirm_delete'))) {
      dispatch(deleteAudioMetaData(audioId))
    }
  }

  return (
    <div className='container'>
      {isLoading || isLoadingAudio || isLoadingTafseers ? (
        <Spinner />
      ) : (
        <>
          <SurahItem surah={surah} editable={false} type='tafseer' />
          <button
            className='btn btn-small btn-primary mt-2'
            onClick={openModal}
          >
            {t('add_audio')}
          </button>

          <AddAudioModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            surah={surah}
            nextPartNumber={nextNumber.nextPartNumber}
            onSave={handleSaveAudio}
            tafseers={tafseers.results}
            editingAudio={editingAudio}
          />
          {audios.length === 0 ? (
            <div className='alert alert-info my-3'>{t('no_audio')}</div>
          ) : (
            (audios || []).map((audio) => (
              <AudioItem
                key={audio._id}
                audio={audio}
                onEdit={handleEditAudio}
                onDelete={handleDeleteAudio}
              />
            ))
          )}
        </>
      )}
    </div>
  )
}

export default AddAudio
