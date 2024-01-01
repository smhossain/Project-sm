import React, { useEffect, useRef, useState } from 'react'
import '../css/card.css'
// import { getAudioMetaDataBySurahId } from '../../features/audio/audioSlice'
// import { useDispatch, useSelector } from 'react-redux'
import { timer } from './timer'

function Card({
  audios,
  musicNumber,
  setMusicNumber,
  setIsOpen,
  handlePlayerShow
}) {
  // const dispatch = useDispatch()
  const [duration, setDuration] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [play, setPlay] = useState(false)
  const [volume, setVolume] = useState(50)
  const [showVolume, setShowVolume] = useState(false)
  const [repeat, setRepeat] = useState('repeat')

  const audioRef = useRef()

  function handleLoadStart(e) {
    const src = e.nativeEvent.srcElement.src
    const audio = new Audio(src)
    audio.onloadedmetadata = function () {
      if (audio.readyState > 0) {
        setDuration(audio.duration)
      }
    }
    if (play) {
      audioRef.current.play()
    }
  }

  function handlePlayingAudio() {
    if (play) {
      audioRef.current.pause()
      setPlay(false)
    } else {
      audioRef.current.play()
      setPlay(true)
    }
  }

  function handleTimeUpdate() {
    const currentTime = audioRef.current.currentTime
    setCurrentTime(currentTime)
  }

  function changeCurrentTime(e) {
    const currentTime = Number(e.target.value)
    audioRef.current.currentTime = currentTime
    setCurrentTime(currentTime)
  }

  function handleNextPrev(n) {
    setMusicNumber((value) => {
      if (n > 0) return value + n > audios.length - 1 ? 0 : value + n

      return value + n < 0 ? audios.length - 1 : value + n
    })
  }

  function handleRepeat() {
    setRepeat((value) => {
      switch (value) {
        case 'repeat':
          return 'repeat_one'
        case 'repeat_one':
          return 'shuffle'

        default:
          return 'repeat'
      }
    })
  }

  function endedAudio() {
    switch (repeat) {
      case 'repeat_one':
        return audioRef.current.play()
      case 'shuffle':
        return handleShuffle()

      default:
        return handleNextPrev(1)
    }
  }

  function handleShuffle() {
    const num = randomNumber()
    setMusicNumber(num)
  }

  function randomNumber() {
    const number = Math.floor(Math.random() * (audios.length - 1))
    if (number === musicNumber) return randomNumber()
    return number
  }

  //   useEffect(() => {
  //     dispatch(getAudioMetaDataBySurahId('654610cd0a64627fd81857d4'))
  //   }, [dispatch])

  useEffect(() => {
    audioRef.current.volume = volume / 100 // 0 - 1
  }, [volume])

  //   const { audios, isLoading } = useSelector((state) => state.audio)

  return (
    <div className='audio-card'>
      <div className='nav'>
        <i className='material-symbols-outlined' onClick={handlePlayerShow}>
          expand_more
        </i>
        <span>
          Now Playing {musicNumber + 1}/{audios?.length}
        </span>
        <i
          className='material-symbols-outlined'
          onClick={() => setIsOpen((prev) => !prev)}
        >
          queue_music
        </i>
      </div>

      <div className='img'>
        <img src={audios[musicNumber]?.thumbnail} alt='' />
      </div>

      <div className='details'>
        <p className='title'>{audios[musicNumber]?.title}</p>
        <p className='title'>{audios[musicNumber]?.artist}</p>
      </div>

      <div className='progress'>
        <input
          type='range'
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => changeCurrentTime(e)}
          style={{
            background: `linear-gradient(to right, #3264fe ${
              (currentTime / duration) * 100
            }%, #e5e5e5 ${(currentTime / duration) * 100}%)`
          }}
        />
      </div>

      <div className='timer'>
        <span>{timer(currentTime)}</span>
        <span>{timer(duration)}</span>
      </div>

      <div className='controls'>
        <i className='material-symbols-outlined' onClick={handleRepeat}>
          {repeat}
        </i>

        <i
          class='material-symbols-outlined'
          id='prev'
          onClick={() => handleNextPrev(-1)}
        >
          skip_previous
        </i>

        <div className='play' onClick={handlePlayingAudio}>
          <i className='material-symbols-outlined'>
            {play ? 'pause' : 'play_arrow'}
          </i>
        </div>

        <i
          className='material-symbols-outlined'
          id='next'
          onClick={() => handleNextPrev(1)}
        >
          skip_next
        </i>

        <i
          className='material-symbols-outlined'
          onClick={() => setShowVolume((prev) => !prev)}
        >
          volume_up
        </i>

        <div className={`volume ${showVolume ? 'show' : ''}`}>
          <i
            className='material-symbols-outlined'
            onClick={() => setVolume((v) => (v > 0 ? 0 : 100))}
          >
            {volume === 0 ? 'volume_off' : 'volume_up'}
          </i>
          <input
            type='range'
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #3264fe ${volume}%, #e5e5e5 ${volume}%)`
            }}
          />
          <span>{volume}</span>
        </div>
      </div>

      <audio
        src={audios[musicNumber]?.url}
        hidden
        ref={audioRef}
        onLoadStart={handleLoadStart}
        onTimeUpdate={handleTimeUpdate}
        onEnded={endedAudio}
      />
    </div>
  )
}

export default Card
