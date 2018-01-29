import React from 'react'
import styled, { css } from 'styled-components'

const Person = props => {
  const {
    photo = '/static/demo/profile-photo.jpg',
    hour = 3,
    minute = 50,
    timezone = 'GMT -3:30',
    name = 'Sarah',
    city = 'Vienna',
    day = 'Tue',
    noBorder,
    ...rest
  } = props

  let safeName
  const MAX = 12
  if (name.length > MAX) {
    safeName = `${name.substr(0, MAX)}…`
  } else {
    safeName = name
  }

  return (
    <Wrapper {...rest}>
      <Photo>
        <PhotoImage src={photo} />
      </Photo>
      <Info noBorder={noBorder}>
        <Start>
          <Time>
            {hour}
            <Minute>:{minute}</Minute>
          </Time>
          <ExtraTime>
            {timezone} <Separator /> {day}
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

const Separator = styled.span`
  display: inline-block;
  vertical-align: middle;

  width: 4px;
  height: 4px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.15);
`

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
