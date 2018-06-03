import { Fragment } from 'react'
import { number, string, bool } from 'prop-types'
import styled from 'styled-components'
import moment from 'moment-timezone'

// Utilities
import { getPhotoUrl } from '../../../utils/photo'
import { getDisplayFormat } from '../../../utils/store'

// Local
import { Photo, PhotoImage, Time, Hour, AmPm } from './styles'
import { timezoneDiffInHours } from '../../../utils/timezones/helpers'
import { getTooltip, limitString } from './helpers'
import MinuteWithFade from './MinuteWithFade'

const propTypes = {
  index: number.isRequired,
  photoUrl: string,
  twitterHandle: string,
  photoCloudObject: string,
  timezone: string,
  firstName: string,
  lastName: string,
  name: string,
  city: string,
  fullLocation: string,
  countryFlagIcon: string,
  userCity: string,
  userTimezone: string,
  isUserItSelf: bool,
  isDragging: bool,
  noBorder: bool,
  sortMode: bool,
}

const PinnedFollowing = props => {
  const {
    index,
    name,
    firstName,
    lastName,
    photoUrl,
    photoCloudObject,
    twitterHandle,
    countryFlagIcon,
    timezone,
    city,
    fullLocation,
    userCity,
    userTimezone,
    onContextMenu,
  } = props

  const fullName = name || `${firstName} ${lastName || ''}`

  // Get currect photoUrl
  const [photoType, derivedPhotoUrl] = getPhotoUrl(
    {
      photoUrl,
      photoCloudObject,
      twitterHandle,
      countryFlagIcon,
    },
    true
  )

  // Calc time
  const displayFormat = getDisplayFormat()
  const momentFormat =
    displayFormat === '12h' ? 'zz,Z,ddd,h,mm,A' : 'zz,Z,ddd,H,mm'

  const [abbr = '', utcOffset = '', day, hour, minute, amPm] = timezone
    ? moment()
        .tz(timezone)
        .format(momentFormat)
        .split(',')
    : []

  // Offset from here
  const offset = timezoneDiffInHours(userTimezone, timezone)

  // Limited City
  const limitedCity = city ? limitString(city, 7) : ``

  // Timezone clue
  const hasAbbr = !abbr.includes('-') && !abbr.includes('+')
  const timezoneClue = hasAbbr ? abbr : limitedCity

  // Tooltip
  const tooltip = getTooltip({
    fullName,
    fullLocation,
    offset,
    userCity,
    utcOffset,
  })

  return (
    <Wrapper title={tooltip} onContextMenu={onContextMenu}>
      <PhotoWrapper>
        <Photo flagOverlay={photoType === 'flag'}>
          {derivedPhotoUrl && <PhotoImage src={derivedPhotoUrl} />}
        </Photo>
        <Extra>
          <Day>{day}</Day>

          {timezoneClue && (
            <Fragment>
              <Separator />
              <Timezone>{timezoneClue}</Timezone>
            </Fragment>
          )}
        </Extra>
      </PhotoWrapper>

      <Time compact={true}>
        <Hour>{hour}</Hour>
        :
        <MinuteWithFade index={index} compact={true}>
          {minute}
        </MinuteWithFade>
        {amPm && <AmPm compact={true}>{amPm}</AmPm>}
      </Time>
    </Wrapper>
  )
}

PinnedFollowing.propTypes = propTypes
export default PinnedFollowing

// Styles
const Extra = styled.div`
  background: ${p => p.theme.colors.lighter};
  color: ${p => p.theme.colors.lightText};
  border-radius: 3px;
  font-size: 10px;
  line-height: 1;
  vertical-align: middle;
  padding: 1px 3px;

  display: inline-flex;
  align-items: center;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;

  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%) translateY(5px);

  opacity: 0;
  transition: opacity 150ms ease, transform 150ms ease;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding-top: 5px;
  transition: background 160ms ease;

  &:hover {
    background: ${p => p.theme.colors.lighter};
    border-radius: 4px;

    ${Extra} {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`

const PhotoWrapper = styled.div`
  margin-bottom: 3px;
  position: relative;
`

const Day = styled.span``

const Separator = styled.span`
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  margin-top: 1px;
  margin-left: 3px;
  margin-right: 3px;
`

const Timezone = styled.span`
  font-size: 9px;
  font-weight: 600;
`
