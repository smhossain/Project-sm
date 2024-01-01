import { useEffect, useState } from 'react'
import { answerQuery, deleteQuery } from '../features/query/querySlice'
import {
  getAllMainTags,
  getSubTagsForTag,
  findById
} from '../features/tag/tagSlice'
import { getUserById } from '../features/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Multiselect from 'multiselect-react-dropdown'
import Spinner from './Spinner'
import { Collapse } from 'react-bootstrap'

function QueryItem({ query, editable }) {
  const [itemEdit, setItemEdit] = useState(false) // State to toggle item edit
  const [answer, setAnswer] = useState(query.answer || '') // State for query answer
  const [mainTag, setMainTag] = useState(query.mainTag) // State for main tag
  const [tags, setTags] = useState([]) // State for tags
  const [showModal, setShowModal] = useState(false) // State to toggle modal
  const [loading, setLoading] = useState(false) // State for loading
  const [error, setError] = useState(null) // State for error
  const [showEditHistory, setShowEditHistory] = useState(false) // State to toggle edit history

  const { t, i18n } = useTranslation('latest-queries') // Translation hook
  const dispatch = useDispatch() // Redux dispatch

  useEffect(() => {
    dispatch(getAllMainTags(query.language)).then(() => {
      dispatch(findById(query.mainTag))
    })
  }, [query.language, query.mainTag, dispatch]) // Fetch main tags and find by ID

  // Fetch user details when component mounts or query.answeredBy changes
  useEffect(() => {
    if (query.answeredBy) {
      dispatch(getUserById(query.answeredBy))
    }
  }, [query.answeredBy, dispatch]) // Fetch user details

  const { user, users } = useSelector((state) => state.auth) // Select user and users from Redux store

  const { tagsAr, tagsEn, tagsById, subTagsByMainTagId, isLoading } =
    useSelector((state) => state.tag) // Select tags and subtags from Redux store

  useEffect(() => {
    if (query.mainTag) {
      dispatch(getSubTagsForTag(query.mainTag))
    }
  }, [query.mainTag, dispatch]) // Fetch subtags for main tag

  const toggleEdit = () => {
    setItemEdit((prevState) => !prevState)
  }

  const handleMainTagChange = (e) => {
    setMainTag(e.target.value)
    dispatch(getSubTagsForTag(e.target.value))
  }

  const handleAddAnswer = (e) => {
    e.preventDefault()

    const queryAnswer = {
      _id: query._id,
      answer: answer,
      isPublishable: true,
      mainTag: mainTag,
      tags: tags,
      answeredBy: user._id,
      answerDate: new Date() // Adding the current date and time
    }
    setLoading(true)
    dispatch(answerQuery(queryAnswer))
      .then(() => {
        setLoading(false)
        setShowModal(false)
        setError({ type: 'success', message: t('query_edited') })
      })
      .catch((error) => {
        setError({ type: 'danger', message: error.message })
        setShowModal(false)
      })
    toggleEdit()
  }

  const handleError = (type, message) => {
    const errorDuration = 5000 // 5 seconds

    setError({ type, message })

    // Set a timer to clear the error after `errorDuration`
    setTimeout(() => {
      setError(null)
    }, errorDuration)

    // Clear the timer when the component is unmounted or if error changes
  }

  useEffect(() => {
    let timer
    // END: be15d9bcejpp
    if (error) {
      timer = setTimeout(() => {
        setError(null)
      }, 5000)
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [error]) // Dependency on error to ensure it runs whenever error changes

  const handleDeleteConfirm = () => {
    setShowModal(true)
  }

  const handleDeleteFinal = () => {
    setLoading(true)
    dispatch(deleteQuery(query._id))
      .then(() => {
        setLoading(false)
        setShowModal(false)
        handleError('success', t('query_deleted'))
      })
      .catch((error) => {
        handleError('danger', error.message)
        setShowModal(false)
        setLoading(false)
      })
  }

  const count = query.editHistory?.length

  const renderTags = () => {
    if (isLoading) return <option>{t('loading')}</option>
    const tagsList = query.language === 'ar' ? tagsAr : tagsEn
    return tagsList.map((tag) => (
      <option key={tag._id} value={tag._id}>
        {tag.name}
      </option>
    ))
  }

  // Unique ID for the collapse element
  const collapseId = `editHistoryCollapse-${query._id}`

  const renderEditHistory = () => {
    return query.editHistory?.map((edit, index) => (
      <div key={index}>
        <p>
          <strong>{t('edited_by')}:</strong> {users[edit.editedBy]?.name}
        </p>
        <p>
          <strong>{t('date')}:</strong>{' '}
          {new Date(edit.editDate).toLocaleString()}
        </p>
        <p>
          <strong>{t('previous_answer')}:</strong> {edit.previousAnswer}
        </p>
      </div>
    ))
  }

  const CardHeader = () => {
    const mainTagId = query.mainTag
    const mainTagName = tagsById[mainTagId]?.data?.name
    const associatedSubTags = subTagsByMainTagId[mainTagId] || []
    const relatedSubTags = associatedSubTags.filter((subtag) =>
      query.tags.includes(subtag._id)
    )

    return (
      <div className='card-header d-flex align-items-center justify-content-between flex-wrap'>
        {' '}
        {/* Added flex-wrap */}
        <div className='flex-grow-1'>
          {' '}
          {/* Ensure it takes the maximum space available */}
          <p className='mb-0'>
            {mainTagName}
            {editable && associatedSubTags.length > 0 && (
              <span className='ms-2'>
                ({relatedSubTags.map((subtag) => subtag.name).join(', ')})
              </span>
            )}
          </p>
        </div>
        {editable && (
          <div className='btn-group mt-1'>
            {' '}
            {/* Wrap buttons in btn-group */}
            <button
              type='button'
              onClick={handleDeleteConfirm}
              className='btn btn-sm btn-outline-danger'
              aria-label='Delete Query'
            >
              {t('delete')}
            </button>
            <button
              type='button'
              onClick={toggleEdit}
              className='btn btn-sm btn-outline-primary ms-2'
              aria-label='Edit Query'
            >
              {t('edit')}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='card mt-4'>
      <CardHeader />
      {loading && <Spinner />}
      {showModal && (
        <div
          role='dialog'
          aria-labelledby='modalTitle'
          aria-describedby='modalDescription'
          className='ms-3 mt-1'
        >
          <h2 id='modalTitle'>{t('confirm_deletion')}</h2>
          <p id='modalDescription'>{t('delete_query')}</p>
          <button
            onClick={handleDeleteFinal}
            type='button'
            aria-label='Delete Confirmation'
            className='btn btn-sm btn-danger'
          >
            {t('yes_delete')}
          </button>
          <button
            onClick={() => setShowModal(false)}
            type='button'
            className='btn btn-sm btn-secondary ms-2'
            aria-label='Cancel Delete'
          >
            {t('cancel')}
          </button>
        </div>
      )}
      {error && (
        <div className={`alert alert-${error.type} mt-3`} role='alert'>
          {error.message}
        </div>
      )}
      {itemEdit && editable ? (
        <form onSubmit={handleAddAnswer}>
          <div className='card-body'>
            <p>
              <strong>{t('question')}:</strong> {query.question}
            </p>
            <div className='form-group'>
              <label htmlFor='answer'>
                <strong>{t('answer')}:</strong>
              </label>
              <textarea
                className='form-control'
                id='answer'
                name='answer'
                rows='3'
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='mainTag'>{t('main_tag')}</label>
              <select
                className='form-control'
                id='mainTag'
                name='mainTag'
                value={mainTag}
                onChange={handleMainTagChange}
              >
                {renderTags()}
              </select>
            </div>
            <div className='form-group'>
              <label>{t('sub_tags')}</label>
              <Multiselect
                placeholder={t('choose_tags')}
                options={subTagsByMainTagId[mainTag] || []}
                showCheckbox='true'
                selectedValues={tags}
                onSelect={(selectedList) => {
                  setTags(selectedList)
                }}
                onRemove={(selectedList) => {
                  setTags(selectedList)
                }}
                displayValue='name'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='answeredBy'>{t('answered_by')}</label>
              <input
                className='form-control'
                id='answeredBy'
                name='answeredBy'
                value={users[query.answeredBy]?.name || ''}
                disabled
              ></input>
            </div>
            <button
              type='submit'
              className='btn btn-primary btn-sm save query-btn'
            >
              {t('save')}
            </button>
            <button
              type='button'
              onClick={toggleEdit}
              className='btn btn-secondary btn-sm query-btn ms-2'
            >
              {t('cancel')}
            </button>
          </div>
          <div className='card-footer text-muted '>
            {t('query_date')}:{' '}
            {new Date(query.createdAt).toLocaleString(i18n.language)}
          </div>
        </form>
      ) : (
        <>
          <div className='card-body'>
            <p>
              <strong>{t('question')}:</strong> {query.question}
            </p>
            <footer>
              <p>
                <strong>{t('answer')}:</strong> {query.answer}
              </p>

              {editable && (
                <>
                  <p>
                    <strong>{t('answered_by')}:</strong>{' '}
                    {users[query.answeredBy]?.name || ''}
                  </p>
                  <p>
                    <strong>{t('answer_date')}:</strong>{' '}
                    {new Date(query.answerDate).toLocaleString(i18n.language)}
                  </p>
                  {query.editHistory?.length > 0 && ( // Only show edit history if there is any
                    <>
                      <strong>{t('edit_history', { count })} </strong>
                      <button
                        className='btn btn-link p-0 mb-2'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target={`#${collapseId}`}
                        aria-expanded='false'
                        aria-controls={collapseId}
                        onClick={() => setShowEditHistory(!showEditHistory)}
                      >
                        {!showEditHistory ? (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            fill='currentColor'
                            className='bi bi-plus-square'
                            viewBox='0 0 16 16'
                          >
                            <path d='M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z' />
                            <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4' />
                          </svg>
                        ) : (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            fill='currentColor'
                            className='bi bi-dash-square'
                            viewBox='0 0 16 16'
                          >
                            <path d='M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z' />
                            <path d='M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8' />
                          </svg>
                        )}
                      </button>
                      <Collapse in={showEditHistory}>
                        <div id={collapseId}>
                          {renderEditHistory(query, users)}
                        </div>
                      </Collapse>
                      <br />
                    </>
                  )}
                </>
              )}
            </footer>
          </div>
          <div className='card-footer text-muted'>
            {t('query_date')}:{' '}
            {new Date(query.createdAt).toLocaleString(i18n.language)}
          </div>
        </>
      )}
    </div>
  )
}

export default QueryItem
