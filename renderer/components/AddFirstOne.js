import React from 'react'
import styled from 'styled-components'

import SingleStar from '../vectors/SingleStar'
import TinyButton from './TinyButton'

const AddFirstOne = () => (
  <Wrapper>
    <SingleStar />
    <Title>Almost There!</Title>
    <Desc>Go ahead and add your first friend or place to have their time!</Desc>

    <ButtonWrapper>
      <TinyButton primary={true}>Add Person or Place</TinyButton>
    </ButtonWrapper>
  </Wrapper>
)

export default AddFirstOne

const Wrapper = styled.div`
  height: 100%;
  padding: ${p => p.theme.sizes.sidePadding}px;
  overflow: hidden; /* for safety, to not leak elements into whole UI */
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  border-radius: 5px 5px 0 0;
  background: ${p => p.theme.colors.light};
`

const Title = styled.div`
  margin-top: ${p => p.theme.sizes.sidePadding}px;

  font-size: ${p => p.theme.sizes.fontSizeBigger};
  font-weight: bold;
  color: ${p => p.theme.colors.lightText};
`

const Desc = styled.div`
  font-size: ${p => p.theme.sizes.fontSizeNormal};
  margin-top: ${p => p.theme.sizes.sidePadding / 1.5}px;
  color: ${p => p.theme.colors.lightMutedText};
`

const ButtonWrapper = styled.div`
  margin-top: 20px;
`
