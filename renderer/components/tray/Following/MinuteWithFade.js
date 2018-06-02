import React from 'react'
import { string, number, bool } from 'prop-types'

// Local
import { Minute, fadeIn, fadeOut } from './styles'

export default class MinuteWithFade extends React.Component {
  static propTypes = { children: string, index: number, compact: bool }
  static defaultProps = { index: 0 }

  constructor(props) {
    super(props)
    this.state = { minute: props.children, animation: null }
    this.delay = props.index * 32
  }

  render() {
    const { minute, animation } = this.state
    const { compact } = this.props
    return (
      <Minute compact={compact} animation={animation}>
        {minute}
      </Minute>
    )
  }

  componentWillReceiveProps(newProps) {
    if (newProps.children !== this.state.minute) {
      // Animate value change on re-render
      setTimeout(() => {
        this.setState({ animation: fadeOut })
      }, this.delay)

      setTimeout(() => {
        this.setState({ animation: fadeIn, minute: newProps.children })
      }, this.delay + 100)

      setTimeout(() => {
        this.setState({ animation: null })
      }, this.delay + 200)
    } else {
      // Set children on initial render
      this.setState({ minute: newProps.children })
    }
  }
}
