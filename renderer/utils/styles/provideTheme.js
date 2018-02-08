import { Component } from 'react'
import { ThemeProvider } from 'styled-components'

import theme from './theme'
import { getDisplayName } from '../hoc'

export default WrappedComponent =>
  class extends Component {
    displayName = `provideTheme(${getDisplayName(WrappedComponent)})`

    render() {
      return (
        <ThemeProvider theme={theme}>
          <WrappedComponent {...this.props} />
        </ThemeProvider>
      )
    }
  }
