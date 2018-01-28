import React from 'react'
import styled from 'styled-components'

import People from '../vectors/People'

const JoinBox = () => (
  <Wrapper>
    <Photo>
      <People />
    </Photo>
    <Content>
      <Title>Enable Auto-Sync!</Title>
      <Desc>
        Join for free or login using with Twitter in seconds. Why join →
      </Desc>
    </Content>
  </Wrapper>
)

export default JoinBox

const Wrapper = styled.div`
  height: auto;
  flex: 0 0 auto;
  display: flex;
  overflow: hidden; /* for safety, to not leak elements into whole UI */
  padding: 10px ${p => p.theme.sizes.sidePadding}px;

  box-sizing: border-box;
  border-top: 1px solid ${p => p.theme.colors.lighter};
  background: url(${require('../assets/tile.svg')}),
    ${p => p.theme.colors.light};
  background-size: 40px;
  background-position: 0 -30px;
  color: white;

  transition: background 80ms ease-out;

  &:hover {
    background: url(${require('../assets/tile.svg')}),
      ${p => p.theme.colors.lighter};
    background-size: 40px;
    background-position: -10px -20px;
  }
`

const Photo = styled.div`
  flex: 0 0 auto;
  margin-right: ${p => p.theme.sizes.sidePadding + 2}px;
  opacity: 0.7;
`

const Content = styled.div`
  flex: 1 1 auto;
  padding: 3px 0;
`

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${p => p.theme.colors.lightText};
  color: ${p => p.theme.colors.blue};
`

const Desc = styled.div`
  font-size: ${p => p.theme.sizes.fontSizeTiny};
  color: ${p => p.theme.colors.lightMutedText};
  margin-top: 3px;
`
