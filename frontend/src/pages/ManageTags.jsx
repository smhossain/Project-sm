import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTagsWithSubTags, deleteTag } from '../features/tag/tagSlice'
import { FaPlus } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import Modal from 'react-modal'
import AddTagForm from '../components/AddTagForm'
import TagItem from '../components/TagItem'
import i18next from 'i18next'
import Spinner from '../components/Spinner'

const ManageTags = () => {
  // Custom styles for modal
  const customStyles = {
    content: {
      width: '600px',
      top: '50%',
      left: i18next.resolvedLanguage === 'ar' ? 'initial' : '50%',
      right: i18next.resolvedLanguage === 'ar' ? '50%' : 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      position: 'relative'
    }
  }

  useEffect(() => {
    Modal.setAppElement('#root')
  }, [])

  const { t } = useTranslation('latest-queries')
  const dispatch = useDispatch()
  const { tags, isLoading, isError, message } = useSelector(
    (state) => state.tag
  )
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18next.resolvedLanguage
  )
  const [modalIsOpen, setModalIsOpen] = useState(false)

  useEffect(() => {
    dispatch(getAllTagsWithSubTags(selectedLanguage))
  }, [selectedLanguage])

  const onDeleteMainTag = (tagId) => {
    if (window.confirm(t('delete_main'))) {
      dispatch(deleteTag(tagId))
    }
  }

  const onDeleteSubTag = (tagId) => {
    if (window.confirm(t('delete_sub'))) {
      dispatch(deleteTag(tagId))
    }
  }

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  return (
    <div className='container-fluid'>
      <h1>{t('manage_tags')}</h1>
      <div className='alert alert-info mt-5'>{t('here_you_can')}</div>
      <div className='mb-3'>
        <label>{t('choose_language')}</label>
        <select
          className='form-select'
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value='en'>English</option>
          <option value='ar'>العربية</option>
        </select>
      </div>

      {isLoading && <Spinner />}

      {/* {isError && <div className='alert alert-danger'>{message}</div>} */}

      <div>
        <h3>{t('add_tag')}</h3>
        <button onClick={openModal} className='btn btn-primary mb-2 query-btn'>
          <FaPlus />
          {t('create_tag')}
        </button>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel='Add Tags'
        >
          <AddTagForm lang={selectedLanguage} closeModal={closeModal} />
        </Modal>
      </div>

      <div className='tags-container'>
        {(tags.data || []).map((tag) => (
          <TagItem
            key={tag._id}
            tag={tag}
            onDeleteMainTag={onDeleteMainTag}
            onDeleteSubTag={onDeleteSubTag}
            selectedLanguage={selectedLanguage}
          />
        ))}
      </div>
    </div>
  )
}

export default ManageTags
