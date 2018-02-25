import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

class Person extends React.Component {
  static propTypes = {
    photo: PropTypes.string,
    hour: PropTypes.number.isRequired,
    minute: PropTypes.number.isRequired,
    timezone: PropTypes.string,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string,
    city: PropTypes.string,
    fullLocation: PropTypes.string,
    day: PropTypes.string,
    noBorder: PropTypes.bool,
  }

  static defaultProps = {
    hour: 0,
    minute: 0,
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
      hour,
      minute,
      timezone,
      city,
      firstName,
      lastName,
      fullLocation,
      day,
      noBorder,
      ...props
    } = this.props

    const { safeName, hovered } = this.state
    const fullName = `${firstName} ${lastName}`

    return (
      <Wrapper
        title={fullName}
        onMouseEnter={this.mouseEntered}
        onMouseLeave={this.mouseLeft}
        {...props}
      >
        <Photo>{photo && <PhotoImage src={photo} />}</Photo>
        <Info noBorder={noBorder}>
          <Start>
            <Time>
              {hour}
              <Minute>:{String(minute).padStart(2, `0`)}</Minute>
            </Time>
            <ExtraTime>{hovered ? timezone : day}</ExtraTime>
          </Start>

          <End>
            <Name>{safeName}</Name>
            <City title={fullLocation}>{city}</City>
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

export default Person

export const height = 55
const photoSize = 42
const firstLineFontSize = 18
const secondLineFontSize = 12

const Wrapper = styled.div`
  height: ${height}px;
  display: flex;
  overflow: hidden; /* for safety, to not leak elements into whole UI */
  background: transparent;
  color: white;

  transition: background 80ms ease-out;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`

// Photo
const Photo = styled.div`
  flex: 0 1 auto;
  width: ${photoSize}px;
  height: ${photoSize}px;
  margin-left: ${p => p.theme.sizes.sidePadding}px;
  margin-right: ${p => p.theme.sizes.sidePadding}px;
  border-radius: ${photoSize / 2}px;
  overflow: hidden;
  align-self: center;
`

const PhotoImage = styled.img`
  display: block;
  max-height: ${photoSize}px;
  width: auto;
`

// Info
const Info = styled.div`
  flex: 1 1 auto;
  padding-right: ${p => p.theme.sizes.sidePadding}px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: ${p =>
    !p.noBorder ? `1px solid ${p.theme.colors.lighter}` : 'none'};
`

const Start = styled.div``

const End = styled.div`
  text-align: right;
`

const Name = styled.div`
  font-size: ${firstLineFontSize}px;
  text-align: right;
  color: ${p => p.theme.colors.lightText};
`

const Time = styled.div`
  font-size: ${firstLineFontSize}px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`

const Minute = styled.span`
  font-weight: normal;
  color: ${p => p.theme.colors.lightText};
`

// const Separator = styled.span`
//   display: inline-block;
//   vertical-align: middle;

//   width: 4px;
//   height: 4px;
//   border-radius: 4px;
//   background: rgba(255, 255, 255, 0.15);
// `

const secondLineStyles = css`
  font-size: ${secondLineFontSize}px;
  color: ${p => p.theme.colors.lightMutedText};
`

const ExtraTime = styled.div`
  ${secondLineStyles};
`

const City = styled.div`
  ${secondLineStyles};
`
