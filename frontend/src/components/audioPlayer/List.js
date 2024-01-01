import React, { useState, useEffect } from 'react'
import '../css/list.css'
// import { useSelector } from 'react-redux'
import { timer } from './timer'

function List({ audios, isOpen, setIsOpen, musicNumber, setMusicNumber }) {
  //   const { audios } = useSelector((state) => state.audio)
  return (
    <div className={`list ${isOpen ? 'show' : ''}`}>
      <div className='header'>
        <div>
          <i class='material-symbols-outlined'>queue_music</i>
          <span>Music list</span>
        </div>
        <i class='material-symbols-outlined' onClick={() => setIsOpen(false)}>
          close
        </i>
      </div>

      <ul>
        {audios?.map((audio, index) => (
          <li
            key={audio._id}
            onClick={() => setMusicNumber(index)}
            className={`${musicNumber === index ? 'playing' : ''}`}
          >
            <div className='row'>
              <span>{audio.title}</span>
              <p>{audio.artist}</p>
            </div>
            <Duration music={audio} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default List

const Duration = ({ music }) => {
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = new Audio(music.src)
    audio.onloadedmetadata = function () {
      if (audio.readyState > 0) {
        setDuration(audio.duration)
      }
    }
  }, [music])
  return <span className='duration'>{timer(duration)}</span>
}
