import { useState } from 'react'
import { FaAngleDown, FaEdit, FaTimes } from 'react-icons/fa'
import { updateTafseer, deleteTafseer } from '../features/tafseer/tafseerSlice'
import { updateAyahsMulti } from '../features/ayah/ayahSlice'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from './Spinner'

function ManageTafseerAyah({ ayahTafseer }) {
  const [visible, setVisible] = useState(false)
  const [itemEdit, setItemEdit] = useState(false)
  const [tafseerEditText, setTafseerEditText] = useState(ayahTafseer.text)

  const dispatch = useDispatch()

  const { isLoading } = useSelector((state) => state.ayah)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const toggleEdit = () => {
    setItemEdit(!itemEdit)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete?')) {
      dispatch(deleteTafseer(ayahTafseer._id))
      const updatedAyahs = ayahTafseer.ayahs.map(({ _id }) => {
        return { _id, isTafseerAssociated: false, surah: ayahTafseer.surah }
      })
      dispatch(updateAyahsMulti(updatedAyahs))
    }
  }

  const handleUpdate = () => {
    const editedTafseer = {
      _id: ayahTafseer._id,
      text: tafseerEditText
    }

    dispatch(updateTafseer(editedTafseer))
  }

  if (isLoading) {
    return <Spinner />
  }
  return (
    <div className={`card ${visible ? 'accordion-active' : ''}`}>
      <div
        className='card-header rightToLeft ayah-span'
        onClick={toggleVisibility}
      >
        {Array.isArray(ayahTafseer.ayahs) ? (
          ayahTafseer.ayahs.map((ayah) => {
            return (
              <span key={ayah._id}>
                {'('}
                {ayah.ayahNo}
                {')'} {ayah.text}{' '}
              </span>
            )
          })
        ) : (
          <span>{ayahTafseer.ayahs.ayahNo}</span>
        )}
        <span className='accordion-icon'>
          <FaAngleDown />
        </span>
      </div>
      <div className='card-body rightToLeft ayah-span'>
        {!itemEdit && ayahTafseer.text}
        <span className='accordion-icon'>
          <FaTimes onClick={handleDelete} color='#2F4050' />
          <FaEdit onClick={toggleEdit} color='#2F4050' />
        </span>
        {itemEdit && (
          <form onSubmit={handleUpdate}>
            <div>
              <input
                type='text'
                className='form-control'
                value={tafseerEditText}
                onChange={(e) => setTafseerEditText(e.target.value)}
              />
              <div className='query-btn'>
                <button type='submit' className='btn btn-primary btn-sm save'>
                  Save
                </button>
                <button
                  onClick={toggleEdit}
                  className='btn btn-secondary btn-sm'
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ManageTafseerAyah
