import React from 'react'
import { ThemeProvider } from 'styled-components'

import theme from '../utils/theme'
import ErrorBoundary from './ErrorBoundary'
import App from './App'

const Root = () => (
  <ThemeProvider theme={theme}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </ThemeProvider>
)

export default Root
