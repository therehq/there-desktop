import { Component } from 'react'
import { Provider } from 'urql'

import { client } from './client'
import { getDisplayName } from '../hoc'

export default WrappedComponent =>
  class extends Component {
    displayName = `provideUrql(${getDisplayName(WrappedComponent)})`

    render() {
      return (
        <Provider client={client}>
          <WrappedComponent {...this.props} />
        </Provider>
      )
    }
  }
