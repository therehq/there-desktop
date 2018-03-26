// Packages
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'

// Utilities
import { timezoneDiffInHours } from '../../../utils/timezones/helpers'
import { getDisplayFormat } from '../../../utils/store'

// Styled Components
import {
  Wrapper,
  Photo,
  PhotoImage,
  Flag,
  Info,
  Start,
  End,
  Name,
  Time,
  Hour,
  Minute,
  AmPm,
  ExtraTime,
  City,
  OffsetWrapper,
  Separator,
  fadeIn,
  fadeOut,
} from './styles'

class FollowingComp extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    photoUrl: PropTypes.string,
    timezone: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    name: PropTypes.string,
    city: PropTypes.string,
    fullLocation: PropTypes.string,
    countryFlag: PropTypes.string,
    userCity: PropTypes.string,
    userMomentTimezone: PropTypes.any,
    isDragging: PropTypes.bool,
    noBorder: PropTypes.bool,
    sortMode: PropTypes.bool,
  }

  nameLimit = 13
  cityLimit = 20

  constructor(props) {
    super(props)
    this.state = {
      safeName: this.limitString(props.name || props.firstName, this.nameLimit),
    }
  }

  render() {
    const {
      index,
      photoUrl,
      timezone,
      city,
      fullLocation = city,
      countryFlag,
      firstName,
      lastName,
      name,
      userCity,
      userTimezone,
      noBorder,
      isDragging,
      sortMode,
      onContextMenu,
      ...props
    } = this.props
    const { safeName } = this.state
    const fullName = name ? name : `${firstName} ${lastName || ''}`
    const displayFormat = getDisplayFormat()
    const momentFormat =
      displayFormat === '12h' ? 'Z,ddd,hh,mm,A' : 'Z,ddd,H,mm'

    const [utcOffset, day, hour, minute, amPm] = timezone
      ? moment()
          .tz(timezone)
          .format(momentFormat)
          .split(',')
      : []

    const offset = timezoneDiffInHours(userTimezone, timezone)

    const title = `${fullName}\n${fullLocation}\n(${offset} from ${userCity ||
      `here`})\n(${utcOffset} UTC)`

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
        <Photo>
          {photoUrl ? (
            <PhotoImage src={photoUrl} />
          ) : (
            <Flag children={countryFlag} />
          )}
        </Photo>
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
                <Separator /> ({offset})
              </OffsetWrapper>
            </ExtraTime>
          </Start>

          <End>
            <Name>{safeName}</Name>
            <City>{this.limitString(city, this.cityLimit)}</City>
          </End>
        </Info>
      </Wrapper>
    )
  }

  componentWillReceiveProps(newProps) {
    if (this.props.name && this.props.name !== newProps.name) {
      this.setState({
        safeName: this.limitString(newProps.name, this.nameLimit),
      })
    } else if (this.props.firstName !== newProps.firstName) {
      this.setState({
        safeName: this.limitString(newProps.firstName, this.nameLimit),
      })
    }
  }

  limitString = (str, maxChars) => {
    let limited

    if (str.length > maxChars) {
      limited = `${str.substr(0, maxChars)}…`
    } else {
      limited = str
    }

    return limited
  }
}

export default FollowingComp

class MinuteWithFade extends React.Component {
  static propTypes = { children: PropTypes.string, index: PropTypes.number }
  static defaultProps = { index: 0 }

  constructor(props) {
    super(props)
    this.state = { minute: props.children, animation: null }
    this.delay = props.index * 32
  }

  render() {
    const { minute, animation } = this.state
    return <Minute animation={animation}>{minute}</Minute>
  }

  componentWillReceiveProps(newProps) {
    if (newProps.children !== this.state.minute) {
      // Animate value change on re-render
      setTimeout(() => {
        this.setState({ animation: fadeOut })
      }, this.delay)

      setTimeout(() => {
        this.setState({ animation: fadeIn, minute: newProps.children })
      }, this.delay + 100)

      setTimeout(() => {
        this.setState({ animation: null })
      }, this.delay + 200)
    } else {
      // Set children on initial render
      this.setState({ minute: newProps.children })
    }
  }
}
