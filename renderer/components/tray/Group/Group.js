import React, { Component } from 'react'
import styled from 'styled-components'
import AnimateHeight from 'react-animate-height'

// Local
import Head from './Head'
import Content from './Content'

class Group extends Component {
  static defaultProps = {
    defaultCollapsed: null,
    onCollapse: () => {},
  }

  state = { collapsed: this.props.defaultCollapsed }

  render() {
    const { title, children, ...props } = this.props
    const { collapsed } = this.state

    return (
      <Wrapper {...props} collapsed={collapsed}>
        {title && (
          <Head collapsed={collapsed} onClick={this.headClicked}>
            {title}
          </Head>
        )}
        <AnimateHeight duration={100} height={collapsed ? 0 : 'auto'}>
          <Content collapsed={collapsed}>{children}</Content>
        </AnimateHeight>
      </Wrapper>
    )
  }

  headClicked = () => {
    const collapsed = !this.state.collapsed
    // Toggle
    this.setState({ collapsed: collapsed })
    requestAnimationFrame(() => {
      this.props.onCollapse(collapsed)
    })
  }
}

export default Group

const Wrapper = styled.div`
  flex: 0 0 auto;
  position: relative;
  overflow: hidden;
`
