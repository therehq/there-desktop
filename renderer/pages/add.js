// Modules
import React, { Component } from 'react'
import styled from 'styled-components'

import { transition } from '../utils/mixins'
import provideTheme from '../utils/provideTheme'
import ErrorBoundary from '../components/ErrorBoundary'
import WindowWrapper from '../components/window/WindowWrapper'
import TitleBar from '../components/window/TitleBar'
import SafeArea from '../components/window/SafeArea'
import Heading from '../components/window/Heading'
import Desc from '../components/window/Desc'
import { StyledButton } from '../components/Link'
import Input from '../components/Input'
import Person from '../vectors/Person'

class Add extends Component {
  render() {
    return (
      <ErrorBoundary>
        <WindowWrapper flex={true}>
          <TitleBar />
          <SafeArea>
            <FlexWrapper>
              <Center>
                <Heading>Add Person</Heading>
                <Desc style={{ marginTop: 10, textAlign: 'center' }}>
                  Type person name to search in users or add manually.
                </Desc>

                <Input textAlign="left" iconComponent={Person} />
              </Center>

              <LinkWrapper>
                or <StyledButton>Add Place</StyledButton> instead!
              </LinkWrapper>
            </FlexWrapper>
          </SafeArea>
        </WindowWrapper>
      </ErrorBoundary>
    )
  }
}

export default provideTheme(Add)

const FlexWrapper = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
`

const Center = styled.div`
  text-align: center;
`

const LinkWrapper = styled.div`
  margin-top: auto;
  margin-bottom: ${p => p.theme.sizes.sidePaddingLarge}px;

  text-align: center;
  font-size: 14px;
  color: #888;
  opacity: 0.6;

  /* Reserve some padding for hover */
  position: relative;
  padding: ${p => p.theme.sizes.sidePaddingLarge}px 0;
  bottom: ${p => -p.theme.sizes.sidePaddingLarge}px; /* Attach to bottom */

  ${transition('opacity')};

  &:hover {
    opacity: 1;
  }
`
