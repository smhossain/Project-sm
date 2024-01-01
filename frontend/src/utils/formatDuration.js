// utils/formatDuration.js

function formatDuration(durationInSeconds) {
  const minutes = Math.floor(durationInSeconds / 60)
  const seconds = durationInSeconds % 60

  // Pad the seconds with a leading zero if it's less than 10
  const paddedSeconds = seconds.toString().padStart(2, '0')

  return `${minutes}:${paddedSeconds}`
}

export default formatDuration
