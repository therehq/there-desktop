import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'

// Styled Components
import {
  Wrapper,
  Photo,
  PhotoImage,
  Info,
  Start,
  End,
  Name,
  Time,
  Minute,
  ExtraTime,
  City,
  Separator,
} from './styles'

class FollowingComp extends React.Component {
  static propTypes = {
    photo: PropTypes.string,
    timezone: PropTypes.string,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string,
    city: PropTypes.string,
    fullLocation: PropTypes.string,
    noBorder: PropTypes.bool,
  }

  static defaultProps = {
    firstName: 'Me',
  }

  constructor(props) {
    super(props)

    this.state = {
      safeName: this.getSafeName(props.firstName),
      hovered: false,
    }
  }

  render() {
    const {
      photo,
      timezone,
      city,
      fullLocation = city,
      firstName,
      lastName,
      noBorder,
      ...props
    } = this.props

    const { safeName, hovered } = this.state
    const fullName = `${firstName} ${lastName}`

    console.log(timezone)

    const momentTz = moment().tz(timezone)
    const [offset, day, hour, minute] = timezone
      ? momentTz.format('Z,ddd,H,mm').split(',')
      : []

    return (
      <Wrapper
        title={`${fullName}\n(${fullLocation})`}
        onMouseEnter={this.mouseEntered}
        onMouseLeave={this.mouseLeft}
        {...props}
      >
        <Photo>{photo && <PhotoImage src={photo} />}</Photo>
        <Info noBorder={noBorder}>
          <Start>
            <Time>
              {hour}
              <Minute>:{minute}</Minute>
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

  componentWillReceiveProps(newProps) {
    if (this.props.firstName !== newProps.firstName) {
      this.setState({ safeName: this.getSafeName(newProps.firstName) })
    }
  }

  mouseEntered = () => {
    this.setState({ hovered: true })
  }

  mouseLeft = () => {
    this.setState({ hovered: false })
  }

  getSafeName = firstName => {
    const MAX = 12
    let safeName

    if (firstName.length > MAX) {
      safeName = `${firstName.substr(0, MAX)}…`
    } else {
      safeName = firstName
    }

    return safeName
  }
}

export default FollowingComp
