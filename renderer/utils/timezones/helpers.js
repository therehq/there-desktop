import moment from 'moment-timezone'

/**
 *
 * @param {string} firstMomentTz
 * @param {string} secondMomentTz
 * @returns {string[]} [mark, time]
 */
export const timezoneDiffInHours = (firstTimezone, secondTimezone) => {
  if (firstTimezone === secondTimezone) {
    // If they are the same, just return 0
    // and avoid unnecessary computation
    return '+0'
  }

  const first = moment.tz(firstTimezone).utc('H:mm')
  const second = moment.tz(secondTimezone).utc('H:mm')

  let mark
  let duration
  if (second.isBefore(first)) {
    mark = '-'
    duration = moment.duration(first.diff(second))
  } else {
    mark = '+'
    duration = moment.duration(second.diff(first))
  }

  const offsetStr = moment.utc(+duration).format('H:mm')

  // I have no idea why this happens
  // todo: cover :59 case!
  const normlizedStr = offsetStr
    .replace(/:00|:01/, '')
    .replace(/:29|:30|:31/, '.5')

  return mark + normlizedStr
}

export const getAbbrOrUtc = timezoneName => {
  if (!timezoneName) {
    return null
  }

  const now = Date.now()
  const momentTz = moment.tz(now, timezoneName)

  const abbr = momentTz.zoneAbbr()
  const hasAbbr = abbr && !abbr.includes('+') && !abbr.includes('-')

  if (hasAbbr) {
    return abbr
  }

  const utcOffset = momentTz.format('Z')
  return `${utcOffset} UTC`
}
