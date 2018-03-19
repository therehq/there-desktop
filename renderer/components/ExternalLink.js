import electron from 'electron'
import React from 'react'

export default class ExternalLink extends React.Component {
  render() {
    const { href, ...props } = this.props
    return (
      <a
        {...props}
        href="#"
        onClick={() => {
          const shell = electron.shell || false
          if (!shell) {
            return
          }
          shell.openExternal(href)
        }}
      />
    )
  }
}
