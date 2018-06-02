export const limitString = (str, maxChars) => {
  let limited

  if (!str) {
    return ''
  }

  if (str.length > maxChars) {
    limited = `${str.substr(0, maxChars)}…`
  } else {
    limited = str
  }

  return limited
}

export const getTooltip = ({
  fullName,
  fullLocation,
  offset,
  userCity,
  utcOffset,
}) =>
  `${fullName}${
    fullLocation ? `\n${fullLocation}` : ''
  }\n(${offset} from ${userCity || `here`})\n(${utcOffset} UTC)`
