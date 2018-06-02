// Modules
import React, { Component } from 'react'

// Local
import Desc from '../../window/Desc'
import Heading from '../../window/Heading'
import PersonSearch from './PersonSearch'
import FlexWrapper from '../../window/FlexWrapper'
import { Center } from '../helpers'

class SearchPage extends Component {
  state = {}

  render() {
    const { pageRouter } = this.props
    return (
      <FlexWrapper>
        <Center>
          <Heading>Add a User</Heading>
          <Desc style={{ marginTop: 10, marginBottom: 20 }}>
            If they have There, find and follow. Otherwise, add manually.
          </Desc>
        </Center>

        <PersonSearch
          onManuallyClick={pageRouter.goToAddManually}
          onPlaceClick={pageRouter.goToAddPlace}
        />
      </FlexWrapper>
    )
  }
}

export default SearchPage
