// Packages
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'

// Utilities
import { timezoneDiffInHours } from '../../../utils/timezones/helpers'
import { getDisplayFormat } from '../../../utils/store'
import { getPhotoUrl } from '../../../utils/photo'
import { limitString, getTooltip } from './helpers'

// Local
import {
  Wrapper,
  Photo,
  PhotoImage,
  Info,
  Start,
  End,
  Name,
  Time,
  Hour,
  AmPm,
  ExtraTime,
  City,
  OffsetWrapper,
  Separator,
  Empty,
  PhotoWrapper,
  Abbr,
} from './styles'
import MinuteWithFade from './MinuteWithFade'

class FollowingComp extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    photoUrl: PropTypes.string,
    twitterHandle: PropTypes.string,
    photoCloudObject: PropTypes.string,
    timezone: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    name: PropTypes.string,
    city: PropTypes.string,
    fullLocation: PropTypes.string,
    countryFlagIcon: PropTypes.string,
    userCity: PropTypes.string,
    userTimezone: PropTypes.string,
    isUserItSelf: PropTypes.bool,
    isDragging: PropTypes.bool,
    noBorder: PropTypes.bool,
    sortMode: PropTypes.bool,
  }

  nameLimit = 13
  cityLimit = 20

  constructor(props) {
    super(props)
    this.state = {
      safeName: limitString(props.name || props.firstName, this.nameLimit),
    }
  }

  render() {
    const {
      index,
      timezone,
      city,
      fullLocation = city,
      firstName,
      lastName,
      name,
      userCity,
      userTimezone,
      isUserItSelf,
      noBorder,
      isDragging,
      sortMode,
      onContextMenu,
      ...props
    } = this.props
    const { safeName } = this.state
    const [photoType, derivedPhotoUrl] = this.getPhotoUrl()
    const fullName = name ? name : `${firstName} ${lastName || ''}`
    const displayFormat = getDisplayFormat()
    const momentFormat =
      displayFormat === '12h' ? 'zz,Z,ddd,hh,mm,A' : 'zz,Z,ddd,HH,mm'

    const [abbr = '', paddedUtcOffset = '', day, hour, minute, amPm] = timezone
      ? moment()
          .tz(timezone)
          .format(momentFormat)
          .split(',')
      : []

    // UTC pad removed
    const utcOffset = paddedUtcOffset.replace(/^-0/, '-').replace(/^\+0/, '+')

    // Abbr
    const hasAbbr = !abbr.includes('-') && !abbr.includes('+')

    // Offset
    const offset = timezoneDiffInHours(userTimezone, timezone)

    // City
    const limitedCity = city ? limitString(city, this.cityLimit) : null

    // Tooltip
    const title = getTooltip({
      fullName,
      fullLocation,
      offset,
      userCity,
      utcOffset,
    })

    if (isUserItSelf && !timezone) {
      return <Empty {...props} />
    }

    return (
      <Wrapper
        title={title}
        onMouseEnter={this.mouseEntered}
        onMouseLeave={this.mouseLeft}
        onContextMenu={onContextMenu}
        floatingBoxStyle={isDragging}
        sortMode={sortMode}
        {...props}
      >
        <PhotoWrapper>
          <Photo flagOverlay={photoType === 'flag'}>
            {derivedPhotoUrl && <PhotoImage src={derivedPhotoUrl} />}
          </Photo>
        </PhotoWrapper>
        <Info noBorder={isDragging || noBorder}>
          <Start>
            <Time>
              <Hour>{hour}</Hour>
              :
              <MinuteWithFade index={index}>{minute}</MinuteWithFade>
              {amPm && <AmPm>{amPm}</AmPm>}
            </Time>
            <ExtraTime>
              {day}{' '}
              <OffsetWrapper>
                <Separator /> ({offset === '+0' ? 'same time' : `${offset} hrs`})
              </OffsetWrapper>
            </ExtraTime>
          </Start>

          <End>
            <Name>{safeName}</Name>

            {limitedCity ? (
              <City>{limitString(city, this.cityLimit)}</City>
            ) : hasAbbr ? (
              <Abbr>{abbr}</Abbr>
            ) : utcOffset ? (
              <Abbr noLetterSpacing>{utcOffset} UTC</Abbr>
            ) : null}
          </End>
        </Info>
      </Wrapper>
    )
  }

  componentWillReceiveProps(newProps) {
    if (this.props.name && this.props.name !== newProps.name) {
      this.setState({
        safeName: limitString(newProps.name, this.nameLimit),
      })
    } else if (this.props.firstName !== newProps.firstName) {
      this.setState({
        safeName: limitString(newProps.firstName, this.nameLimit),
      })
    }
  }

  getPhotoUrl = () => {
    const {
      photoUrl,
      photoCloudObject,
      twitterHandle,
      countryFlagIcon,
    } = this.props

    const [type, derivedPhotoUrl] = getPhotoUrl(
      {
        photoUrl,
        photoCloudObject,
        twitterHandle,
        countryFlagIcon,
      },
      true
    )

    return [type, derivedPhotoUrl]
  }
}

export default FollowingComp
