// Modules
import React, { Component } from 'react'
import styled from 'styled-components'
import { Connect, query } from 'urql'

import { transition } from '../utils/styles/mixins'
import provideTheme from '../utils/styles/provideTheme'
import provideUrql from '../utils/urql/provideUrql'
import ErrorBoundary from '../components/ErrorBoundary'
import WindowWrapper from '../components/window/WindowWrapper'
import TitleBar from '../components/window/TitleBar'
import SafeArea from '../components/window/SafeArea'
import Heading from '../components/window/Heading'
import { StyledButton } from '../components/Link'
import Desc from '../components/window/Desc'
import PersonSearch from '../components/add/PersonSearch'

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
                <Desc style={{ marginTop: 10 }}>
                  Type person name to search in users or add manually.
                </Desc>
              </Center>

              <PersonSearch
                items={[
                  {
                    photoUrl: '/static/demo/phil.jpg',
                    name: 'Phil Pluckthun',
                    time: '12:35',
                    flag: '🇬🇧',
                  },
                  {
                    photoUrl: '/static/demo/profile-photo.jpg',
                    name: 'Mohammad Rajabifard',
                    time: '11:05',
                    flag: '🇮🇷',
                  },
                ]}
              />

              <Connect query={query(TitleQuery)}>
                {({ loaded, fetching, refetch, data, error }) => {
                  console.log({ loaded, fetching, refetch, data, error })
                  return <div>hey</div>
                }}
              </Connect>

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

export default provideTheme(provideUrql(Add))

const TitleQuery = `
query {
  title
}
`

//////////// STYLES
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

  text-align: center;
  font-size: 14px;
  color: #888;
  opacity: 0.6;

  /* Reserve some padding for hover */
  padding: ${p => p.theme.sizes.sidePaddingLarge}px 0;

  ${transition('opacity')};

  &:hover {
    opacity: 1;
  }
`
