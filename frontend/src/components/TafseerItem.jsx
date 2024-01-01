import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'

function TafseerItem({ details, trim = true, link = true }) {
  const { t } = useTranslation('tafseer')
  const { _id, name, about, noOfAyahs } = details

  // State to manage the display of the full text
  const [showFullText, setShowFullText] = useState(false)

  // Determine if the 'about' text is longer than 150 characters
  const isLongText = trim && about.length > 150

  // Function to render the about text with line breaks
  const renderAboutText = () => {
    // Check if 'about' is defined
    if (!about) {
      return <span>{t('no_about_info')}</span>
    }

    const textToShow = showFullText || !trim ? about : about.substring(0, 150)
    return textToShow.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ))
  }

  const toggleShowFullText = () => {
    setShowFullText(!showFullText)
  }

  return (
    <div className='card'>
      <div className='card-header'>
        {link ? (
          <Link className='link' to={`${_id}`}>
            {name}
          </Link>
        ) : (
          <span>{name}</span>
        )}
      </div>
      <div className='card-body'>
        <blockquote className='blockquote mb-0'>
          <p>
            {renderAboutText()}
            {isLongText && (
              <button onClick={toggleShowFullText} className='btn btn-link'>
                {showFullText ? t('show_less') : t('show_more')}
              </button>
            )}
          </p>
          <footer className='blockquote-footer'>
            {t('number_of_ayahs', { noOfAyahs })}
          </footer>
        </blockquote>
      </div>
    </div>
  )
}

export default TafseerItem
