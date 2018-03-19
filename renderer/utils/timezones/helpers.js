import moment from 'moment-timezone'

/**
 *
 * @param {string} firstMomentTz
 * @param {string} secondMomentTz
 * @returns {string}
 */
export const timezoneDiffInHours = (firstTimezone, secondTimezone) => {
  if (firstTimezone === secondTimezone) {
    // If they are the same, just return 0
    // and avoid unnecessary computation
    return '+0:00'
  }

  const first = moment.tz(firstTimezone).utc('HH:mm')
  const second = moment.tz(secondTimezone).utc('HH:mm')

  let mark
  let duration
  if (second.isBefore(first)) {
    mark = '-'
    duration = moment.duration(first.diff(second))
  } else {
    mark = '+'
    duration = moment.duration(second.diff(first))
  }

  const offsetStr = moment.utc(+duration).format('HH:mm')

  // I have no idea why this happens
  // todo: cover :59 case!
  const normlizedStr = offsetStr
    .replace(':01', ':00')
    .replace(':29', ':30')
    .replace(':31', ':30')

  return mark + normlizedStr
}
