import { FaTimes, FaEdit } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { deleteAyah, updateAyah } from '../features/ayah/ayahSlice'
import { useEffect, useState } from 'react'

// Ayah component used in ManageSurah page to render the Ayahs of a surah
function AyahItem({ ayah }) {
  const [itemEdit, setItemEdit] = useState(false)
  const [ayahText, setAyahText] = useState('')
  const [ayahNumber, setAyahNumber] = useState(0)

  const dispatch = useDispatch()

  useEffect(() => {
    setAyahText(ayah.text)
    setAyahNumber(ayah.ayahNo)
  }, [ayah.text, ayah.ayahNo])

  const handleDelete = () => {
    dispatch(deleteAyah({ surahId: ayah.surah, ayahId: ayah._id }))
  }

  const toggleEdit = () => {
    setItemEdit(!itemEdit)
    if (itemEdit) {
      setAyahText(ayah.text)
      setAyahNumber(ayah.ayahNo)
    }
  }

  const handleUpdateAyah = (e) => {
    e.preventDefault()

    const updatedAyah = {
      _id: ayah._id,
      text: ayahText,
      surah: ayah.surah,
      ayahNo: ayahNumber
    }
    dispatch(updateAyah(updatedAyah))
  }

  return (
    <div>
      <div className='container-fluid rightToLeft'>
        <div className='col-md-auto'>
          <FaTimes onClick={handleDelete} color='#2F4050' />
          <FaEdit onClick={toggleEdit} color='#2F4050' />
        </div>
        {itemEdit ? (
          <>
            <form onSubmit={handleUpdateAyah}>
              <div className='col-md-auto form-row'>
                <div className='form-group col-md-1'>
                  <input
                    type='number'
                    className='form-control'
                    value={ayahNumber}
                    onChange={(e) => setAyahNumber(e.target.value)}
                  />
                </div>
                <div className='form-group col-md-10'>
                  <textarea
                    id='text'
                    className='form-control'
                    rows='3'
                    value={ayahText}
                    onChange={(e) => setAyahText(e.target.value)}
                  />
                </div>
              </div>
              <button
                style={{ marginLeft: '8px' }}
                type='submit'
                onClick={handleUpdateAyah}
                className='btn btn-primary btn-sm save'
              >
                Save
              </button>
              <button onClick={toggleEdit} className='btn btn-secondary btn-sm'>
                Cancel
              </button>
            </form>
          </>
        ) : (
          <>
            <div className='col-md-auto quran-font'>
              {' '}
              {'('}
              {ayah.ayahNo}
              {')'} {ayah.text}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AyahItem
