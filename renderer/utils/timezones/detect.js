import jstz from 'jstimezonedetect'
import moment from 'moment-timezone'

export const detectTimezone = () => {
  let guess
  let DateTimeFormat
  if (typeof window !== 'undefined') {
    DateTimeFormat = window.Intl.DateTimeFormat
    window.Intl.DateTimeFormat = undefined
  }

  guess = moment.tz.guess(true)

  if (!guess || guess === '') {
    guess = jstz.determine().name()
  }

  if (typeof window !== 'undefined') {
    window.Intl.DateTimeFormat = DateTimeFormat
  }

  return guess
}
