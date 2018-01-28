import React from 'react'
import { render } from 'react-dom'
import './globalStyles'

import Root from './components/Root'

render(<Root />, document.getElementById('root'))

if (module.hot) {
  module.hot.accept(() => {
    render(<Root />, document.getElementById('root'))
  })
}
