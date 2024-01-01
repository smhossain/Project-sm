import React from 'react'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

function TafseerText({ text, references }) {
  const renderTooltip = (props, refNumber) => {
    const ref = references.find((ref) => ref.refNumber === parseInt(refNumber))
    return (
      <Tooltip id={`tooltip-${refNumber}`} {...props}>
        {ref ? ref.text : 'Reference not found'}
      </Tooltip>
    )
  }

  const renderTextWithTooltips = () => {
    const referenceRegex = /\[(\d+)\]/g
    return text.split(referenceRegex).map((segment, index) => {
      // Check if the segment is a reference number
      if (index % 2 === 1) {
        return (
          <OverlayTrigger
            key={index}
            placement='top'
            overlay={(props) => renderTooltip(props, segment)}
          >
            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>
              [{segment}]
            </span>
          </OverlayTrigger>
        )
      }
      // Split the segment further at new line characters
      return segment.split('\n').map((line, lineIndex) => (
        <React.Fragment key={`${index}-${lineIndex}`}>
          {line}
          {lineIndex < segment.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))
    })
  }

  return <div>{renderTextWithTooltips()}</div>
}

export default TafseerText
