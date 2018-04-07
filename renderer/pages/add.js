// Packages
import React, { Component } from 'react'

// Local
import provideTheme from '../utils/styles/provideTheme'
import provideUrql from '../utils/urql/provideUrql'
import ErrorBoundary from '../components/ErrorBoundary'
import WindowWrapper from '../components/window/WindowWrapper'
import ConnectionBar from '../components/window/ConnectionBar'
import TitleBar from '../components/window/TitleBar'
import SafeArea from '../components/window/SafeArea'
import PlacePage from '../components/add/Place'
import PersonPage from '../components/add/Person'
import SearchPage from '../components/add/Search'

const pagesKeys = {
  searchUser: 0,
  manually: 1,
  place: 2,
}

class Add extends Component {
  state = {
    activePage: pagesKeys.searchUser,
  }

  render() {
    return (
      <ErrorBoundary>
        <WindowWrapper flex={true}>
          <ConnectionBar />
          <TitleBar />
          <SafeArea>{this.renderPage()}</SafeArea>
        </WindowWrapper>
      </ErrorBoundary>
    )
  }

  renderPage() {
    const { activePage } = this.state
    const pageRouter = this.getPageRouter()

    switch (activePage) {
      case pagesKeys.searchUser:
        return <SearchPage pageRouter={pageRouter} />

      case pagesKeys.manually:
        return <PersonPage pageRouter={pageRouter} />

      case pagesKeys.place:
        return <PlacePage pageRouter={pageRouter} />

      default:
        return null
    }
  }

  getPageRouter = () => ({
    goToSearchUsers: () => {
      this.setState({ activePage: pagesKeys.searchUser })
    },
    goToAddManually: () => {
      this.setState({ activePage: pagesKeys.manually })
    },
    goToAddPlace: () => {
      this.setState({ activePage: pagesKeys.place })
    },
  })
}

export default provideTheme(provideUrql(Add))
