// Packages
import electron from 'electron'
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'

// Utilities
import { timezoneDiffInHours } from '../../../utils/timezones/helpers'

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
  ExtraTime,
  City,
  Separator,
  fadeIn,
  fadeOut,
} from './styles'

class FollowingComp extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    photo: PropTypes.string,
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
  }

  constructor(props) {
    super(props)

    this.state = {
      safeName: this.getSafeName(props.name || props.firstName),
      hovered: false,
    }
  }

  render() {
    const {
      index,
      photo,
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
      onContextMenu,
      ...props
    } = this.props
    const { safeName, hovered } = this.state
    const fullName = name ? name : `${firstName} ${lastName}`

    const [utcOffset, day, hour, minute] = timezone
      ? moment()
          .tz(timezone)
          .format('Z,ddd,H,mm')
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
        {...props}
      >
        <Photo>
          {photo ? <PhotoImage src={photo} /> : <Flag children={countryFlag} />}
        </Photo>
        <Info noBorder={isDragging || noBorder}>
          <Start>
            <Time>
              <Hour>{hour}</Hour>
              :
              <MinuteWithFade index={index}>{minute}</MinuteWithFade>
            </Time>
            <ExtraTime>
              {day}{' '}
              {hovered && (
                <Fragment>
                  <Separator /> ({offset})
                </Fragment>
              )}
            </ExtraTime>
          </Start>

          <End>
            <Name>{safeName}</Name>
            <City>{city}</City>
          </End>
        </Info>
      </Wrapper>
    )
  }

  componentDidMount() {
    const ipc = electron.ipcRenderer || false
    if (!ipc) {
      return
    }

    ipc.on('rerender', () => {
      this.forceUpdate()
    })
  }

  componentWillReceiveProps(newProps) {
    if (this.props.name && this.props.name !== newProps.name) {
      this.setState({ safeName: this.getSafeName(newProps.name) })
    } else if (this.props.firstName !== newProps.firstName) {
      this.setState({ safeName: this.getSafeName(newProps.firstName) })
    }
  }

  mouseEntered = () => {
    this.setState({ hovered: true })
  }

  mouseLeft = () => {
    this.setState({ hovered: false })
  }

  getSafeName = name => {
    const MAX = 14
    let safeName

    if (name.length > MAX) {
      safeName = `${name.substr(0, MAX)}…`
    } else {
      safeName = name
    }

    return safeName
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
