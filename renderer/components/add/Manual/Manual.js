// Modules
import React, { Component } from 'react'

// Local
import Heading from '../../window/Heading'
import { StyledButton } from '../../Link'
import Desc from '../../window/Desc'
import ManualAddForm from './ManualAddForm'
import { Center, FlexWrapper, LinkWrapper } from '../helpers'

class SearchPage extends Component {
  render() {
    const { pageRouter } = this.props

    return (
      <FlexWrapper>
        <Center>
          <Heading>Add Person Manually</Heading>
          <Desc style={{ marginTop: 10, marginBottom: 20 }}>
            When someone isn't a user, have it manually!
          </Desc>
        </Center>

        <ManualAddForm />

        <LinkWrapper>
          <StyledButton onClick={() => pageRouter.goToAddPlace()}>
            Add Place
          </StyledButton>{' '}
          or{' '}
          <StyledButton onClick={() => pageRouter.goToSearchUsers()}>
            Search Users
          </StyledButton>{' '}
          instead!
        </LinkWrapper>
      </FlexWrapper>
    )
  }
}

export default SearchPage
