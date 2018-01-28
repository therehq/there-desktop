import React, { Component } from 'react'
import styled from 'styled-components'

class ErrorBoundary extends Component {
  state = {
    error: null,
    hasError: false,
    showError: false,
  }

  componentDidCatch(e) {
    this.setState({ hasError: true, error: e.message })
  }

  render() {
    return this.state.hasError ? (
      <Wrapper>
        <Title>Uh, there was an error 😞</Title>
        <Desc>
          Engineering team already notified of the catch, but you can go ahead
          and chat with us.
        </Desc>
        {!this.state.showError && (
          <ShowError onClick={() => this.setState({ showError: true })}>
            Show error →
          </ShowError>
        )}
        {this.state.showError && <Error>{this.state.error}</Error>}
      </Wrapper>
    ) : (
      this.props.children
    )
  }
}

export default ErrorBoundary

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 17px;
  overflow-x: hidden;
  overflow-y: auto;
  background: ${p => p.theme.colors.light};
  color: ${p => p.theme.colors.lightText};
`

const Title = styled.h2`
  margin: 0;
  font-size: ${p => p.theme.sizes.fontSizeBig};
  font-weight: bold;
  color: white;
`

const Desc = styled.p`
  margin: 10px 0 0 0;

  font-size: ${p => p.theme.sizes.fontSizeNormal};
  line-height: 1.3;
  color: ${p => p.theme.colors.lightText};
`

const ShowError = styled.button`
  display: inline-block;
  margin: 10px 0 0 0;
  padding: 5px 0;

  font-size: ${p => p.theme.sizes.fontSizeTiny};
  color: ${p => p.theme.colors.lightMutedText};
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
`

const Error = styled.pre`
  display: block;
  margin: 15px 0 0 0;
  overflow-x: auto;

  font-family: Inconsolata, Monaco, monospace;
  font-size: ${p => p.theme.sizes.fontSizeTiny};
  color: ${p => p.theme.colors.lightMutedText};
`
