// Modules
import React, { Component } from 'react'

// Local
import Heading from '../../window/Heading'
import { StyledButton } from '../../Link'
import Desc from '../../window/Desc'
import PersonSearch from './PersonSearch'
import FlexWrapper from '../../window/FlexWrapper'
import { Center, LinkWrapper } from '../helpers'

class SearchPage extends Component {
  state = {}

  render() {
    const { pageRouter } = this.props
    return (
      <FlexWrapper>
        <Center>
          <Heading>Add Person</Heading>
          <Desc style={{ marginTop: 10, marginBottom: 20 }}>
            Type person name to search in users or add manually.
          </Desc>
        </Center>

        <PersonSearch onManuallyClick={() => pageRouter.goToAddManually()} />

        <LinkWrapper>
          or{' '}
          <StyledButton onClick={() => pageRouter.goToAddPlace()}>
            Add Place
          </StyledButton>{' '}
          instead!
        </LinkWrapper>
      </FlexWrapper>
    )
  }
}

export default SearchPage
