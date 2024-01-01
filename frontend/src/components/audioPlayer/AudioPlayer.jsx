import React, { useState } from 'react'
import Card from './Card'
import '../css/mediaPlayer.css'
import List from './List'

function AudioPlayer({ audios, handlePlayerShow }) {
  const [musicNumber, setMusicNumber] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='audio-container'>
      <main>
        <Card
          audios={audios}
          musicNumber={musicNumber}
          setMusicNumber={setMusicNumber}
          setIsOpen={setIsOpen}
          handlePlayerShow={handlePlayerShow}
        />
        <List
          audios={audios}
          musicNumber={musicNumber}
          setMusicNumber={setMusicNumber}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </main>
    </div>
  )
}

export default AudioPlayer
