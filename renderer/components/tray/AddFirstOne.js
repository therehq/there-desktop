import React from 'react'
import styled from 'styled-components'

import SingleStar from '../../vectors/SingleStar'
import TinyButton from '../TinyButton'
import Banner from './Banner'
import Title from './Title'
import Desc from './Desc'

const AddFirstOne = ({ onAddClick }) => (
  <Banner>
    <SingleStar />
    <Title>Almost There!</Title>
    <Desc>Go ahead and add your first friend or place to have their time!</Desc>

    <ButtonWrapper>
      <TinyButton primary={true} onClick={onAddClick}>
        Add Person or Place
      </TinyButton>
    </ButtonWrapper>
  </Banner>
)

export default AddFirstOne

const ButtonWrapper = styled.div`
  margin-top: 20px;
`
