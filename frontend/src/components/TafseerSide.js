import { useState } from 'react'
import { toast } from 'react-toastify'

function TafseerSide({ text }) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
      toast.success('Text copied to clipboard!') // Show a success message
      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy!') // Show an error message
    }
  }

  const PlayIcon = () => {
    return (
      <div>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          className='bi bi-play'
          viewBox='0 0 16 16'
        >
          <path d='M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z' />
        </svg>
      </div>
    )
  }

  const ClipBoardIcon = () => {
    return (
      <div
        onClick={() => copyToClipboard(text)} // Add onClick event handler
        style={{ cursor: 'pointer' }} // Change cursor to indicate clickable
        className={isCopied ? 'text-success' : ''} // Change color when copied
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          className='bi bi-clipboard'
          viewBox='0 0 16 16'
        >
          <path d='M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z' />
          <path d='M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z' />
        </svg>
      </div>
    )
  }

  return (
    <>
      <div className='row'>
        <PlayIcon />
      </div>
      <div className='row'>
        <ClipBoardIcon />
      </div>
    </>
  )
}

export default TafseerSide
